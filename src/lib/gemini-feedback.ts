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

export interface KeyVocabulary {
  word: string;
  phonetic: string;
  meaningJa: string;
  example: string;
}

export interface TopicExtension {
  topic: string;
  article: string;
  articleSummaryJa: string;
  keyVocabulary: KeyVocabulary[];
}

export interface EnglishFeedback {
  overallScore: number;
  cefrLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  summary: string;
  grammarCorrections: GrammarCorrection[];
  vocabularySuggestions: VocabularySuggestion[];
  pronunciationTips: PronunciationTip[];
  topicExtension: TopicExtension | null;
  encouragement: string;
}

/**
 * Generate English feedback for diary entry using Gemini API
 */
export async function generateEnglishFeedback(
  content: string,
  userCefrLevel: CEFRLevel = 'B1'
): Promise<EnglishFeedback> {
  // Target level is i+1 (one level higher than current)
  const levelProgressionDefault: Record<CEFRLevel, CEFRLevel> = {
    'A1': 'A2', 'A2': 'B1', 'B1': 'B2', 'B2': 'C1', 'C1': 'C2', 'C2': 'C2'
  };

  // Default fallback response
  const defaultFeedback: EnglishFeedback = {
    overallScore: 70,
    cefrLevel: userCefrLevel,
    targetLevel: levelProgressionDefault[userCefrLevel],
    summary: 'Your diary entry has been recorded.',
    grammarCorrections: [],
    vocabularySuggestions: [],
    pronunciationTips: [],
    topicExtension: null,
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

    // Target level is i+1 (one level higher than current)
    const levelProgression: Record<CEFRLevel, CEFRLevel> = {
      'A1': 'A2', 'A2': 'B1', 'B1': 'B2', 'B2': 'C1', 'C1': 'C2', 'C2': 'C2'
    };
    const targetLevel = levelProgression[userCefrLevel];

    const prompt = `# Role
You are an expert English language coach designed to help users improve their English skills through their diary entries.

# Inputs
- **User Level:** ${userCefrLevel} (CEFR)
- **Target Level:** ${targetLevel} (i+1 - one level higher)
- **Diary Transcript:**
${content}

# Your Task
Analyze the diary transcript and provide comprehensive feedback.

## Requirements:
1. **Tone:** Encouraging, empathetic, and professional.
2. **Language:** Explain feedback in **Japanese** so the user clearly understands, but show English examples.
3. **Constraint:** All advice must be aimed at **${targetLevel} level** (one level higher than current).

## Analysis Points:
1. **Grammar & Phrasing:** Correct unnatural phrasing. If the user uses simple grammar, suggest more sophisticated structures appropriate for ${targetLevel} level.
2. **Vocabulary:** Identify basic words and suggest more precise or academic synonyms suitable for ${targetLevel}.
3. **Pronunciation Advice:** Identify 2-3 words that are typically difficult for Japanese speakers to pronounce. Provide IPA phonetics and tips.

## Topic Extension:
Based on the diary content:
1. Identify the main topic/theme
2. Generate an engaging article (150-200 words) about this topic at ${targetLevel} level
3. Extract 10 key vocabulary items from the article

# Output Format (JSON only)
Respond with ONLY valid JSON:
{
  "overallScore": <number 0-100 based on current level performance>,
  "cefrLevel": "${userCefrLevel}",
  "targetLevel": "${targetLevel}",
  "summary": "<日本語で日記の内容を1-2文で要約>",
  "grammarCorrections": [
    {
      "original": "<original phrase>",
      "corrected": "<corrected phrase for ${targetLevel} level>",
      "explanation": "<日本語で文法の説明と、なぜこの表現がより良いか>"
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "<basic word/phrase used>",
      "suggestion": "<more sophisticated alternative for ${targetLevel}>",
      "example": "<example sentence using the suggestion>"
    }
  ],
  "pronunciationTips": [
    {
      "word": "<word from diary>",
      "phonetic": "<IPA pronunciation>",
      "tip": "<日本語で発音のコツ、日本人が間違えやすいポイント>"
    }
  ],
  "topicExtension": {
    "topic": "<main topic extracted from diary>",
    "article": "<150-200 word article at ${targetLevel} level about the topic>",
    "articleSummaryJa": "<記事の日本語要約（2-3文）>",
    "keyVocabulary": [
      {
        "word": "<word/phrase from article>",
        "phonetic": "<IPA pronunciation>",
        "meaningJa": "<日本語の意味>",
        "example": "<example sentence>"
      }
    ]
  },
  "encouragement": "<日本語で励ましのメッセージ。具体的に良かった点を褒め、次のステップを提案>"
}

## Guidelines:
- Provide 2-4 grammar corrections (focus on ${targetLevel} level improvements)
- Suggest 3-5 vocabulary improvements (from basic to sophisticated)
- Give 2-3 pronunciation tips for commonly mispronounced words
- The topic extension article must contain exactly 10 key vocabulary items
- Be specific about what the user did well
- Make the encouragement personal and motivating`;

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
    const levelProgressionValidate: Record<CEFRLevel, CEFRLevel> = {
      'A1': 'A2', 'A2': 'B1', 'B1': 'B2', 'B2': 'C1', 'C1': 'C2', 'C2': 'C2'
    };

    return {
      overallScore: Math.min(100, Math.max(0, feedback.overallScore || 70)),
      cefrLevel: validateCefrLevel(feedback.cefrLevel) || userCefrLevel,
      targetLevel: validateCefrLevel(feedback.targetLevel) || levelProgressionValidate[userCefrLevel],
      summary: feedback.summary || defaultFeedback.summary,
      grammarCorrections: Array.isArray(feedback.grammarCorrections)
        ? feedback.grammarCorrections.slice(0, 5)
        : [],
      vocabularySuggestions: Array.isArray(feedback.vocabularySuggestions)
        ? feedback.vocabularySuggestions.slice(0, 6)
        : [],
      pronunciationTips: Array.isArray(feedback.pronunciationTips)
        ? feedback.pronunciationTips.slice(0, 4)
        : [],
      topicExtension: feedback.topicExtension ? {
        topic: feedback.topicExtension.topic || '',
        article: feedback.topicExtension.article || '',
        articleSummaryJa: feedback.topicExtension.articleSummaryJa || '',
        keyVocabulary: Array.isArray(feedback.topicExtension.keyVocabulary)
          ? feedback.topicExtension.keyVocabulary.slice(0, 10)
          : []
      } : null,
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
