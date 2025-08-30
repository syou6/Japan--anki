# Stripe本番環境 最終設定

## ✅ 作成された料金プラン

### AI Voice Journal ベーシックプラン
- **商品ID**: prod_SxZO5IqYKZmN32
- **説明**: 音声日記を無制限に記録。AI文字起こし・要約機能付き。家族と思い出を共有。

#### 料金オプション:
1. **月額プラン**: ¥500/月
   - 価格ID: `price_1S1eFYLPb2fukwSM2hclG90B`
   
2. **年額プラン**: ¥5,000/年（2ヶ月分お得！）
   - 価格ID: `price_1S1eFqLPb2fukwSMRosadxxx`
   - 通常¥6,000 → ¥5,000（¥1,000お得）

## 📝 環境変数（Vercelに設定）

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_51S0guDLPb2fukwSMiEXRrqNdpWRAFUGtCHUNQyGtKV0qCvJaEhupONgd47bsZKxs4i45JQFJzz9aHRHK1ISnqzlP00kEKZqzqh
VITE_STRIPE_MONTHLY_PRICE_ID=price_1S1eFYLPb2fukwSM2hclG90B
VITE_STRIPE_YEARLY_PRICE_ID=price_1S1eFqLPb2fukwSMRosadxxx
```

## 🔒 Supabase Edge Functions環境変数

```env
STRIPE_SECRET_KEY=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
```

## 🗑️ アーカイブされたプラン

- ~~プレミアムプラン (¥980/月)~~ - 無効化済み
- ~~ファミリープラン (¥1,980/月)~~ - 無効化済み

## 💰 価格比較

| プラン | 月額換算 | 年間総額 | お得度 |
|--------|----------|----------|---------|
| 月額プラン | ¥500 | ¥6,000 | - |
| 年額プラン | ¥417 | ¥5,000 | ¥1,000お得 (17%OFF) |

## 🚀 次のステップ

1. **Vercelダッシュボードで環境変数を設定**
   ```bash
   vercel env add VITE_STRIPE_PUBLIC_KEY production
   vercel env add VITE_STRIPE_MONTHLY_PRICE_ID production
   vercel env add VITE_STRIPE_YEARLY_PRICE_ID production
   ```

2. **Supabaseで環境変数を設定**
   - Project Settings > Edge Functions > Secrets
   - `STRIPE_SECRET_KEY`を追加

3. **フロントエンドコードを更新**
   - 料金表示コンポーネントを月額/年額切り替えに対応
   - チェックアウトボタンを両プランに対応

4. **Webhook設定**
   - Stripeダッシュボード > Webhooks
   - エンドポイント: `https://[project].supabase.co/functions/v1/stripe-webhook`

## 📊 Stripe CLI管理コマンド

```bash
# 商品確認
stripe --api-key sk_live_xxx products retrieve prod_SxZO5IqYKZmN32

# 価格確認
stripe --api-key sk_live_xxx prices list --product=prod_SxZO5IqYKZmN32

# サブスクリプション一覧
stripe --api-key sk_live_xxx subscriptions list

# 顧客一覧
stripe --api-key sk_live_xxx customers list
```