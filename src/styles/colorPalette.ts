// 高齢者向け統一カラーパレット
export const colors = {
  // メイン機能の色
  home: {
    light: '#86efac',    // パステル緑
    base: '#4ade80',     // 明るい緑
    dark: '#059669',     // 濃い緑
    darker: '#047857',   // より濃い緑
  },
  record: {
    light: '#fca5a5',    // パステル赤
    base: '#f87171',     // 明るい赤
    dark: '#dc2626',     // 濃い赤
    darker: '#b91c1c',   // より濃い赤
  },
  play: {
    light: '#93c5fd',    // パステル青
    base: '#60a5fa',     // 明るい青
    dark: '#2563eb',     // 濃い青
    darker: '#1d4ed8',   // より濃い青
  },
  // 共通UI要素の色
  ui: {
    success: '#10b981',  // 成功（緑）
    warning: '#f59e0b',  // 警告（オレンジ）
    danger: '#ef4444',   // 危険（赤）
    info: '#3b82f6',     // 情報（青）
    neutral: '#6b7280',  // 中立（グレー）
  },
  // テキスト色
  text: {
    primary: '#000000',   // 主要テキスト（黒）
    secondary: '#374151', // 副テキスト（濃いグレー）
    disabled: '#9ca3af',  // 無効テキスト（薄いグレー）
    onDark: '#ffffff',    // 暗い背景上のテキスト（白）
  },
  // 背景色
  background: {
    primary: '#ffffff',   // 主要背景（白）
    secondary: '#f9fafb', // 副背景（薄いグレー）
    tertiary: '#f3f4f6',  // 第三背景（グレー）
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
      borderColor: colors.home.dark,
      color: colors.text.primary,
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
      borderColor: colors.record.dark,
      color: colors.text.primary,
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
      borderColor: colors.play.dark,
      color: colors.text.primary,
    }
  }
};