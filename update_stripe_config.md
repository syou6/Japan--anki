# Stripe MCP設定を本番用に更新

## 現在の設定
- テスト用のAPIキー（sk_test_）が設定されています
- 本番用のAPIキー（sk_live_）に更新が必要です

## 更新手順

### 1. Stripeダッシュボードで本番APIキーを取得
1. [Stripe Dashboard](https://dashboard.stripe.com/)にログイン
2. 本番モードに切り替え
3. 開発者 → APIキー
4. シークレットキー（sk_live_xxx）をコピー

### 2. 設定ファイルを編集
```bash
# nanoエディタで開く
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 3. 以下の部分を更新
```json
"stripe": {
  "command": "npx",
  "args": [
    "-y",
    "@stripe/agent-toolkit",
    "mcp"
  ],
  "env": {
    "STRIPE_API_KEY": "sk_live_ここに本番キーを貼り付け"
  }
}
```
※ "STRIPE_AGENT_TOOLKIT_TESTING": "true" の行は削除

### 4. 保存して終了
- Ctrl+O で保存
- Enter で確定
- Ctrl+X で終了

### 5. Claude Desktopを再起動
- Claude Desktopを完全に終了
- 再度起動

## 設定後にできること
- Stripeの商品・価格を直接作成
- サブスクリプション管理
- 顧客情報の確認
- 支払い履歴の確認
- など

## セキュリティ注意
- APIキーは絶対に公開しない
- GitHubにコミットしない
- 本番キーは慎重に扱う