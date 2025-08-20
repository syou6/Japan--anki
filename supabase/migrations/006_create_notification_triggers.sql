-- Create notification triggers for automatic push notifications

-- Function to call the notify-new-diary Edge Function when a new diary entry is created
CREATE OR REPLACE FUNCTION notify_family_about_new_diary()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify for non-private diary entries
  IF NEW.is_private = FALSE THEN
    -- Use pg_net to call the Edge Function asynchronously
    PERFORM
      net.http_post(
        url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-new-diary',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key', true)
        ),
        body := jsonb_build_object(
          'record', row_to_json(NEW)
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to call the notify-comment Edge Function when a new comment is created
CREATE OR REPLACE FUNCTION notify_about_new_comment()
RETURNS TRIGGER AS $$
BEGIN
  -- Use pg_net to call the Edge Function asynchronously
  PERFORM
    net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-comment',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key', true)
      ),
      body := jsonb_build_object(
        'record', row_to_json(NEW)
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers (these will be activated when pg_net extension is available)
-- For now, we'll create them but they may not work until pg_net is enabled

-- Trigger for new diary entries
DROP TRIGGER IF EXISTS trigger_notify_family_new_diary ON public.diary_entries;
CREATE TRIGGER trigger_notify_family_new_diary
  AFTER INSERT ON public.diary_entries
  FOR EACH ROW EXECUTE FUNCTION notify_family_about_new_diary();

-- Trigger for new comments  
DROP TRIGGER IF EXISTS trigger_notify_new_comment ON public.diary_comments;
CREATE TRIGGER trigger_notify_new_comment
  AFTER INSERT ON public.diary_comments
  FOR EACH ROW EXECUTE FUNCTION notify_about_new_comment();

-- Create settings for the notification system
-- These settings will be used by the trigger functions
-- You'll need to set these values in your Supabase project settings

-- Note: These settings need to be configured in your Supabase project:
-- 1. Go to Settings > API in Supabase Dashboard
-- 2. Create custom settings or use environment variables
-- 3. Set app.settings.supabase_url to your project URL
-- 4. Set app.settings.supabase_service_role_key to your service role key

-- Example of how to set these (run these manually in SQL editor if needed):
-- ALTER DATABASE postgres SET app.settings.supabase_url = 'https://dtcskayvcsrgjausqkni.supabase.co';
-- ALTER DATABASE postgres SET app.settings.supabase_service_role_key = 'your_service_role_key_here';

-- Alternative webhook approach (if pg_net is not available)
-- You can also use Supabase's webhook functionality in the Dashboard:
-- 1. Go to Database > Webhooks
-- 2. Create webhooks for INSERT on diary_entries and diary_comments tables
-- 3. Set the webhook URLs to your Edge Functions