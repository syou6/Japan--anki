import { analyzeFree, generateFamilySummaryFree } from './free-analyzer';

// 完全無料版：Gemini APIは使用しない
// APIコストを完全にゼロにするため、無料分析機能のみを使用

export interface TranscriptionResult {
  text: string;
  summary?: string;
  keywords?: string[];
  emotion?: string;
}

/**
 * テキストを分析する（音声文字起こしは行わない）
 * 完全無料版：常に無料分析機能を使用
 */
export async function analyzeText(text: string): Promise<TranscriptionResult> {
  if (!text) {
    return { text: '' };
  }

  // 常に無料分析を使用（APIコストゼロ）
  const result = analyzeFree(text);
  return {
    text,
    summary: result.summary,
    keywords: result.keywords,
    emotion: result.emotion
  };
}

/**
 * 音声ファイルの文字起こし（現在は未実装）
 * 注: Web Speech APIは録音済み音声の文字起こしには適していないため、
 * 将来的にはWhisper APIなどの利用を検討
 */
export function transcribeAudioFile(audioBlob: Blob): Promise<string> {
  return Promise.resolve('');
}

/**
 * 長い日記を家族向けに要約
 * 完全無料版：常に無料分析機能を使用
 */
export async function generateFamilySummary(content: string): Promise<string> {
  return generateFamilySummaryFree(content);
}

/**
 * 健康状態をスコアリング
 * 完全無料版：常に無料分析機能を使用
 */
export async function analyzeHealthScore(content: string, voiceData?: any): Promise<number> {
  const result = analyzeFree(content);
  return result.health_score;
}
