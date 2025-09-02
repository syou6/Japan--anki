// Gemini API使用量制限とモニタリング

interface ApiUsage {
  count: number;
  lastReset: string;
  totalTokens: number;
}

const USAGE_KEY = 'gemini_api_usage';
const DAILY_LIMIT = 100; // 1日あたりの最大リクエスト数
const MONTHLY_LIMIT = 1000; // 月あたりの最大リクエスト数
const MAX_TOKENS_PER_DAY = 100000; // 1日あたりの最大トークン数

// ローカルストレージから使用量を取得
function getUsage(): ApiUsage {
  const stored = localStorage.getItem(USAGE_KEY);
  if (!stored) {
    return {
      count: 0,
      lastReset: new Date().toISOString(),
      totalTokens: 0
    };
  }
  return JSON.parse(stored);
}

// 使用量を保存
function saveUsage(usage: ApiUsage): void {
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

// 日付が変わったかチェック
function isNewDay(lastReset: string): boolean {
  const last = new Date(lastReset);
  const now = new Date();
  return last.toDateString() !== now.toDateString();
}

// 使用量をリセット
function resetDailyUsage(): ApiUsage {
  return {
    count: 0,
    lastReset: new Date().toISOString(),
    totalTokens: 0
  };
}

// API使用可能かチェック
export function canUseApi(): { allowed: boolean; reason?: string } {
  const usage = getUsage();
  
  // 日付が変わっていればリセット
  if (isNewDay(usage.lastReset)) {
    saveUsage(resetDailyUsage());
    return { allowed: true };
  }
  
  // デイリー制限チェック
  if (usage.count >= DAILY_LIMIT) {
    return { 
      allowed: false, 
      reason: `本日のAPI使用上限(${DAILY_LIMIT}回)に達しました。明日またお試しください。` 
    };
  }
  
  // トークン制限チェック
  if (usage.totalTokens >= MAX_TOKENS_PER_DAY) {
    return { 
      allowed: false, 
      reason: `本日のトークン上限に達しました。明日またお試しください。` 
    };
  }
  
  return { allowed: true };
}

// API使用を記録
export function recordApiUsage(estimatedTokens: number = 200): void {
  const usage = getUsage();
  
  // 日付が変わっていればリセット
  if (isNewDay(usage.lastReset)) {
    saveUsage({
      count: 1,
      lastReset: new Date().toISOString(),
      totalTokens: estimatedTokens
    });
  } else {
    usage.count++;
    usage.totalTokens += estimatedTokens;
    saveUsage(usage);
  }
  
  // コンソールに使用状況を出力
  console.log(`Gemini API使用状況: ${usage.count}/${DAILY_LIMIT}回, ${usage.totalTokens}トークン`);
}

// 現在の使用状況を取得
export function getCurrentUsageStats(): {
  dailyUsed: number;
  dailyLimit: number;
  tokensUsed: number;
  tokensLimit: number;
  remainingRequests: number;
} {
  const usage = getUsage();
  
  // 日付が変わっていればリセット扱い
  if (isNewDay(usage.lastReset)) {
    return {
      dailyUsed: 0,
      dailyLimit: DAILY_LIMIT,
      tokensUsed: 0,
      tokensLimit: MAX_TOKENS_PER_DAY,
      remainingRequests: DAILY_LIMIT
    };
  }
  
  return {
    dailyUsed: usage.count,
    dailyLimit: DAILY_LIMIT,
    tokensUsed: usage.totalTokens,
    tokensLimit: MAX_TOKENS_PER_DAY,
    remainingRequests: Math.max(0, DAILY_LIMIT - usage.count)
  };
}

// 使用量をリセット（テスト用）
export function resetUsage(): void {
  saveUsage(resetDailyUsage());
  console.log('API使用量をリセットしました');
}