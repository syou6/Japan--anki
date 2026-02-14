import { GoogleGenerativeAI } from '@google/generative-ai';
import { canCallApi, recordApiUsage, recordApiSuccess, recordApiError, showApiUsageWarning } from './api-limiter';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
    markdownContent: `## 📊 Feedback & Corrections
Your diary entry has been recorded. Keep practicing your Japanese every day!

## 💪 Encouragement
Great work! Keep speaking Japanese every day — you're improving little by little!`
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


    const prompt = `# Role
You are an expert Japanese language coach designed to help English-speaking users improve their Japanese skills through their diary entries.

# Inputs provided by the system
1. **User Level:** ${userCefrLevel} (CEFR)
2. **Diary Transcript:**
${content}

# Your Task
Analyze the diary transcript and provide output in two main sections. ALL explanations and feedback must be written in **English**.

## Section 1: Feedback & Level Up
Analyze the Japanese based on the user's level.
- **Tone:** Encouraging, empathetic, and professional.
- **Language:** Explain the feedback in **English** so the user clearly understands, but show Japanese examples.
- **Constraint:** The advice must be aimed at **one level slightly higher** than the User Level (i+1 = ${targetLevel}).

**Analysis points:**
1. **Grammar & Particles:** Correct unnatural phrasing or particle misuse. If the user uses simple grammar, suggest a more sophisticated structure appropriate for the next level.
2. **Vocabulary & Kanji:** Identify basic words used and suggest more natural or advanced alternatives. Include kanji with readings.
3. **Pronunciation & Pitch Accent:** Identify 2-3 words in the user's text that are typically difficult for English speakers. Provide tips on pitch accent and pronunciation.

## Section 2: Topic Extension (Reading Material)
Based on the content of the diary:
1. **Identify the Main Topic:** Extract the core theme.
2. **Generate an Article:** Write an engaging article in **Japanese** (approx. 150-200 characters) about this topic.
   - **Difficulty:** The Japanese level must be **slightly higher (i+1 = ${targetLevel})** than the User Level.
   - **Content:** Include enough rich vocabulary to support the extraction of 10 key items.
3. **Vocabulary List:** Extract **10 key words or phrases** from this generated article that are valuable for the user to learn.

# Output Format (Markdown)

## 📊 Feedback & Corrections
(Provide corrections in English, explain grammar/particle usage, and suggest better vocabulary)

## 🗣️ Pronunciation & Pitch Accent Tips
(List tricky words from the user's text and tips on how to pronounce them naturally)

## 📖 Recommended Reading: [Insert Topic Name]
(Insert the generated Japanese article here)

## 🇺🇸 English Summary
(Brief summary of the article in English)

## 🗝️ Key Vocabulary & Phrases
(List **10** important words/phrases from the "Recommended Reading" article above. Use the format below:)
- **[Japanese]** \`[Reading]\` : [English Meaning]

## 💪 Encouragement
(Write a personalized encouraging message in English, praising specific good points and suggesting next steps)`;

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
    'A1': 'Beginner - Hiragana/Katakana, basic greetings (JLPT N5)',
    'A1+': 'Beginner High - Simple self-introduction, basic particles',
    'A2': 'Elementary - Daily conversations, basic kanji (JLPT N4)',
    'A2+': 'Elementary High - Familiar situations, te-form mastery',
    'B1': 'Intermediate - General topics, compound sentences (JLPT N3)',
    'B1+': 'Intermediate High - Express opinions, keigo basics',
    'B2': 'Upper Intermediate - Abstract topics, formal writing (JLPT N2)',
    'B2+': 'Upper Intermediate High - Nuanced discussion, news comprehension',
    'C1': 'Advanced - Complex texts, natural expression (JLPT N1)',
    'C1+': 'Proficient - Near-native fluency, specialized discourse'
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

  if (!apiKey) {
    return defaultAnswer;
  }

  // Check API limits
  const { allowed } = canCallApi();
  if (!allowed) {
    return defaultAnswer;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash'
    });

    const timeLimit = part === 'E' ? 30 : 40;
    const wordCount = part === 'E' ? '60-80' : '80-100';

    const prompt = part === 'E'
      ? `You are a Japanese speaking test sample answer generator.

**Task:** Generate a model summary answer in Japanese for this passage:
"${question}"

**Requirements:**
- CEFR Level: ${targetLevel} (target level for the learner)
- Length: Speakable within ${timeLimit} seconds
- Include: Main idea, key supporting points, conclusion
- Tone: Clear, organized, natural spoken Japanese
- Use appropriate transition words (まず, さらに, 最後に, etc.)
- Write entirely in Japanese

**Output:** Only the sample answer text in Japanese, no explanations or labels.`
      : `You are a Japanese speaking test sample answer generator.

**Task:** Generate a model opinion answer in Japanese for this question:
"${question}"

**Requirements:**
- CEFR Level: ${targetLevel} (target level for the learner)
- Length: Speakable within ${timeLimit} seconds
- Structure: State opinion → Give 2-3 reasons with examples → Conclude
- Tone: Natural spoken Japanese, conversational but organized
- Use appropriate phrases: 「私の意見では」「〜と思います」「例えば」「さらに」「まとめると」
- Write entirely in Japanese

**Output:** Only the sample answer text in Japanese, no explanations or labels.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sampleAnswer = response.text().trim();

    // Record API usage
    const estimatedTokens = Math.ceil(question.length / 3) + 100;
    recordApiUsage(estimatedTokens);
    recordApiSuccess();

    return sampleAnswer;

  } catch (error: any) {
    console.error('Gemini sample answer error:', error.message);
    recordApiError();
    return defaultAnswer;
  }
}
