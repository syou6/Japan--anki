import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { LogoWithText } from '../ui/Logo';
import { useAuthStore } from '../../stores/authStore';
import { useGuestStore } from '../../stores/guestStore';
import { LogIn, UserPlus, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp, signIn, signInWithGoogle } = useAuthStore();
  const { setGuestMode } = useGuestStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, { name });
        toast.success('アカウントを作成しました！');
      } else {
        await signIn(email, password);
        toast.success('ログインしました！');
      }
    } catch (error: any) {
      toast.error(error.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Googleアカウントでログインしています...');
    } catch (error: any) {
      toast.error(error.message || 'Googleログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    window.location.reload(); // Routerが設定される前なのでreloadで対応
    toast.success('ゲストモードで開始しました（3回まで試せます）');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md"
      >
        <div className="text-center mb-6 sm:mb-8">
          <LogoWithText size="lg" className="mb-4" />
          <p className="text-gray-600 text-base sm:text-lg">
            {isSignUp ? 'アカウントを作成' : 'ログイン'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  お名前
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  autoComplete="name"
                />
              </div>

            </>
          )}

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              '処理中...'
            ) : isSignUp ? (
              <>
                <UserPlus className="w-6 h-6" />
                アカウント作成
              </>
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                ログイン
              </>
            )}
          </Button>
        </form>

        {/* Googleログインボタン */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
              size="xl"
              className="w-full flex items-center justify-center gap-3"
              disabled={loading}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Googleでログイン
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-800 text-lg font-medium"
          >
            {isSignUp 
              ? 'すでにアカウントをお持ちですか？' 
              : 'アカウントを作成しますか？'
            }
          </button>
        </div>

        {/* ゲストモードボタン */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={handleGuestMode}
            variant="ghost"
            size="lg"
            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          >
            <UserCheck className="w-5 h-5" />
            ゲストで試してみる
            <span className="text-sm ml-2 text-gray-500">（3回まで）</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};