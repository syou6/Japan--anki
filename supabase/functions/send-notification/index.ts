import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  userId: string
  title: string
  body: string
  data?: any
}

serve(async (req) => {
  // CORS対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, title, body, data } = await req.json() as NotificationPayload

    // Supabaseクライアントを初期化
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // ユーザーのプッシュサブスクリプションを取得
    const { data: subscription, error: subError } = await fetch(
      `${supabaseUrl}/rest/v1/push_subscriptions?user_id=eq.${userId}`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        }
      }
    ).then(res => res.json())

    if (subError || !subscription || subscription.length === 0) {
      console.log('No subscription found for user:', userId)
      return new Response(
        JSON.stringify({ error: 'No subscription found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const sub = subscription[0]

    // iOSのローカル通知の場合はスキップ
    if (sub.endpoint === 'local-notifications-only') {
      console.log('iOS local notification - skipping push')
      return new Response(
        JSON.stringify({ success: true, message: 'Local notification only' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Web Push通知を送信
    // 注: 実際の実装にはweb-pushライブラリが必要ですが、
    // Denoではwebpushライブラリを使用します
    const notification = {
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {
        ...data,
        url: data?.url || '/'
      }
    }

    // プッシュ通知の送信（簡略化版）
    const pushResponse = await fetch(sub.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'TTL': '86400',
        'Authorization': `Bearer ${sub.auth}`,
        'Crypto-Key': `p256dh=${sub.p256dh}`
      },
      body: JSON.stringify(notification)
    })

    if (!pushResponse.ok) {
      throw new Error(`Push failed: ${pushResponse.status}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})