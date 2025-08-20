# Firebase設定手順

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名：`nikki-ai` を入力
4. Googleアナリティクスは「今はスキップ」

## 2. ウェブアプリを追加

1. プロジェクトのダッシュボードで「</> ウェブ」アイコンをクリック
2. アプリ名：`日記AI` を入力
3. 「Firebase Hosting」のチェックは外す
4. 「アプリを登録」をクリック

## 3. Firebase設定値をコピー

以下のような設定値が表示されます：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "nikki-ai.firebaseapp.com",
  projectId: "nikki-ai",
  storageBucket: "nikki-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 4. Cloud Messagingを有効化

1. 左メニューから「Cloud Messaging」を選択
2. 「Cloud Messaging API (Legacy)」を有効化
3. 「ウェブプッシュ証明書」タブから「鍵ペアを生成」をクリック
4. 生成された公開鍵をコピー

## 5. .envファイルに設定を追加

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=ここにapiKeyを貼り付け
VITE_FIREBASE_AUTH_DOMAIN=ここにauthDomainを貼り付け
VITE_FIREBASE_PROJECT_ID=ここにprojectIdを貼り付け
VITE_FIREBASE_STORAGE_BUCKET=ここにstorageBucketを貼り付け
VITE_FIREBASE_MESSAGING_SENDER_ID=ここにmessagingSenderIdを貼り付け
VITE_FIREBASE_APP_ID=ここにappIdを貼り付け

# FCM Public Key (ウェブプッシュ証明書)
VITE_FCM_PUBLIC_KEY=ここに生成された公開鍵を貼り付け
```

## 6. Firebaseファイルを更新

1. `/src/lib/firebase.ts` の設定値を環境変数から読み込むように更新（既に完了）
2. `/public/firebase-messaging-sw.js` の設定値を更新

## 7. アプリを再起動

```bash
npm run dev
```

## テスト方法

1. 設定画面で通知を有効化
2. アプリを完全に閉じる
3. 別のアカウントから日記を投稿
4. 通知が届くことを確認

---

## トラブルシューティング

### 通知が届かない場合

1. ブラウザの通知権限を確認
2. Firebase Consoleで「Cloud Messaging」が有効になっているか確認
3. コンソールログでエラーを確認
4. Service Workerが正しく登録されているか確認（開発者ツール → Application → Service Workers）

### iOSで通知が届かない場合

1. iOS 16.4以降であることを確認
2. PWAとしてホーム画面に追加されていることを確認
3. 設定アプリで「日記AI」の通知権限を確認