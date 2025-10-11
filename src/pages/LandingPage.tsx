import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Brain, Users, Shield, Star, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ShareButton } from '../components/sharing/ShareButton';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "音声で簡単記録",
      description: "ボタンを押すだけで、声で日記を記録できます。手が不自由でも大丈夫。"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AIが自動文字起こし",
      description: "録音した音声をAIが自動で文字に変換。高齢者にも読みやすい文章に。"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "家族で共有",
      description: "大切な思い出を家族みんなで共有。離れて住んでいても繋がれます。"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "プライバシー保護",
      description: "あなたの大切な思い出は安全に保護されます。家族だけがアクセス可能。"
    }
  ];

  const testimonials = [
    {
      name: "田中さん（75歳）",
      text: "手が震えて字が書けなくても、声で日記が書けるようになりました。"
    },
    {
      name: "佐藤さん（50歳）",
      text: "母の思い出を家族みんなで共有できるようになり、とても嬉しいです。"
    },
    {
      name: "山田さん（60歳）",
      text: "AIが文字起こししてくれるので、後で読み返すのが楽になりました。"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">AI Voice Journal</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/app')}
                variant="primary"
              >
                アプリを開始
              </Button>
              <ShareButton />
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              声で書く
              <span className="text-indigo-600"> デジタル日記</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              手が不自由でも、字が書けなくても大丈夫。声だけで日記を書いて、AIが自動で文字起こし。
              大切な思い出を家族と共有しましょう。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/app')}
                variant="primary"
                size="lg"
                className="text-lg px-8 py-4"
              >
                無料で始める
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                デモを見る
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              なぜ選ばれるのか
            </h2>
            <p className="text-xl text-gray-600">
              高齢者に優しい、家族に優しい、使いやすい日記アプリ
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 利用者の声 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              利用者の声
            </h2>
            <p className="text-xl text-gray-600">
              実際にご利用いただいている方々からの感想
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            今すぐ始めませんか？
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-indigo-100 mb-8"
          >
            無料で利用開始。登録は1分で完了します。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={() => navigate('/app')}
              variant="secondary"
              size="lg"
              className="text-lg px-8 py-4"
            >
              無料で始める
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">AI Voice Journal</span>
              </div>
              <p className="text-gray-400">
                声で書くデジタル日記。大切な思い出を家族と共有。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">機能</h3>
              <ul className="space-y-2 text-gray-400">
                <li>音声録音</li>
                <li>AI文字起こし</li>
                <li>家族共有</li>
                <li>プライバシー保護</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">サポート</h3>
              <ul className="space-y-2 text-gray-400">
                <li>ヘルプセンター</li>
                <li>お問い合わせ</li>
                <li>プライバシーポリシー</li>
                <li>利用規約</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">今すぐ開始</h3>
              <Button
                onClick={() => navigate('/app')}
                variant="primary"
                className="w-full"
              >
                アプリを開始
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Voice Journal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
