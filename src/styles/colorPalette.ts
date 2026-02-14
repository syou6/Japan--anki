// モダンUI カラーパレット（ティール/エメラルド系）
export const colors = {
  // メイン機能の色
  home: {
    light: '#ccfbf1',    // teal-100
    base: '#14b8a6',     // teal-500
    dark: '#0d9488',     // teal-600
    darker: '#0f766e',   // teal-700
  },
  record: {
    light: '#ffe4e6',    // rose-100
    base: '#f43f5e',     // rose-500
    dark: '#e11d48',     // rose-600
    darker: '#be123c',   // rose-700
  },
  play: {
    light: '#e0f2fe',    // sky-100
    base: '#0ea5e9',     // sky-500
    dark: '#0284c7',     // sky-600
    darker: '#0369a1',   // sky-700
  },
  // 共通UI要素の色
  ui: {
    success: '#10b981',  // emerald-500
    warning: '#f59e0b',  // amber-500
    danger: '#ef4444',   // red-500
    info: '#0ea5e9',     // sky-500
    neutral: '#6b7280',  // gray-500
  },
  // テキスト色
  text: {
    primary: '#111827',   // gray-900
    secondary: '#6b7280', // gray-500
    disabled: '#d1d5db',  // gray-300
    onDark: '#ffffff',
  },
  // 背景色
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb', // gray-50
    tertiary: '#f3f4f6',  // gray-100
  }
};

// 機能別の色取得
export const getFeatureColor = (feature: 'home' | 'record' | 'play', variant: 'light' | 'base' | 'dark' | 'darker' = 'base') => {
  return colors[feature][variant];
};

// ボタンスタイル
export const buttonStyles = {
  home: {
    active: {
      backgroundColor: colors.home.dark,
      borderColor: colors.home.darker,
      color: colors.text.onDark,
    },
    inactive: {
      backgroundColor: colors.home.light,
      borderColor: 'transparent',
      color: colors.home.darker,
    }
  },
  record: {
    active: {
      backgroundColor: colors.record.dark,
      borderColor: colors.record.darker,
      color: colors.text.onDark,
    },
    inactive: {
      backgroundColor: colors.record.light,
      borderColor: 'transparent',
      color: colors.record.darker,
    }
  },
  play: {
    active: {
      backgroundColor: colors.play.dark,
      borderColor: colors.play.darker,
      color: colors.text.onDark,
    },
    inactive: {
      backgroundColor: colors.play.light,
      borderColor: 'transparent',
      color: colors.play.darker,
    }
  }
};
