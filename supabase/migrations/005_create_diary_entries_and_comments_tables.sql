-- Create diary_entries table for storing diary posts
CREATE TABLE IF NOT EXISTS public.diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  transcription TEXT,
  ai_analysis JSONB,
  mood TEXT,
  tags TEXT[],
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own entries and family members' non-private entries
CREATE POLICY "Users can view own diary entries" ON public.diary_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view family diary entries" ON public.diary_entries
  FOR SELECT USING (
    NOT is_private AND 
    EXISTS (
      SELECT 1 FROM public.family_relationships 
      WHERE (parent_id = auth.uid() AND child_id = user_id) OR 
            (child_id = auth.uid() AND parent_id = user_id)
    )
  );

-- Create policy to allow users to create their own entries
CREATE POLICY "Users can create own diary entries" ON public.diary_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own entries
CREATE POLICY "Users can update own diary entries" ON public.diary_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own entries
CREATE POLICY "Users can delete own diary entries" ON public.diary_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON public.diary_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diary_entries_is_private ON public.diary_entries(is_private);

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON public.diary_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create comments table for diary entry comments
CREATE TABLE IF NOT EXISTS public.diary_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_entry_id UUID REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.diary_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.diary_comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view comments on entries they can see
CREATE POLICY "Users can view comments on viewable diary entries" ON public.diary_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.diary_entries 
      WHERE id = diary_entry_id AND (
        user_id = auth.uid() OR 
        (NOT is_private AND EXISTS (
          SELECT 1 FROM public.family_relationships 
          WHERE (parent_id = auth.uid() AND child_id = diary_entries.user_id) OR 
                (child_id = auth.uid() AND parent_id = diary_entries.user_id)
        ))
      )
    )
  );

-- Create policy to allow users to create comments on viewable entries
CREATE POLICY "Users can create comments on viewable entries" ON public.diary_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.diary_entries 
      WHERE id = diary_entry_id AND (
        user_id = auth.uid() OR 
        (NOT is_private AND EXISTS (
          SELECT 1 FROM public.family_relationships 
          WHERE (parent_id = auth.uid() AND child_id = diary_entries.user_id) OR 
                (child_id = auth.uid() AND parent_id = diary_entries.user_id)
        ))
      )
    )
  );

-- Create policy to allow users to update their own comments
CREATE POLICY "Users can update own comments" ON public.diary_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own comments
CREATE POLICY "Users can delete own comments" ON public.diary_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diary_comments_diary_entry_id ON public.diary_comments(diary_entry_id);
CREATE INDEX IF NOT EXISTS idx_diary_comments_user_id ON public.diary_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_comments_parent_comment_id ON public.diary_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_diary_comments_created_at ON public.diary_comments(created_at DESC);

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_diary_comments_updated_at
  BEFORE UPDATE ON public.diary_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();