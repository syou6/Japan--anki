import { analyzeFree, generateFamilySummaryFree } from './free-analyzer';
import { analyzeWithGemini, type AnalysisResult } from './gemini-api';

export interface EntryAnalysis {
  summary: string;
  family_summary: string;
  emotion: string;
  health_score: number;
  keywords: string[];
}

/**
 * 日記を1回のAPI呼び出しで総合分析する
 * 要約・家族向け要約・感情・健康スコア・キーワードを一括取得
 */
export async function analyzeEntry(text: string): Promise<EntryAnalysis> {
  const fallback: EntryAnalysis = {
    summary: text.substring(0, 100),
    family_summary: generateFamilySummaryFree(text),
    emotion: '普通',
    health_score: 75,
    keywords: []
  };

  if (!text || !text.trim()) {
    return fallback;
  }

  try {
    const result = await analyzeWithGemini(text);
    return {
      summary: result.summary,
      family_summary: result.family_summary,
      emotion: result.emotion,
      health_score: result.health_score,
      keywords: result.keywords
    };
  } catch (error) {
    console.error('Gemini API失敗、無料版にフォールバック:', error);
    const free = analyzeFree(text);
    return {
      summary: free.summary,
      family_summary: generateFamilySummaryFree(text),
      emotion: free.emotion,
      health_score: free.health_score,
      keywords: free.keywords
    };
  }
}

/**
 * 音声ファイルの文字起こし（現在は未実装）
 */
export function transcribeAudioFile(audioBlob: Blob): Promise<string> {
  return Promise.resolve('');
}
