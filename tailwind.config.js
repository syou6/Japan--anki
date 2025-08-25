/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // SimplifiedNav用の色クラス
    'bg-green-50', 'bg-green-100', 'bg-green-600', 'border-green-600',
    'bg-red-50', 'bg-red-100', 'bg-red-600', 'border-red-600',
    'bg-blue-50', 'bg-blue-100', 'bg-blue-600', 'border-blue-600',
    'hover:bg-green-100', 'hover:bg-red-100', 'hover:bg-blue-100',
  ],
  theme: {
    extend: {
      colors: {
        // 高コントラスト色設定
        'navy': {
          900: '#000033', // 濃紺（メインテキスト）
          800: '#000044',
          700: '#000055',
          600: '#000066',
          500: '#000080', // ボタン背景
        },
        'high-contrast': {
          'text': '#000033',
          'bg': '#ffffff',
          'border': '#000033',
          'danger': '#cc0000',
          'success': '#006600',
        }
      },
      fontSize: {
        // 大きめのフォントサイズ
        'base': '18px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '28px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
      },
      fontWeight: {
        'normal': '500', // 通常でも少し太め
        'medium': '600',
        'semibold': '700',
        'bold': '800',
      },
    },
  },
  plugins: [],
};
