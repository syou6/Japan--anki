import { canCallApi, recordApiUsage, getCachedAnalysis, cacheAnalysis, showApiUsageWarning, recordApiSuccess, recordApiError } from './api-limiter';

export interface AnalysisResult {
  summary: string;
  family_summary: string;
  emotion: string;
  health_score: number;
  keywords: string[];
}

/**
 * Call the server-side Gemini API route
 */
async function callGeminiApi(prompt: string): Promise<string> {
  const res = await fetch('/api/gemini-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API request failed (${res.status})`);
  }

  const data = await res.json();
  return data.text;
}

// Gemini 2.0 Flash を使用した分析
export async function analyzeWithGemini(text: string): Promise<AnalysisResult> {
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
    return {
      summary: text.substring(0, 100) + '...(API制限により簡易分析)',
      family_summary: text.substring(0, 100),
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
      // プロンプトを構成
      const prompt = `以下の日本語日記を分析し、JSONのみを返してください。説明文は不要です。

日記:
${text}

分析基準:
- summary: 日記の内容を50文字以内で要約
- family_summary: 家族向けに気分・体調・出来事を温かい文体で100文字以内にまとめた要約
- emotion: 文脈から感情を判定（喜び/楽しい/感謝/悲しみ/不安/怒り/疲れ/普通 のいずれか）
- health_score: 身体・精神の健康度を0〜100で推定（運動・食事・睡眠・ストレスの言及を考慮）
- keywords: 日記の主要テーマを表すキーワード（最大3個）

出力:
{"summary":"...","family_summary":"...","emotion":"...","health_score":0,"keywords":["..."]}`;

      const responseText = await callGeminiApi(prompt);

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
        family_summary: analysis.family_summary || analysis.summary || text.substring(0, 100),
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

      // エラーを記録（サーキットブレーカー用）
      recordApiError();

      // エラー時は無料版の分析にフォールバック
      return {
        summary: text.substring(0, 100),
        family_summary: text.substring(0, 100),
        emotion: '普通',
        health_score: 75,
        keywords: []
      };
    }
  }

  // ここには到達しないはずだが念のため
  return {
    summary: text.substring(0, 100),
    family_summary: text.substring(0, 100),
    emotion: '普通',
    health_score: 75,
    keywords: []
  };
}

// 家族向け要約を生成
export async function generateFamilySummaryWithGemini(text: string): Promise<string> {
  try {
    const prompt = `以下の日記を家族向けに100文字以内で要約してください。
気分・体調・主な出来事を優先して含め、温かみのある文体にしてください。
要約のみ出力（説明不要）。

日記:
${text}`;

    const responseText = await callGeminiApi(prompt);
    return responseText.trim();

  } catch (error) {
    console.error('Gemini API エラー:', error);
    return text.substring(0, 100) + '...';
  }
}
