import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { 
  Mic, 
  Calendar, 
  Heart, 
  Users,
  TrendingUp,
  MessageCircle,
  Sun,
  Cloud
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ParentDashboardProps {
  onViewChange: (view: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onViewChange }) => {
  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    return 'こんばんは';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {greeting()}
            </h1>
            <p className="text-2xl opacity-90">
              今日は{format(today, 'M月d日（E）', { locale: ja })}です
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Sun className="w-12 h-12 opacity-80" />
            <div className="text-right">
              <div className="text-xl font-bold">晴れ</div>
              <div className="text-lg opacity-80">25°C</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Record Voice Diary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            音声日記を録音
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            今日の出来事や気持ちを<br />
            音声で記録しましょう
          </p>
          <Button
            onClick={() => onViewChange('record')}
            variant="primary"
            size="xl"
            className="w-full"
          >
            <Mic className="w-8 h-8" />
            録音を始める
          </Button>
        </motion.div>

        {/* View Diaries */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          delay={0.1}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            過去の日記を見る
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            これまでの日記を<br />
            カレンダーで振り返る
          </p>
          <Button
            onClick={() => onViewChange('diary')}
            variant="outline"
            size="xl"
            className="w-full"
          >
            <Calendar className="w-8 h-8" />
            日記を見る
          </Button>
        </motion.div>
      </div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.2}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          今日のまとめ
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">85</div>
            <div className="text-lg text-gray-700">健康スコア</div>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">😊</div>
            <div className="text-lg text-gray-700">今日の気分</div>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-lg text-gray-700">家族からの<br />コメント</div>
          </div>
        </div>
      </motion.div>

      {/* Family Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.3}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            家族からのメッセージ
          </h2>
          <Users className="w-6 h-6 text-gray-500" />
        </div>

        <div className="space-y-4">
          {[
            {
              name: '太郎（息子）',
              message: 'お疲れ様でした！今日も元気な声が聞けて嬉しいです。',
              time: '2時間前',
              avatar: '👨'
            },
            {
              name: '花子（娘）',
              message: '孫の写真ありがとうございます！今度一緒にお出かけしましょう。',
              time: '5時間前',
              avatar: '👩'
            }
          ].map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              delay={0.4 + index * 0.1}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">{msg.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900 text-lg">
                    {msg.name}
                  </span>
                  <span className="text-gray-500">
                    {msg.time}
                  </span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" size="lg">
            <MessageCircle className="w-5 h-5" />
            すべてのメッセージを見る
          </Button>
        </div>
      </motion.div>
    </div>
  );
};