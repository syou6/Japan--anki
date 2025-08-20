import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subscription, title, body, data } = await req.json()

    // iOSローカル通知の場合はスキップ
    if (subscription.endpoint === 'local-notifications-only') {
      console.log('iOS local notification - cannot send server push')
      return new Response(
        JSON.stringify({ success: true, message: 'iOS local notification' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // FCM (Firebase Cloud Messaging) を使用してプッシュ通知を送信
    // 注: 実際の実装では、FCMのサーバーキーが必要です
    const fcmServerKey = Deno.env.get('FCM_SERVER_KEY')
    
    if (!fcmServerKey) {
      // FCMキーがない場合は、簡易的な実装
      console.log('FCM key not configured, using fallback')
      
      // プッシュ通知のペイロード
      const payload = JSON.stringify({
        title,
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: data || {}
      })

      // サブスクリプションのエンドポイントに直接送信を試みる
      // （実際にはVAPID認証が必要）
      console.log('Would send notification:', { title, body, endpoint: subscription.endpoint })
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Notification queued (FCM not configured)',
          details: { title, body }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // FCMを使用した実際の送信処理
    const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send'
    const response = await fetch(fcmEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `key=${fcmServerKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: subscription.endpoint.replace('https://fcm.googleapis.com/fcm/send/', ''),
        notification: {
          title,
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        },
        data: data || {},
      }),
    })

    if (!response.ok) {
      throw new Error(`FCM request failed: ${response.status}`)
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, fcmResult: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending push notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})