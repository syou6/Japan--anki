# Stripe本番環境セットアップ完了

## ✅ 作成された商品と価格

### 1. プレミアムプラン（¥980/月）
- **商品ID**: prod_SxZFfwSkV0GIYJ
- **価格ID**: price_1S1e7PLPb2fukwSMQC0qa6TE
- **月額**: ¥980
- **説明**: 音声日記を無制限に記録。AI文字起こし・要約・感情分析機能付き。家族5名まで共有可能。

### 2. ファミリープラン（¥1,980/月）
- **商品ID**: prod_SxZGgH600OHC1a
- **価格ID**: price_1S1e7qLPb2fukwSMKQ5qGgug
- **月額**: ¥1,980
- **説明**: プレミアムプランの全機能＋家族10名まで共有可能。家族グループ機能、カスタムアルバム作成、年間レポート機能付き。

## 📝 必要な環境変数設定

### 1. Vercel環境変数（設定済み）
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_51S0guDLPb2fukwSMiEXRrqNdpWRAFUGtCHUNQyGtKV0qCvJaEhupONgd47bsZKxs4i45JQFJzz9aHRHK1ISnqzlP00kEKZqzqh
VITE_STRIPE_PREMIUM_PRICE_ID=price_1S1e7PLPb2fukwSMQC0qa6TE
VITE_STRIPE_FAMILY_PRICE_ID=price_1S1e7qLPb2fukwSMKQ5qGgug
```

### 2. Supabase Edge Functions環境変数（要設定）
Supabaseダッシュボード > Project Settings > Edge Functions > Secretsで設定：
```env
STRIPE_SECRET_KEY=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
```

## 🚀 次のステップ

### 1. Vercelに環境変数を設定
```bash
vercel env add VITE_STRIPE_PUBLIC_KEY production
vercel env add VITE_STRIPE_PREMIUM_PRICE_ID production
vercel env add VITE_STRIPE_FAMILY_PRICE_ID production
```

### 2. Supabase Edge Functionsをデプロイ
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy cancel-subscription
supabase functions deploy create-portal-session
```

### 3. Stripe Webhookを設定
1. Stripeダッシュボード > 開発者 > Webhook
2. エンドポイントを追加：
   - URL: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
   - イベント:
     - checkout.session.completed
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment_succeeded
     - invoice.payment_failed

### 4. データベーステーブルを作成
```sql
-- subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT,
  status TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_history table
CREATE TABLE payment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- profiles table update
ALTER TABLE profiles 
ADD COLUMN stripe_customer_id TEXT;
```

## 🧪 テスト手順

1. 本番環境でユーザー登録
2. 料金プランページから「プレミアムプラン」を選択
3. Stripeのチェックアウトページで決済
4. サブスクリプションが有効になることを確認

## 📊 管理・監視

### Stripe CLIコマンド
```bash
# 顧客一覧
stripe --api-key sk_live_xxx customers list

# サブスクリプション一覧
stripe --api-key sk_live_xxx subscriptions list

# 支払い履歴
stripe --api-key sk_live_xxx charges list
```

### ダッシュボード
- [Stripe Dashboard](https://dashboard.stripe.com/)
- 顧客、サブスクリプション、支払い履歴を確認

## ⚠️ セキュリティ注意事項

- シークレットキーは絶対に公開しない
- GitHubにコミットしない
- 環境変数として安全に管理
- 定期的にキーをローテーション