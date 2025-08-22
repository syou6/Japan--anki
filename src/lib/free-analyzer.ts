// 無料のテキスト分析（Gemini API不要）

export interface AnalysisResult {
  summary: string;
  emotion: string;
  health_score: number;
  keywords: string[];
}

/**
 * シンプルな感情分析（ルールベース）
 */
function analyzeEmotion(text: string): string {
  const emotions = {
    '喜び': ['嬉しい', '楽しい', '幸せ', '良かった', 'ありがとう', '最高'],
    '楽しい': ['面白い', '笑', 'わくわく', '楽しみ', '遊んだ'],
    '悲しみ': ['悲しい', '寂しい', '辛い', '泣', '涙'],
    '不安': ['心配', '不安', '怖い', '困った', 'どうしよう'],
    '疲れ': ['疲れた', '眠い', 'だるい', '休みたい', 'しんどい'],
  };

  let maxScore = 0;
  let detectedEmotion = '普通';

  for (const [emotion, keywords] of Object.entries(emotions)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score++;
      }
    });
    
    if (score > maxScore) {
      maxScore = score;
      detectedEmotion = emotion;
    }
  }

  return detectedEmotion;
}

/**
 * 健康スコアの簡易計算
 */
function calculateHealthScore(text: string): number {
  let score = 75; // 基準値

  // ポジティブワード
  const positiveWords = ['元気', '健康', '食べた', '歩いた', '運動', '眠れた', '美味しい'];
  const negativeWords = ['痛い', '具合悪い', '食欲ない', '眠れない', '薬', '病院'];

  positiveWords.forEach(word => {
    if (text.includes(word)) score += 5;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 10;
  });

  // 0-100の範囲に収める
  return Math.max(0, Math.min(100, score));
}

/**
 * キーワード抽出（簡易版）
 */
function extractKeywords(text: string): string[] {
  // 重要そうな名詞を抽出（簡易版）
  const importantWords = [
    '散歩', '買い物', '病院', '薬', '家族', '友達',
    '朝ごはん', '昼ごはん', '夕ごはん', '運動', 'テレビ',
    '電話', '孫', '天気', '体調', '睡眠'
  ];

  const found: string[] = [];
  importantWords.forEach(word => {
    if (text.includes(word) && found.length < 3) {
      found.push(word);
    }
  });

  return found.length > 0 ? found : ['日常'];
}

/**
 * 簡易要約（最初の50文字 + 重要部分）
 */
function generateSummary(text: string): string {
  if (text.length <= 50) {
    return text;
  }

  // 句読点で区切って最初の2文を取得
  const sentences = text.split(/[。！？]/).filter(s => s.length > 0);
  if (sentences.length > 0) {
    return sentences.slice(0, 2).join('。') + '。';
  }

  return text.substring(0, 50) + '...';
}

/**
 * 無料でテキスト分析を実行
 */
export function analyzeFree(text: string): AnalysisResult {
  if (!text) {
    return {
      summary: '',
      emotion: '普通',
      health_score: 75,
      keywords: []
    };
  }

  try {
    const emotion = analyzeEmotion(text);
    const health_score = calculateHealthScore(text);
    const keywords = extractKeywords(text);
    const summary = generateSummary(text);

    console.log('無料分析結果:', { emotion, health_score, keywords });

    return {
      summary,
      emotion,
      health_score,
      keywords
    };
  } catch (error) {
    console.error('分析エラー:', error);
    return {
      summary: text.substring(0, 50) + '...',
      emotion: '普通',
      health_score: 75,
      keywords: []
    };
  }
}

/**
 * 家族向け要約（簡易版）
 */
export function generateFamilySummaryFree(text: string): string {
  const keywords = extractKeywords(text);
  const emotion = analyzeEmotion(text);
  const health = calculateHealthScore(text);

  let summary = '';
  
  // 健康状態
  if (health >= 80) {
    summary += '元気に過ごされています。';
  } else if (health >= 60) {
    summary += '普通に過ごされています。';
  } else {
    summary += '少し体調が気になります。';
  }

  // キーワード
  if (keywords.length > 0) {
    summary += `今日は${keywords.join('、')}などの話がありました。`;
  }

  // 感情
  if (emotion !== '普通') {
    summary += `気分は${emotion}のようです。`;
  }

  return summary || generateSummary(text);
}