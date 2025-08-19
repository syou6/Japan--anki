// Gemini API integration for voice transcription and AI analysis
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiService {
  private apiKey: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert audio blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      
      const response = await fetch(`${GEMINI_API_URL}/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'この音声ファイルを日本語で文字起こししてください。高齢者の話し方を理解し、自然な日本語で正確に変換してください。'
            }, {
              inline_data: {
                mime_type: audioBlob.type,
                data: base64Audio.split(',')[1]
              }
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '文字起こしできませんでした。';
    } catch (error) {
      console.error('Transcription error:', error);
      return 'エラーが発生しました。もう一度お試しください。';
    }
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `以下の日記の内容を1-2文で要約してください。高齢者の方の日記なので、温かみのある表現でまとめてください：\n\n${content}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 150,
          }
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Summary error:', error);
      return '';
    }
  }

  async analyzeEmotion(content: string): Promise<{ emotion: string; healthScore: number }> {
    try {
      const response = await fetch(`${GEMINI_API_URL}/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `以下の日記の内容から感情と健康度を分析してください。

日記の内容：
${content}

以下のJSON形式で回答してください：
{
  "emotion": "感情（喜び、悲しみ、不安、平穏、怒りなど）",
  "healthScore": "健康度（1-100の数値）",
  "analysis": "簡潔な分析コメント"
}

高齢者の方の心身の健康状態を考慮して、優しく分析してください。`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 200,
          }
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      try {
        const parsed = JSON.parse(text.replace(/```json\n|\n```/g, ''));
        return {
          emotion: parsed.emotion || '平穏',
          healthScore: parsed.healthScore || 75
        };
      } catch {
        return { emotion: '平穏', healthScore: 75 };
      }
    } catch (error) {
      console.error('Emotion analysis error:', error);
      return { emotion: '平穏', healthScore: 75 };
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const geminiService = new GeminiService();