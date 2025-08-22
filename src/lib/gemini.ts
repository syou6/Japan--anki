import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiLimiter } from './gemini-limiter';
import { analyzeFree, generateFamilySummaryFree } from './free-analyzer';

// Gemini APIキーがある場合のみ初期化
const genAI = import.meta.env.VITE_GEMINI_API_KEY 
  ? new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
  : null;

// Gemini 1.5 Flash - 低コストで高速
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

export interface TranscriptionResult {
  text: string;
  summary?: string;
  keywords?: string[];
  emotion?: string;
}

/**
 * テキストを分析する（音声文字起こしは行わない）
 */
export async function analyzeText(text: string): Promise<TranscriptionResult> {
  if (!text) {
    return { text: '' };
  }

  // Gemini APIキーがない場合は無料分析を使用
  if (!model) {
    console.log('Gemini APIキーがないため、無料分析を使用します');
    const result = analyzeFree(text);
    return {
      text,
      summary: result.summary,
      keywords: result.keywords,
      emotion: result.emotion
    };
  }

  // 使用量制限チェック
  const canUseAPI = await geminiLimiter.checkLimit();
  if (!canUseAPI) {
    console.warn('Gemini API使用量制限に達しました');
    const result = analyzeFree(text);
    return {
      text,
      summary: result.summary,
      keywords: result.keywords,
      emotion: result.emotion
    };
  }

  // Gemini APIで要約と分析
  try {
    const prompt = `
以下の日記テキストを分析してください。

テキスト:
${text}

以下のJSONフォーマットで返答してください:
{
  "summary": "50文字以内の要約",
  "keywords": ["キーワード1", "キーワード2", "キーワード3"],
  "emotion": "喜び|悲しみ|不安|普通|楽しい|疲れ"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // 使用量を記録（推定トークン数）
    await geminiLimiter.recordUsage(text.length + 200);
    
    try {
      const analysis = JSON.parse(responseText);
      return {
        text,
        summary: analysis.summary,
        keywords: analysis.keywords,
        emotion: analysis.emotion
      };
    } catch {
      // JSON解析に失敗した場合は、テキストのみ返す
      return { text };
    }
  } catch (error) {
    console.error('Gemini API分析エラー:', error);
    // エラーの場合もテキストは返す
    return { text };
  }
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
 */
export async function generateFamilySummary(content: string): Promise<string> {
  // Gemini APIキーがない場合は無料版を使用
  if (!model) {
    return generateFamilySummaryFree(content);
  }
  
  try {
    const prompt = `
以下の高齢者の日記を、離れて暮らす家族が読みやすいように要約してください。
重要な出来事、健康状態、感情の変化に焦点を当ててください。
100文字以内で要約してください。

日記内容:
${content}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('要約生成エラー:', error);
    return content.substring(0, 100) + '...';
  }
}

/**
 * 健康状態をスコアリング
 */
export async function analyzeHealthScore(content: string, voiceData?: any): Promise<number> {
  // Gemini APIキーがない場合は無料版を使用
  if (!model) {
    const result = analyzeFree(content);
    return result.health_score;
  }
  
  try {
    const prompt = `
以下の日記内容から、高齢者の健康状態を0-100のスコアで評価してください。
元気で活動的な内容は高スコア、体調不良や不安な内容は低スコアとしてください。
数値のみを返してください。

日記内容:
${content}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const score = parseInt(response.text().trim());
    
    return isNaN(score) ? 75 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('健康スコア分析エラー:', error);
    return 75; // デフォルト値
  }
}
