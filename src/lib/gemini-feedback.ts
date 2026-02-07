import { GoogleGenerativeAI } from '@google/generative-ai';
import { canCallApi, recordApiUsage, recordApiSuccess, recordApiError, showApiUsageWarning } from './api-limiter';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Markdown形式のフィードバック
export interface EnglishFeedback {
  cefrLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  markdownContent: string;  // 全フィードバックをMarkdownで保存
}

/**
 * Generate English feedback for diary entry using Gemini API
 */
export async function generateEnglishFeedback(
  content: string,
  userCefrLevel: CEFRLevel = 'B1'
): Promise<EnglishFeedback> {
  // Target level is i+1 (one level higher than current)
  const levelProgression: Record<CEFRLevel, CEFRLevel> = {
    'A1': 'A2', 'A2': 'B1', 'B1': 'B2', 'B2': 'C1', 'C1': 'C2', 'C2': 'C2'
  };
  const targetLevel = levelProgression[userCefrLevel];

  // Default fallback response
  const defaultFeedback: EnglishFeedback = {
    cefrLevel: userCefrLevel,
    targetLevel: targetLevel,
    markdownContent: `## 📊 Feedback & Corrections
Your diary entry has been recorded. Keep practicing your English every day!

## 💪 Encouragement
頑張って英語の練習を続けてください！毎日少しずつ上達しています。`
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

# Inputs provided by the system
1. **User Level:** ${userCefrLevel} (CEFR)
2. **Diary Transcript:**
${content}

# Your Task
Analyze the diary transcript and provide output in two main sections.

## Section 1: Feedback & Level Up
Analyze the English based on the user's level.
- **Tone:** Encouraging, empathetic, and professional.
- **Language:** Explain the feedback in **Japanese** so the user clearly understands, but show English examples.
- **Constraint:** The advice must be aimed at **one level slightly higher** than the User Level (i+1 = ${targetLevel}).

**Analysis points:**
1. **Grammar & Phrasing:** Correct unnatural phrasing. If the user uses simple grammar, suggest a more sophisticated structure appropriate for the next level.
2. **Vocabulary:** Identify basic words used and suggest more precise or academic synonyms.
3. **Pronunciation Advice:** Identify 2-3 words in the user's text that are typically difficult to pronounce. Provide phonetics or tips.

## Section 2: Topic Extension (Reading Material)
Based on the content of the diary:
1. **Identify the Main Topic:** Extract the core theme.
2. **Generate an Article:** Write an engaging article (approx. 150-200 words) about this topic.
   - **Difficulty:** The English level must be **slightly higher (i+1 = ${targetLevel})** than the User Level.
   - **Content:** Include enough rich vocabulary to support the extraction of 10 key items.
3. **Vocabulary List:** Extract **10 key words or phrases** from this generated article that are valuable for the user to learn.

# Output Format (Markdown)

## 📊 Feedback & Corrections
(Provide corrections, grammar explanations in Japanese, and better vocabulary suggestions here)

## 🗣️ Pronunciation Tips
(List tricky words from the user's text and tips on how to say them)

## 📖 Recommended Reading: [Insert Topic Name]
(Insert the generated English article here)

## 🇯🇵 Summary
(Brief summary of the article in Japanese)

## 🗝️ Key Vocabulary & Phrases
(List **10** important words/phrases from the "Recommended Reading" article above. Use the format below:)
- **[Word/Phrase]** \`[IPA Pronunciation]\` : [Japanese Meaning]

## 💪 Encouragement
(Write a personalized encouraging message in Japanese, praising specific good points and suggesting next steps)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const markdownContent = response.text();

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
