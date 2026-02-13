-- Add role column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'parent';

-- Add cefr_level column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS cefr_level TEXT DEFAULT 'B1';

-- Add avatar_url column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add family_id column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS family_id UUID;
