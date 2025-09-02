import { GoogleGenerativeAI } from '@google/generative-ai';
import { canUseApi, recordApiUsage } from './api-limiter';

// Gemini API設定
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export interface AnalysisResult {
  summary: string;
  emotion: string;
  health_score: number;
  keywords: string[];
}

// Gemini 2.0 Flash を使用した分析
export async function analyzeWithGemini(text: string): Promise<AnalysisResult> {
  // APIキーがない場合は無料版にフォールバック
  if (!apiKey) {
    console.log('Gemini APIキーが設定されていません');
    return {
      summary: text.substring(0, 100),
      emotion: '普通',
      health_score: 75,
      keywords: []
    };
  }

  // API使用制限チェック
  const { allowed, reason } = canUseApi();
  if (!allowed) {
    console.warn('API使用制限:', reason);
    // 制限に達した場合は無料版にフォールバック
    return {
      summary: text.substring(0, 100) + '...(API制限により簡易分析)',
      emotion: '普通',
      health_score: 75,
      keywords: []
    };
  }

  try {
    // Gemini 2.0 Flash モデルを初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp' // 最新の2.0 Flashモデル
    });

    // プロンプトを構成
    const prompt = `
以下の日記を分析して、JSON形式で結果を返してください。

日記内容：
${text}

以下の形式で返してください（JSONのみ、説明文は不要）：
{
  "summary": "50文字以内の要約",
  "emotion": "喜び/楽しい/悲しみ/不安/疲れ/普通のいずれか",
  "health_score": 0-100の数値（健康状態スコア）,
  "keywords": ["キーワード1", "キーワード2", "キーワード3"]（最大3個）
}`;

    // Gemini APIを呼び出し
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // JSONを抽出してパース
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON形式の応答が得られませんでした');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    // API使用を記録（推定トークン数: 入力150 + 出力50 = 200）
    const estimatedTokens = Math.ceil(text.length / 3) + 50;
    recordApiUsage(estimatedTokens);
    
    // 検証とデフォルト値
    return {
      summary: analysis.summary || text.substring(0, 50),
      emotion: analysis.emotion || '普通',
      health_score: Math.min(100, Math.max(0, analysis.health_score || 75)),
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords.slice(0, 3) : []
    };
    
  } catch (error) {
    console.error('Gemini API エラー:', error);
    // エラー時は無料版の分析にフォールバック
    return {
      summary: text.substring(0, 100),
      emotion: '普通',
      health_score: 75,
      keywords: []
    };
  }
}

// 家族向け要約を生成
export async function generateFamilySummaryWithGemini(text: string): Promise<string> {
  if (!apiKey) {
    return text.substring(0, 100) + '...';
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp'
    });

    const prompt = `
以下の日記を家族が読みやすいように100文字以内で要約してください。
健康状態や気分、主な出来事を含めてください。

日記内容：
${text}

要約（100文字以内）：`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
    
  } catch (error) {
    console.error('Gemini API エラー:', error);
    return text.substring(0, 100) + '...';
  }
}