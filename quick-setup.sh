#!/bin/bash

echo "========================================="
echo "  Firebase 簡単設定スクリプト"
echo "========================================="
echo ""
echo "Firebaseコンソールから設定値をコピーしてください："
echo "プロジェクト設定 → 全般 → あなたのアプリ"
echo ""

# .envファイルに追加
cat >> .env << 'EOF'

# VAPID Keys (自動生成済み)
VITE_VAPID_PUBLIC_KEY=BPbbeE9gPuQBaFzqzQ6sODqkCH4gODBWF2yNnCXQIr_ym1dvle_Gl_U2_QcdK-sG7KTRqCf9sKQZJw_F4B_bZwI
VITE_VAPID_PRIVATE_KEY=BvVLEzrNTqZmsodEnfjIHHGLTRuVQmwzx-cEJIGrpWw
EOF

echo "✅ VAPIDキーを.envに追加しました"
echo ""
echo "次のステップ："
echo "1. Firebaseコンソールから設定値をコピー"
echo "2. node update-firebase-config.js を実行"
echo "3. npm run dev でアプリを再起動"
echo ""
echo "これで通知が動作します！"