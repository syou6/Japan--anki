import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ChevronRight } from 'lucide-react';

interface HelpContent {
  title: string;
  description: string;
  tips: string[];
}

interface HelpButtonProps {
  context: 'home' | 'recording' | 'diary' | 'family' | 'settings';
}

const helpContents: Record<string, HelpContent> = {
  home: {
    title: 'ホーム画面の使い方',
    description: 'ここでは日記の録音や確認ができます',
    tips: [
      '大きな録音ボタンを押すと、音声日記の録音が始まります',
      '下にスクロールすると、最近の日記が表示されます',
      '家族の日記も一覧で確認できます',
      '日記をタップすると詳細が見られます'
    ]
  },
  recording: {
    title: '録音画面の使い方',
    description: '音声で日記を残しましょう',
    tips: [
      '録音ボタンを押すと録音が始まります',
      '30秒間、今日の出来事を話してください',
      '音量メーターで適切な声の大きさを確認できます',
      '録音後は内容を確認してから保存できます',
      '追加でメモを入力することもできます'
    ]
  },
  diary: {
    title: '日記一覧の使い方',
    description: '過去の日記を確認できます',
    tips: [
      '日記をタップすると詳細が開きます',
      '再生ボタンで音声を聞くことができます',
      'コメントボタンで家族にメッセージを送れます',
      'ゴミ箱ボタンで削除できます（30日間は復元可能）',
      'いいねボタンで応援の気持ちを伝えられます'
    ]
  },
  family: {
    title: '家族管理の使い方',
    description: '家族を招待して日記を共有しましょう',
    tips: [
      '招待コードを家族に送って登録してもらいます',
      '最大5人まで家族を追加できます',
      '家族の日記も自動的に表示されます',
      '家族メンバーはいつでも追加・削除できます'
    ]
  },
  settings: {
    title: '設定画面の使い方',
    description: '通知やプライバシーの設定ができます',
    tips: [
      '通知のオン・オフを切り替えられます',
      '通知を受け取る時間帯を設定できます',
      'プロフィール情報を変更できます',
      'ゴミ箱から削除した日記を復元できます'
    ]
  }
};

export const HelpButton: React.FC<HelpButtonProps> = ({ context }) => {
  const [showHelp, setShowHelp] = useState(false);
  const help = helpContents[context];

  return (
    <>
      {/* Help Button - Fixed Position */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelp(true)}
        className="fixed top-4 right-4 z-40 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        title="困った時はここ"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      {/* Help Overlay */}
      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Help Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">ヘルプ</h2>
                      <p className="text-sm text-gray-500">困った時の使い方ガイド</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Current Screen Help */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {help.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {help.description}
                  </p>
                  <div className="space-y-3">
                    {help.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">録音ができない時は？</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">家族を追加するには？</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">削除した日記を復元するには？</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-orange-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    それでも解決しない時は
                  </h3>
                  <p className="text-gray-700 mb-4">
                    お気軽にサポートまでお問い合わせください
                  </p>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                    サポートに連絡する
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};