/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
