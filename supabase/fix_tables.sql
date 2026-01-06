-- =====================================================
-- テーブル名を修正 (コードに合わせる)
-- =====================================================
-- 既存のテーブルを削除して再作成

-- 既存テーブルを削除
DROP TABLE IF EXISTS public.diary_comments CASCADE;
DROP TABLE IF EXISTS public.diary_entries CASCADE;

-- =====================================================
-- diaries テーブル (コードに合わせた名前とカラム)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  voice_url TEXT,
  duration INTEGER,
  emotion TEXT DEFAULT '普通',
  health_score INTEGER DEFAULT 75,
  ai_summary TEXT,
  ai_keywords TEXT[],
  tags TEXT[],
  visibility TEXT DEFAULT 'family',
  deleted_at TIMESTAMP WITH TIME ZONE,
  delete_after TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;

-- 自分の日記を見れる
CREATE POLICY "Users can view own diaries" ON public.diaries
  FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

-- 家族の日記を見れる
CREATE POLICY "Users can view family diaries" ON public.diaries
  FOR SELECT USING (
    deleted_at IS NULL AND
    visibility = 'family' AND
    EXISTS (
      SELECT 1 FROM public.family_relationships
      WHERE status = 'accepted' AND (
        (parent_id = auth.uid() AND child_id = user_id) OR
        (child_id = auth.uid() AND parent_id = user_id)
      )
    )
  );

CREATE POLICY "Users can create own diaries" ON public.diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diaries" ON public.diaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diaries" ON public.diaries
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON public.diaries(user_id);
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON public.diaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diaries_deleted_at ON public.diaries(deleted_at);

CREATE TRIGGER update_diaries_updated_at
  BEFORE UPDATE ON public.diaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- comments テーブル (コードに合わせた名前)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID REFERENCES public.diaries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.diaries d
      WHERE d.id = diary_id AND (
        d.user_id = auth.uid() OR
        (d.visibility = 'family' AND EXISTS (
          SELECT 1 FROM public.family_relationships
          WHERE status = 'accepted' AND (
            (parent_id = auth.uid() AND child_id = d.user_id) OR
            (child_id = auth.uid() AND parent_id = d.user_id)
          )
        ))
      )
    )
  );

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_comments_diary_id ON public.comments(diary_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 完了
-- =====================================================
