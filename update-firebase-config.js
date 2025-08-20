// Firebase設定更新スクリプト
// 使い方: node update-firebase-config.js

const fs = require('fs');
const path = require('path');

console.log(`
==================================================
Firebase設定更新スクリプト
==================================================

このスクリプトは、Firebaseの設定を自動的に更新します。

1. Firebaseコンソールにアクセス:
   https://console.firebase.google.com/

2. 以下の手順で設定値を取得してください：

   a) プロジェクトを作成または選択
   b) 歯車アイコン → プロジェクトの設定
   c) 「全般」タブの下部にある設定値をコピー
   d) 「Cloud Messaging」タブから「ウェブプッシュ証明書」の公開鍵をコピー

3. 設定値を以下に入力してください：
`);

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  { key: 'VITE_FIREBASE_API_KEY', prompt: 'API Key: ' },
  { key: 'VITE_FIREBASE_AUTH_DOMAIN', prompt: 'Auth Domain: ' },
  { key: 'VITE_FIREBASE_PROJECT_ID', prompt: 'Project ID: ' },
  { key: 'VITE_FIREBASE_STORAGE_BUCKET', prompt: 'Storage Bucket: ' },
  { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', prompt: 'Messaging Sender ID: ' },
  { key: 'VITE_FIREBASE_APP_ID', prompt: 'App ID: ' },
  { key: 'VITE_FCM_PUBLIC_KEY', prompt: 'FCM Public Key (Web Push Certificate): ' }
];

const config = {};
let currentIndex = 0;

function askQuestion() {
  if (currentIndex >= questions.length) {
    updateFiles();
    return;
  }

  const question = questions[currentIndex];
  rl.question(question.prompt, (answer) => {
    if (answer.trim()) {
      config[question.key] = answer.trim();
    }
    currentIndex++;
    askQuestion();
  });
}

function updateFiles() {
  // .envファイルを更新
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  Object.entries(config).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  });
  
  fs.writeFileSync(envPath, envContent);
  
  // firebase-messaging-sw.jsを更新
  const swPath = path.join(__dirname, 'public', 'firebase-messaging-sw.js');
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  if (config.VITE_FIREBASE_API_KEY) {
    swContent = swContent.replace(
      /apiKey: ".*?"/,
      `apiKey: "${config.VITE_FIREBASE_API_KEY}"`
    );
  }
  if (config.VITE_FIREBASE_AUTH_DOMAIN) {
    swContent = swContent.replace(
      /authDomain: ".*?"/,
      `authDomain: "${config.VITE_FIREBASE_AUTH_DOMAIN}"`
    );
  }
  if (config.VITE_FIREBASE_PROJECT_ID) {
    swContent = swContent.replace(
      /projectId: ".*?"/,
      `projectId: "${config.VITE_FIREBASE_PROJECT_ID}"`
    );
  }
  if (config.VITE_FIREBASE_STORAGE_BUCKET) {
    swContent = swContent.replace(
      /storageBucket: ".*?"/,
      `storageBucket: "${config.VITE_FIREBASE_STORAGE_BUCKET}"`
    );
  }
  if (config.VITE_FIREBASE_MESSAGING_SENDER_ID) {
    swContent = swContent.replace(
      /messagingSenderId: ".*?"/,
      `messagingSenderId: "${config.VITE_FIREBASE_MESSAGING_SENDER_ID}"`
    );
  }
  if (config.VITE_FIREBASE_APP_ID) {
    swContent = swContent.replace(
      /appId: ".*?"/,
      `appId: "${config.VITE_FIREBASE_APP_ID}"`
    );
  }
  
  fs.writeFileSync(swPath, swContent);
  
  console.log('\n✅ 設定を更新しました！');
  console.log('\n次のステップ:');
  console.log('1. npm run dev でアプリを再起動');
  console.log('2. 設定画面で通知を有効化');
  console.log('3. テスト通知を送信して確認');
  
  rl.close();
}

console.log('\n設定値を入力してください（Enterでスキップ）:\n');
askQuestion();