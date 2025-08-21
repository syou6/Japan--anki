import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analyzeText, generateFamilySummary, analyzeHealthScore } from '../lib/gemini';

interface GuestDiary {
  id: string;
  content: string;
  title: string;
  emotion: string;
  health_score: number;
  ai_summary: string;
  created_at: string;
  expires_at: string; // 有効期限
  voice_data?: string; // Base64エンコードされた音声データ
}

interface GuestStore {
  diaries: GuestDiary[];
  usageCount: number;
  maxDiaries: number;
  isGuestMode: boolean;
  
  createGuestDiary: (content: string, audioBlob?: Blob) => Promise<void>;
  deleteGuestDiary: (id: string) => void;
  getGuestDiaries: () => GuestDiary[];
  getRemainingTries: () => number;
  canCreateMore: () => boolean;
  clearGuestData: () => void;
  setGuestMode: (enabled: boolean) => void;
  cleanExpiredDiaries: () => void;
}

export const useGuestStore = create<GuestStore>()(
  persist(
    (set, get) => ({
      diaries: [],
      usageCount: 0,
      maxDiaries: 3,
      isGuestMode: false,

      createGuestDiary: async (content: string, audioBlob?: Blob) => {
        const { usageCount, maxDiaries } = get();
        
        if (usageCount >= maxDiaries) {
          throw new Error('ゲスト利用の上限に達しました。ログインしてください。');
        }

        // 音声データをBase64に変換（30秒制限）
        let voiceData: string | undefined;
        if (audioBlob) {
          // 30秒制限（約300KB）
          if (audioBlob.size > 300000) {
            throw new Error('ゲストモードでは30秒までの録音が可能です');
          }
          const reader = new FileReader();
          voiceData = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioBlob);
          });
        }

        // AI分析
        let emotion = '普通';
        let healthScore = 75;
        let aiSummary = '';

        try {
          if (content && import.meta.env.VITE_GEMINI_API_KEY) {
            const analysisResult = await analyzeText(content);
            emotion = analysisResult?.emotion || '普通';
            aiSummary = await generateFamilySummary(content);
            healthScore = await analyzeHealthScore(content);
          }
        } catch (error) {
          console.warn('AI分析をスキップしました:', error);
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30分後
        
        const newDiary: GuestDiary = {
          id: `guest-${Date.now()}`,
          content,
          title: content.substring(0, 50),
          emotion,
          health_score: healthScore,
          ai_summary: aiSummary,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          voice_data: voiceData
        };

        set((state) => ({
          diaries: [newDiary, ...state.diaries],
          usageCount: state.usageCount + 1
        }));
      },

      deleteGuestDiary: (id: string) => {
        set((state) => ({
          diaries: state.diaries.filter(d => d.id !== id),
          usageCount: Math.max(0, state.usageCount - 1)
        }));
      },

      getGuestDiaries: () => get().diaries,

      getRemainingTries: () => {
        const { maxDiaries, usageCount } = get();
        return Math.max(0, maxDiaries - usageCount);
      },

      canCreateMore: () => {
        const { usageCount, maxDiaries } = get();
        return usageCount < maxDiaries;
      },

      clearGuestData: () => {
        set({
          diaries: [],
          usageCount: 0,
          isGuestMode: false
        });
      },

      setGuestMode: (enabled: boolean) => {
        set({ isGuestMode: enabled });
      },

      cleanExpiredDiaries: () => {
        const now = new Date();
        set((state) => {
          const validDiaries = state.diaries.filter(diary => {
            const expiresAt = new Date(diary.expires_at);
            return expiresAt > now;
          });
          
          // 削除された日記の数だけusageCountも減らす
          const deletedCount = state.diaries.length - validDiaries.length;
          
          console.log(`期限切れの日記を${deletedCount}件削除しました`);
          
          return {
            diaries: validDiaries,
            usageCount: Math.max(0, state.usageCount - deletedCount)
          };
        });
      }
    }),
    {
      name: 'guest-diary-storage',
      partialize: (state) => ({
        diaries: state.diaries,
        usageCount: state.usageCount,
        isGuestMode: state.isGuestMode  // ゲストモードも永続化
      })
    }
  )
);