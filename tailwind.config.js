/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // SimplifiedNav用の色クラス
    'bg-teal-50', 'bg-teal-100', 'bg-teal-600', 'border-teal-600',
    'bg-rose-50', 'bg-rose-100', 'bg-rose-500', 'border-rose-500',
    'bg-sky-50', 'bg-sky-100', 'bg-sky-600', 'border-sky-600',
    'hover:bg-teal-100', 'hover:bg-rose-100', 'hover:bg-sky-100',
  ],
  theme: {
    extend: {
      colors: {
        // ブランドカラー（ティール/エメラルド）
        'brand': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // メインアクセント
          600: '#0d9488',  // ホバー
          700: '#0f766e',  // アクティブ
          800: '#115e59',
          900: '#134e4a',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 2px 8px -2px rgb(0 0 0 / 0.06)',
        'elevated': '0 4px 16px -4px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};
