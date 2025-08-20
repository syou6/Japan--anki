import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    // Supabaseクライアントを初期化
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 投稿者の情報を取得
    const { data: author } = await supabase
      .from('users')
      .select('name')
      .eq('id', record.user_id)
      .single()

    if (!author) {
      return new Response(
        JSON.stringify({ error: 'Author not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // 家族関係を取得
    const { data: relationships } = await supabase
      .from('family_relationships')
      .select('parent_id, child_id')
      .or(`parent_id.eq.${record.user_id},child_id.eq.${record.user_id}`)

    if (!relationships || relationships.length === 0) {
      console.log('No family relationships found')
      return new Response(
        JSON.stringify({ message: 'No family to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 通知対象のユーザーIDを収集
    const familyUserIds = new Set<string>()
    relationships.forEach(rel => {
      if (rel.parent_id !== record.user_id) familyUserIds.add(rel.parent_id)
      if (rel.child_id !== record.user_id) familyUserIds.add(rel.child_id)
    })

    // 通知設定を確認して通知を送信
    for (const userId of familyUserIds) {
      // 通知設定を確認
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('family_diary')
        .eq('user_id', userId)
        .single()

      if (!settings?.family_diary) {
        console.log(`User ${userId} has disabled family diary notifications`)
        continue
      }

      // プッシュサブスクリプションを取得
      const { data: subscription } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!subscription) {
        console.log(`No subscription found for user ${userId}`)
        continue
      }

      // 通知を送信
      const notificationTitle = '新しい日記が投稿されました'
      const notificationBody = `${author.name}さんが日記を投稿しました`
      
      // Edge Function経由で通知送信
      const { error: notifyError } = await supabase.functions.invoke('send-push', {
        body: {
          subscription,
          title: notificationTitle,
          body: notificationBody,
          data: {
            url: '/diary',
            diaryId: record.id
          }
        }
      })

      if (notifyError) {
        console.error(`Failed to notify user ${userId}:`, notifyError)
      } else {
        console.log(`Successfully notified user ${userId}`)
      }
    }

    return new Response(
      JSON.stringify({ success: true, notified: familyUserIds.size }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in notify-new-diary:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})