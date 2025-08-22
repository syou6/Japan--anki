import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { 
  Mic, 
  Heart, 
  Users, 
  Brain,
  Calendar,
  MessageCircle,
  ChevronRight,
  X
} from 'lucide-react';

interface WelcomeGuideProps {
  onComplete: () => void;
  show: boolean;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onComplete, show }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Heart className="w-16 h-16 text-red-500" />,
      title: "離れた親の「今日」がわかる",
      description: "親が毎日どんな風に過ごしているか、体調はどうか。話した日記から、AIが健康状態や感情を分析してお知らせします。",
      benefit: "📱 毎日の安否確認が自動で完了"
    },
    {
      icon: <Mic className="w-16 h-16 text-blue-500" />,
      title: "親は話すだけでOK",
      description: "スマホやタブレットに向かって3分話すだけ。文字入力は一切不要。孫の話、今日の散歩、なんでも気軽に。",
      benefit: "👴👵 80代でも簡単に使える"
    },
    {
      icon: <Brain className="w-16 h-16 text-purple-500" />,
      title: "体調の変化を見逃さない",
      description: "声のトーンや話の内容から、認知機能の変化や体調不良の兆候をAIが検知。早期発見で安心。",
      benefit: "🏥 病院に行くタイミングがわかる"
    },
    {
      icon: <MessageCircle className="w-16 h-16 text-green-500" />,
      title: "家族みんなで見守り",
      description: "兄弟姉妹で親の日記を共有。コメントで励ましたり、昔話に花を咲かせたり。距離を超えた温かい交流。",
      benefit: "💬 LINEよりも深い家族の絆"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-12 mx-1 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              {steps[currentStep].icon}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {steps[currentStep].title}
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              {steps[currentStep].description}
            </p>

            <div className="bg-green-50 rounded-xl p-4 mb-8">
              <p className="text-green-800 font-medium">
                ✨ {steps[currentStep].benefit}
              </p>
            </div>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  前へ
                </Button>
              )}
              
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex-1"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    次へ
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </>
                ) : (
                  '始める'
                )}
              </Button>
            </div>

            {currentStep === 0 && (
              <button
                onClick={handleSkip}
                className="mt-4 text-gray-500 text-sm hover:text-gray-700"
              >
                スキップ
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};