-- Create family_relationships table for managing family connections
CREATE TABLE IF NOT EXISTS public.family_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  relationship_type TEXT DEFAULT 'parent-child',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT different_users CHECK (parent_id != child_id)
);

-- Enable Row Level Security
ALTER TABLE public.family_relationships ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see relationships they are part of
CREATE POLICY "Users can view own family relationships" ON public.family_relationships
  FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- Create policy to allow users to create relationships where they are the parent
CREATE POLICY "Users can create family relationships as parent" ON public.family_relationships
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Create policy to allow users to update relationships they are part of
CREATE POLICY "Users can update own family relationships" ON public.family_relationships
  FOR UPDATE USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- Create policy to allow users to delete relationships they are part of
CREATE POLICY "Users can delete own family relationships" ON public.family_relationships
  FOR DELETE USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- Create unique constraint to prevent duplicate relationships
ALTER TABLE public.family_relationships ADD CONSTRAINT unique_family_relationship UNIQUE (parent_id, child_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_family_relationships_parent_id ON public.family_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_family_relationships_child_id ON public.family_relationships(child_id);
CREATE INDEX IF NOT EXISTS idx_family_relationships_status ON public.family_relationships(status);

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_family_relationships_updated_at
  BEFORE UPDATE ON public.family_relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();