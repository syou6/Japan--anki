import { canCallApi, recordApiUsage, recordApiSuccess, recordApiError, showApiUsageWarning } from './api-limiter';

export type CEFRLevel = 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1' | 'B1+' | 'B2' | 'B2+' | 'C1' | 'C1+';

// Markdown形式のフィードバック
export interface JapaneseFeedback {
  cefrLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  markdownContent: string;  // 全フィードバックをMarkdownで保存
}

/** @deprecated Use JapaneseFeedback instead */
export type EnglishFeedback = JapaneseFeedback;

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

/**
 * Generate Japanese feedback for diary entry using Gemini API
 */
export async function generateJapaneseFeedback(
  content: string,
  userCefrLevel: CEFRLevel = 'B1'
): Promise<JapaneseFeedback> {
  // Target level is i+1 (one level higher than current)
  const levelProgression: Record<CEFRLevel, CEFRLevel> = {
    'A1': 'A1+', 'A1+': 'A2', 'A2': 'A2+', 'A2+': 'B1',
    'B1': 'B1+', 'B1+': 'B2', 'B2': 'B2+', 'B2+': 'C1',
    'C1': 'C1+', 'C1+': 'C1+'
  };
  const targetLevel = levelProgression[userCefrLevel];

  // Default fallback response
  const defaultFeedback: JapaneseFeedback = {
    cefrLevel: userCefrLevel,
    targetLevel: targetLevel,
    markdownContent: `## 添削とアドバイス
日記が記録されました。毎日日本語を練習しましょう！

## ひとことメッセージ
よく頑張りました！毎日少しずつ日本語を使い続けることが上達の近道です。`
  };

  // Check API limits
  const { allowed, reason } = canCallApi();
  if (!allowed) {
    console.warn('API limit reached:', reason);
    return defaultFeedback;
  }

  showApiUsageWarning();

  try {

    const prompt = `あなたは日本語学習者を支援するプロの日本語講師です。
ユーザーの日記を分析し、実践的なフィードバックを提供してください。

# 入力情報
- ユーザーの現在レベル: CEFR ${userCefrLevel}
- 目標レベル: CEFR ${targetLevel}
- 日記の内容:
${content}

# 指示
- フィードバックは全て日本語で書いてください
- ユーザーのレベルに合わせ、難しい漢字にはふりがなを付けてください
- 添削は具体的に「原文 → 修正案」の形で示してください
- 目標レベル（${targetLevel}）に向けた表現を紹介してください

# 出力フォーマット（Markdown）

## 添削とアドバイス
日記の中から改善できる箇所を最大3つ取り上げ、以下の形式で示してください:
- ❌ 原文の表現
- ✅ より自然な表現
- 💡 なぜこの方が良いか（文法・ニュアンスの簡潔な説明）

## レベルアップ表現
${targetLevel}レベルで使える表現を3つ紹介してください。日記の内容に関連した実用的なものにしてください:
- **表現**: 読み方（ふりがな）
- **意味**: 簡潔な説明
- **例文**: 日記の内容に合わせた使用例

## 関連リーディング
日記のテーマに基づいた短い読み物（150〜200字）を${targetLevel}レベルで作成してください。

## 重要単語リスト
上の読み物から学習に役立つ単語を8個抽出してください:
- **漢字表記**（読み方）: 意味の説明

## ひとことメッセージ
日記の良かった点を具体的に褒め、次のステップを提案する励ましのメッセージ（2〜3文）`;

    const markdownContent = await callGeminiApi(prompt);

    // Record API usage
    const estimatedTokens = Math.ceil(content.length / 3) + 200;
    recordApiUsage(estimatedTokens);
    recordApiSuccess();

    return {
      cefrLevel: userCefrLevel,
      targetLevel: targetLevel,
      markdownContent: markdownContent
    };

  } catch (error: any) {
    console.error('Gemini feedback error:', error.message);
    recordApiError();
    return defaultFeedback;
  }
}

/** @deprecated Use generateJapaneseFeedback instead */
export const generateEnglishFeedback = generateJapaneseFeedback;

function validateCefrLevel(level: string): CEFRLevel | null {
  const validLevels: CEFRLevel[] = ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+'];
  return validLevels.includes(level as CEFRLevel) ? (level as CEFRLevel) : null;
}

/**
 * Get CEFR level description
 */
export function getCefrDescription(level: CEFRLevel): string {
  const descriptions: Record<CEFRLevel, string> = {
    'A1': '入門 - ひらがな・カタカナ、基本的な挨拶（JLPT N5相当）',
    'A1+': '入門上 - 簡単な自己紹介、基本的な助詞',
    'A2': '初級 - 日常会話、基本漢字（JLPT N4相当）',
    'A2+': '初級上 - 身近な場面での会話、て形の活用',
    'B1': '中級 - 一般的な話題、複文（JLPT N3相当）',
    'B1+': '中級上 - 意見表明、敬語の基礎',
    'B2': '中上級 - 抽象的な話題、フォーマルな文章（JLPT N2相当）',
    'B2+': '中上級上 - ニュアンスのある議論、ニュース理解',
    'C1': '上級 - 複雑な文章、自然な表現（JLPT N1相当）',
    'C1+': '熟達 - ネイティブに近い流暢さ、専門分野の議論'
  };
  return descriptions[level];
}

/**
 * Generate a sample answer for Versant practice using Gemini API
 */
export async function generateVersantSampleAnswer(
  question: string,
  part: 'E' | 'F',
  userCefrLevel: CEFRLevel = 'B1'
): Promise<string> {
  // Target level is i+1 (one level higher than current)
  const levelProgression: Record<CEFRLevel, CEFRLevel> = {
    'A1': 'A1+', 'A1+': 'A2', 'A2': 'A2+', 'A2+': 'B1',
    'B1': 'B1+', 'B1+': 'B2', 'B2': 'B2+', 'B2+': 'C1',
    'C1': 'C1+', 'C1+': 'C1+'
  };
  const targetLevel = levelProgression[userCefrLevel];

  // Default fallback
  const defaultAnswer = part === 'E'
    ? 'この文章は主なテーマとポイントについて述べています。中心的な考えを支える重要な詳細が含まれています。結論として、この情報はテーマを理解するのに役立ちます。'
    : '私の意見では、これは大切なテーマだと思います。考えるべきことがいくつかあると思います。まず、主な点について考える必要があります。さらに、メリットとデメリットがあります。全体的に、多くの人に影響を与えることだと思います。';

  // Check API limits
  const { allowed } = canCallApi();
  if (!allowed) {
    return defaultAnswer;
  }

  try {
    const timeLimit = part === 'E' ? 30 : 40;

    const prompt = part === 'E'
      ? `日本語スピーキングテストの模範解答を作成してください。

課題: 以下の文章を要約して話してください。
「${question}」

条件:
- 日本語レベル: CEFR ${targetLevel}
- ${timeLimit}秒以内に話せる長さ
- 構成: 主旨 → 要点 → まとめ
- 接続詞を適切に使用（まず、さらに、最後に等）
- 自然な話し言葉で書くこと

模範解答のみを出力してください（説明やラベルは不要）。`
      : `日本語スピーキングテストの模範解答を作成してください。

課題: 以下の質問に自分の意見を述べてください。
「${question}」

条件:
- 日本語レベル: CEFR ${targetLevel}
- ${timeLimit}秒以内に話せる長さ
- 構成: 意見表明 → 理由2〜3つ（具体例付き） → 結論
- 自然な話し言葉（「〜と思います」「例えば」「まとめると」等を使用）

模範解答のみを出力してください（説明やラベルは不要）。`;

    const sampleAnswer = await callGeminiApi(prompt);

    // Record API usage
    const estimatedTokens = Math.ceil(question.length / 3) + 100;
    recordApiUsage(estimatedTokens);
    recordApiSuccess();

    return sampleAnswer.trim();

  } catch (error: any) {
    console.error('Gemini sample answer error:', error.message);
    recordApiError();
    return defaultAnswer;
  }
}
