-- Fix delete policy for family_relationships table
-- This migration fixes the issue where users cannot delete family relationships

-- Drop the existing delete policy
DROP POLICY IF EXISTS "Users can delete own family relationships" ON public.family_relationships;

-- Create a more permissive delete policy
-- Users should be able to delete relationships where they are either parent or child
CREATE POLICY "Users can delete family relationships" ON public.family_relationships
  FOR DELETE 
  USING (
    auth.uid() = parent_id 
    OR auth.uid() = child_id
  );

-- Also ensure the update policy works correctly for status changes
DROP POLICY IF EXISTS "Users can update own family relationships" ON public.family_relationships;

CREATE POLICY "Users can update family relationships" ON public.family_relationships
  FOR UPDATE 
  USING (
    auth.uid() = parent_id 
    OR auth.uid() = child_id
  )
  WITH CHECK (
    auth.uid() = parent_id 
    OR auth.uid() = child_id
  );

-- Add a function to handle relationship deletions more reliably
CREATE OR REPLACE FUNCTION delete_family_relationship(relationship_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_parent_id UUID;
  v_child_id UUID;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Get the relationship details
  SELECT parent_id, child_id INTO v_parent_id, v_child_id
  FROM public.family_relationships
  WHERE id = relationship_id;
  
  -- Check if user is authorized to delete
  IF v_user_id = v_parent_id OR v_user_id = v_child_id THEN
    DELETE FROM public.family_relationships WHERE id = relationship_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_family_relationship TO authenticated;