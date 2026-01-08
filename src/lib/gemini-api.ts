import { GoogleGenerativeAI } from '@google/generative-ai';
import { canCallApi, recordApiUsage, getCachedAnalysis, cacheAnalysis, showApiUsageWarning, recordApiSuccess, recordApiError } from './api-limiter';

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

  // キャッシュをチェック
  const cachedResult = getCachedAnalysis(text);
  if (cachedResult) {
    console.log('✅ キャッシュから分析結果を使用');
    return cachedResult;
  }

  // 総合的なAPI制限チェック（レート制限、サーキットブレーカー、使用量制限）
  const { allowed, reason } = canCallApi();
  if (!allowed) {
    console.warn('🚫 API制限:', reason);
    // 制限に達した場合は無料版にフォールバック
    return {
      summary: text.substring(0, 100) + '...(API制限により簡易分析)',
      emotion: '普通',
      health_score: 75,
      keywords: []
    };
  }

  // 使用量警告を表示
  showApiUsageWarning();

  // リトライ設定（最大2回まで）
  const MAX_RETRIES = 2;
  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      // Gemini Pro モデルを初期化
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-pro'
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
    const generateResult = await model.generateContent(prompt);
    const response = await generateResult.response;
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
    const result = {
      summary: analysis.summary || text.substring(0, 50),
      emotion: analysis.emotion || '普通',
      health_score: Math.min(100, Math.max(0, analysis.health_score || 75)),
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords.slice(0, 3) : []
    };
    
    // 成功を記録
    recordApiSuccess();
    
    // 結果をキャッシュに保存
    cacheAnalysis(text, result);
    
      return result;
      
    } catch (error: any) {
      retryCount++;
      console.error(`Gemini API エラー (試行 ${retryCount}/${MAX_RETRIES}):`, error.message);
      
      // ネットワークエラーまたはタイムアウトの場合のみリトライ
      if (retryCount < MAX_RETRIES && 
          (error.message?.includes('network') || 
           error.message?.includes('timeout') || 
           error.message?.includes('fetch'))) {
        console.log('1秒後にリトライします...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // リトライ限界またはその他のエラー
      // エラーを記録（サーキットブレーカー用）
      recordApiError();
      
      // エラー時は無料版の分析にフォールバック
      return {
        summary: text.substring(0, 100),
        emotion: '普通',
        health_score: 75,
        keywords: []
      };
    }
  }
  
  // ここには到達しないはずだが念のため
  return {
    summary: text.substring(0, 100),
    emotion: '普通',
    health_score: 75,
    keywords: []
  };
}

// 家族向け要約を生成
export async function generateFamilySummaryWithGemini(text: string): Promise<string> {
  if (!apiKey) {
    return text.substring(0, 100) + '...';
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro'
    });

    const prompt = `
以下の日記を家族が読みやすいように100文字以内で要約してください。
健康状態や気分、主な出来事を含めてください。

日記内容：
${text}

要約（100文字以内）：`;

    const generateResult = await model.generateContent(prompt);
    const response = await generateResult.response;
    return response.text().trim();
    
  } catch (error) {
    console.error('Gemini API エラー:', error);
    return text.substring(0, 100) + '...';
  }
}