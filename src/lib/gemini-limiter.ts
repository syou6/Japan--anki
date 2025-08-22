// Gemini API使用量制限とモニタリング

interface UsageTracker {
  date: string;
  count: number;
  totalTokens: number;
}

class GeminiRateLimiter {
  private readonly MAX_DAILY_CALLS = 100; // 1日の最大呼び出し回数
  private readonly MAX_MONTHLY_COST = 1.0; // 月額上限（ドル）
  private readonly TOKENS_PER_DOLLAR = 1000000 / 0.075; // Flash入力の場合
  
  private getUsageKey(): string {
    const today = new Date().toISOString().split('T')[0];
    return `gemini_usage_${today}`;
  }
  
  private getMonthlyKey(): string {
    const month = new Date().toISOString().slice(0, 7);
    return `gemini_monthly_${month}`;
  }
  
  async checkLimit(): Promise<boolean> {
    try {
      // 日次制限チェック
      const dailyKey = this.getUsageKey();
      const dailyUsageStr = localStorage.getItem(dailyKey);
      const dailyUsage: UsageTracker = dailyUsageStr 
        ? JSON.parse(dailyUsageStr)
        : { date: new Date().toISOString().split('T')[0], count: 0, totalTokens: 0 };
      
      if (dailyUsage.count >= this.MAX_DAILY_CALLS) {
        console.warn('Gemini API: 日次制限に達しました');
        return false;
      }
      
      // 月次コスト制限チェック
      const monthlyKey = this.getMonthlyKey();
      const monthlyUsageStr = localStorage.getItem(monthlyKey);
      const monthlyUsage: UsageTracker = monthlyUsageStr
        ? JSON.parse(monthlyUsageStr)
        : { date: new Date().toISOString().slice(0, 7), count: 0, totalTokens: 0 };
      
      const estimatedCost = monthlyUsage.totalTokens / this.TOKENS_PER_DOLLAR;
      if (estimatedCost >= this.MAX_MONTHLY_COST) {
        console.error('Gemini API: 月額上限に達しました');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('使用量チェックエラー:', error);
      return true; // エラー時は許可（サービス継続優先）
    }
  }
  
  async recordUsage(estimatedTokens: number = 1000): Promise<void> {
    try {
      // 日次記録
      const dailyKey = this.getUsageKey();
      const dailyUsageStr = localStorage.getItem(dailyKey);
      const dailyUsage: UsageTracker = dailyUsageStr 
        ? JSON.parse(dailyUsageStr)
        : { date: new Date().toISOString().split('T')[0], count: 0, totalTokens: 0 };
      
      dailyUsage.count += 1;
      dailyUsage.totalTokens += estimatedTokens;
      localStorage.setItem(dailyKey, JSON.stringify(dailyUsage));
      
      // 月次記録
      const monthlyKey = this.getMonthlyKey();
      const monthlyUsageStr = localStorage.getItem(monthlyKey);
      const monthlyUsage: UsageTracker = monthlyUsageStr
        ? JSON.parse(monthlyUsageStr)
        : { date: new Date().toISOString().slice(0, 7), count: 0, totalTokens: 0 };
      
      monthlyUsage.count += 1;
      monthlyUsage.totalTokens += estimatedTokens;
      localStorage.setItem(monthlyKey, JSON.stringify(monthlyUsage));
      
      // コスト警告
      const estimatedCost = monthlyUsage.totalTokens / this.TOKENS_PER_DOLLAR;
      if (estimatedCost > this.MAX_MONTHLY_COST * 0.8) {
        console.warn(`Gemini API: 月額上限の80%に達しました ($${estimatedCost.toFixed(2)})`);
      }
    } catch (error) {
      console.error('使用量記録エラー:', error);
    }
  }
  
  getUsageStats(): { daily: UsageTracker | null; monthly: UsageTracker | null; estimatedMonthlyCost: number } {
    try {
      const dailyKey = this.getUsageKey();
      const monthlyKey = this.getMonthlyKey();
      
      const dailyUsageStr = localStorage.getItem(dailyKey);
      const monthlyUsageStr = localStorage.getItem(monthlyKey);
      
      const daily = dailyUsageStr ? JSON.parse(dailyUsageStr) : null;
      const monthly = monthlyUsageStr ? JSON.parse(monthlyUsageStr) : null;
      
      const estimatedMonthlyCost = monthly 
        ? monthly.totalTokens / this.TOKENS_PER_DOLLAR 
        : 0;
      
      return { daily, monthly, estimatedMonthlyCost };
    } catch (error) {
      console.error('統計取得エラー:', error);
      return { daily: null, monthly: null, estimatedMonthlyCost: 0 };
    }
  }
  
  // 古いデータをクリーンアップ（30日以上前）
  cleanupOldData(): void {
    const keys = Object.keys(localStorage);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    keys.forEach(key => {
      if (key.startsWith('gemini_')) {
        const dateStr = key.split('_')[2];
        if (dateStr && new Date(dateStr) < thirtyDaysAgo) {
          localStorage.removeItem(key);
        }
      }
    });
  }
}

export const geminiLimiter = new GeminiRateLimiter();