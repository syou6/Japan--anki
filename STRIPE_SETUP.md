# Stripe課金機能セットアップガイド

## 概要
このアプリケーションにStripeを使用した課金機能を実装しました。以下の手順でセットアップしてください。

## 必要な準備

### 1. Stripeアカウントの作成
1. [Stripe](https://stripe.com/jp)にアクセス
2. アカウントを作成
3. ダッシュボードにログイン

### 2. Stripe APIキーの取得
1. Stripeダッシュボード → 開発者 → APIキー
2. 以下のキーをコピー：
   - 公開可能キー（pk_test_xxx または pk_live_xxx）
   - シークレットキー（sk_test_xxx または sk_live_xxx）

### 3. 商品と価格の作成
1. Stripeダッシュボード → 商品 → 新規追加
2. 以下のプランを作成：

#### プレミアムプラン
- 商品名: プレミアムプラン
- 価格: ¥980/月
- 請求期間: 月次
- 価格IDをメモ（price_xxxxx）

#### ファミリープラン
- 商品名: ファミリープラン
- 価格: ¥1,980/月
- 請求期間: 月次
- 価格IDをメモ（price_xxxxx）

### 4. Webhookの設定
1. Stripeダッシュボード → 開発者 → Webhook
2. エンドポイントを追加：
   - URL: `https://your-domain.supabase.co/functions/v1/stripe-webhook`
3. リッスンするイベント：
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Webhookシークレットをメモ（whsec_xxxxx）

## Supabaseセットアップ

### 1. データベーステーブルの作成
```sql
-- profiles テーブルに課金関連カラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- サブスクリプションテーブル
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT,
  plan_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 支払い履歴テーブル
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount INTEGER,
  currency TEXT DEFAULT 'jpy',
  status TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS（Row Level Security）を有効化
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment history" ON payment_history
  FOR SELECT USING (auth.uid() = user_id);
```

### 2. Edge Functionsのデプロイ
```bash
# Supabase CLIをインストール
npm install -g supabase

# ログイン
supabase login

# プロジェクトをリンク
supabase link --project-ref your-project-ref

# Edge Functionsをデプロイ
supabase functions deploy create-checkout-session
supabase functions deploy cancel-subscription
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook

# 環境変数を設定
supabase secrets set STRIPE_SECRET_KEY=sk_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## 環境変数の設定

`.env`ファイルを作成し、以下を設定：

```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_STRIPE_PREMIUM_PRICE_ID=price_xxx
VITE_STRIPE_FAMILY_PRICE_ID=price_xxx
```

## 実装されている機能

### 1. 料金プラン表示
- `/subscription`ページで料金プランを表示
- 現在のプランをハイライト

### 2. サブスクリプション登録
- Stripe Checkoutを使用した安全な決済
- 30日間の無料トライアル付き

### 3. サブスクリプション管理
- カスタマーポータルでプラン変更・解約
- 支払い方法の更新
- 請求書のダウンロード

### 4. アクセス制御
- プランに応じた機能制限
- 無料プラン: 月10回まで録音
- プレミアムプラン: 無制限

## 使用方法

### ユーザー側
1. アプリにログイン
2. 設定 → サブスクリプション
3. プランを選択して「今すぐ始める」
4. Stripeの決済画面で情報入力
5. 決済完了後、自動でプランがアップグレード

### 管理者側
1. Stripeダッシュボードで売上確認
2. サブスクリプション状況の確認
3. 返金処理（必要な場合）

## トラブルシューティング

### 決済が完了してもプランが更新されない
- Webhookが正しく設定されているか確認
- Supabase Edge Functionのログをチェック
- Stripe Webhookのログを確認

### エラー: "Stripe failed to load"
- 公開可能キーが正しく設定されているか確認
- ブラウザの広告ブロッカーを無効化

### サブスクリプションの同期エラー
- Supabaseのsubscriptionsテーブルを確認
- Stripe Webhookのイベントログを確認

## セキュリティ注意事項

1. **絶対にシークレットキーをフロントエンドに含めない**
2. Webhookエンドポイントで署名検証を必ず実施
3. RLSを使用してデータアクセスを制限
4. 本番環境では必ずHTTPSを使用

## テスト用カード番号

Stripeテスト環境で使用できるカード番号：
- 成功: `4242 4242 4242 4242`
- 拒否: `4000 0000 0000 0002`
- 認証必要: `4000 0025 0000 3155`

有効期限: 任意の将来の日付
CVC: 任意の3桁の数字
郵便番号: 任意の5桁の数字

## サポート

問題が発生した場合：
1. [Stripe公式ドキュメント](https://stripe.com/docs)
2. [Supabase公式ドキュメント](https://supabase.com/docs)
3. アプリケーションのGitHubイシューで報告