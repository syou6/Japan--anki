# Firebase Cloud Messaging 有効化の詳細手順

## 📱 Cloud Messaging有効化ガイド

### ステップ1: Firebaseコンソールにアクセス
1. [Firebase Console](https://console.firebase.google.com/)を開く
2. 作成したプロジェクト（例：nikki-ai）を選択

### ステップ2: Cloud Messagingページへ移動
1. **左側のメニュー**から以下のいずれかを選択：
   - 「エンゲージメント」セクションの「**Messaging**」
   - または「**Cloud Messaging**」
   
   ![場所：左メニューの中央付近にあります]

### ステップ3: 初回設定（プロジェクト作成直後の場合）
1. Cloud Messagingページを開くと「**開始**」ボタンが表示される場合があります
2. 「**開始**」または「**最初のキャンペーンを作成**」をクリック
3. これでCloud Messagingが自動的に有効化されます

### ステップ4: Web Push証明書の生成（重要！）
1. Cloud Messagingページで「**⚙️ プロジェクト設定**」アイコンをクリック
   - 画面右上の歯車アイコン
   - または「Project Settings」リンク

2. 「**Cloud Messaging**」タブを選択

3. 「**Web configuration**」セクションまでスクロール

4. 「**Web Push certificates**」の項目を探す

5. 以下のいずれかが表示されます：
   
   **ケースA: 鍵ペアがまだない場合**
   ```
   Web Push certificates
   Key pair: [Generate key pair] ボタン
   ```
   → 「**Generate key pair**」ボタンをクリック

   **ケースB: すでに鍵ペアがある場合**
   ```
   Web Push certificates
   Key pair: BPbbeE9g... (長い文字列)
   ```
   → この文字列をコピー

### ステップ5: 生成された公開鍵をコピー
1. 「Generate key pair」をクリックすると、長い文字列が表示されます
2. この文字列（例：`BPbbeE9gPuQBaFzqzQ6s...`）をコピー
3. これが**VAPID公開鍵**（FCM公開鍵）です

### ステップ6: APIの有効化確認
1. プロジェクト設定の「**全般**」タブに戻る
2. 下部の「**あなたのアプリ**」セクションを確認
3. Web アプリの設定値が表示されていることを確認

### ステップ7: .envファイルに追加
```bash
# この公開鍵を.envファイルに追加
VITE_FCM_PUBLIC_KEY=ここにコピーした公開鍵を貼り付け
VITE_VAPID_PUBLIC_KEY=同じ公開鍵を貼り付け（互換性のため）
```

---

## ⚠️ よくある問題と解決方法

### 問題1: Cloud Messagingタブが見つからない
**解決方法：**
1. プロジェクトの歯車アイコン → 「プロジェクトの設定」
2. 上部のタブから「Cloud Messaging」を選択
3. もし見つからない場合は、左メニューの「Messaging」から一度画面を開く

### 問題2: Generate key pairボタンがない
**解決方法：**
1. すでに生成済みの可能性があります
2. 表示されている長い文字列をコピーして使用

### 問題3: エラー「Provider not enabled」が出る
**解決方法：**
1. Google Cloud Console（https://console.cloud.google.com/）にアクセス
2. プロジェクトを選択
3. 「APIとサービス」→「有効なAPI」
4. 「Firebase Cloud Messaging API」を検索して有効化

---

## ✅ 設定完了の確認方法

1. **Firebaseコンソールで確認**
   - Cloud Messaging タブに公開鍵が表示されている
   - ステータスが「有効」になっている

2. **アプリで確認**
   - ブラウザの開発者ツールを開く（F12）
   - Consoleタブで「FCM Token:」が表示される
   - エラーがないことを確認

3. **テスト通知を送信**
   - アプリの設定画面から「テスト通知を送信」
   - 通知が届くことを確認

---

## 📝 チェックリスト

- [ ] Firebaseプロジェクトを作成した
- [ ] Cloud Messagingページにアクセスできた
- [ ] Web Push certificatesを生成した
- [ ] 公開鍵をコピーした
- [ ] .envファイルに公開鍵を追加した
- [ ] firebase-messaging-sw.jsの設定を更新した
- [ ] アプリを再起動した
- [ ] テスト通知が届いた

すべてチェックできたら、バックグラウンド通知が完全に動作します！