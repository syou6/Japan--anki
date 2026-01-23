import { GoogleGenerativeAI } from '@google/generative-ai';
import { canCallApi, recordApiUsage, recordApiSuccess, recordApiError, showApiUsageWarning } from './api-limiter';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularySuggestion {
  original: string;
  suggestion: string;
  example: string;
}

export interface PronunciationTip {
  word: string;
  phonetic: string;
  tip: string;
}

export interface ReadingMaterial {
  title: string;
  description: string;
  url?: string;
}

export interface EnglishFeedback {
  overallScore: number;
  cefrLevel: CEFRLevel;
  summary: string;
  grammarCorrections: GrammarCorrection[];
  vocabularySuggestions: VocabularySuggestion[];
  pronunciationTips: PronunciationTip[];
  readingMaterials: ReadingMaterial[];
  encouragement: string;
}

/**
 * Generate English feedback for diary entry using Gemini API
 */
export async function generateEnglishFeedback(
  content: string,
  userCefrLevel: CEFRLevel = 'B1'
): Promise<EnglishFeedback> {
  // Default fallback response
  const defaultFeedback: EnglishFeedback = {
    overallScore: 70,
    cefrLevel: userCefrLevel,
    summary: 'Your diary entry has been recorded.',
    grammarCorrections: [],
    vocabularySuggestions: [],
    pronunciationTips: [],
    readingMaterials: [],
    encouragement: 'Keep practicing your English every day!'
  };

  if (!apiKey) {
    console.log('Gemini API key not configured');
    return defaultFeedback;
  }

  // Check API limits
  const { allowed, reason } = canCallApi();
  if (!allowed) {
    console.warn('API limit reached:', reason);
    return defaultFeedback;
  }

  showApiUsageWarning();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash'
    });

    const prompt = `You are an English learning assistant for Japanese speakers at TOEIC 500 level (CEFR ${userCefrLevel}).

Analyze this English diary entry and provide helpful feedback in JSON format.
All explanations should be in Japanese to help the learner understand.

Diary entry:
${content}

Respond with ONLY valid JSON in this exact format:
{
  "overallScore": <number 0-100>,
  "cefrLevel": "<detected CEFR level: A1/A2/B1/B2/C1/C2>",
  "summary": "<日本語で1-2文のサマリー>",
  "grammarCorrections": [
    {
      "original": "<original phrase with error>",
      "corrected": "<corrected phrase>",
      "explanation": "<日本語で文法の説明>"
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "<word/phrase used>",
      "suggestion": "<better alternative>",
      "example": "<example sentence using the suggestion>"
    }
  ],
  "pronunciationTips": [
    {
      "word": "<word to practice>",
      "phonetic": "<IPA or simplified phonetic>",
      "tip": "<日本語で発音のコツ>"
    }
  ],
  "readingMaterials": [
    {
      "title": "<article/resource title>",
      "description": "<日本語で内容説明>"
    }
  ],
  "encouragement": "<日本語で励ましのメッセージ>"
}

Guidelines:
- Provide 1-3 grammar corrections (only actual errors)
- Suggest 1-3 vocabulary improvements
- Give 1-2 pronunciation tips for commonly mispronounced words
- Recommend 1-2 reading materials related to the diary topic
- Be encouraging and supportive
- If no errors, praise the good work and suggest advanced expressions`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const feedback = JSON.parse(jsonMatch[0]) as EnglishFeedback;

    // Record API usage
    const estimatedTokens = Math.ceil(content.length / 3) + 200;
    recordApiUsage(estimatedTokens);
    recordApiSuccess();

    // Validate and sanitize response
    return {
      overallScore: Math.min(100, Math.max(0, feedback.overallScore || 70)),
      cefrLevel: validateCefrLevel(feedback.cefrLevel) || userCefrLevel,
      summary: feedback.summary || defaultFeedback.summary,
      grammarCorrections: Array.isArray(feedback.grammarCorrections)
        ? feedback.grammarCorrections.slice(0, 5)
        : [],
      vocabularySuggestions: Array.isArray(feedback.vocabularySuggestions)
        ? feedback.vocabularySuggestions.slice(0, 5)
        : [],
      pronunciationTips: Array.isArray(feedback.pronunciationTips)
        ? feedback.pronunciationTips.slice(0, 3)
        : [],
      readingMaterials: Array.isArray(feedback.readingMaterials)
        ? feedback.readingMaterials.slice(0, 3)
        : [],
      encouragement: feedback.encouragement || defaultFeedback.encouragement
    };

  } catch (error: any) {
    console.error('Gemini feedback error:', error.message);
    recordApiError();
    return defaultFeedback;
  }
}

function validateCefrLevel(level: string): CEFRLevel | null {
  const validLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return validLevels.includes(level as CEFRLevel) ? (level as CEFRLevel) : null;
}

/**
 * Get CEFR level description
 */
export function getCefrDescription(level: CEFRLevel): string {
  const descriptions: Record<CEFRLevel, string> = {
    'A1': 'Beginner - Basic phrases and simple expressions',
    'A2': 'Elementary - Routine tasks and simple conversations',
    'B1': 'Intermediate - Main points in clear standard speech',
    'B2': 'Upper Intermediate - Complex texts and fluent conversation',
    'C1': 'Advanced - Complex texts and spontaneous expression',
    'C2': 'Proficient - Near-native understanding and expression'
  };
  return descriptions[level];
}
