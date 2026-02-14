/**
 * JLPT-style Speaking Practice Questions
 * Part E: Summary (30 seconds to respond) - Listen to a Japanese passage and summarize
 * Part F: Opinion (40 seconds to respond) - Answer a question in Japanese
 */

export interface VersantQuestion {
  id: string;
  part: 'E' | 'F';
  text: string;
  timeLimit: number; // seconds
  category?: string;
}

// Part E: Summary Questions (Listen to a Japanese passage and summarize in 30 seconds)
export const partEQuestions: VersantQuestion[] = [
  {
    id: 'e1',
    part: 'E',
    text: `ある会社は来月から新しいリモートワーク制度を始めることにしました。社員は週に三日まで自宅で仕事ができるようになります。社員アンケートで80%の人が柔軟な働き方を希望していたことがわかり、この変更が決まりました。経営陣は、これによりワークライフバランスが改善され、通勤のストレスも減ると考えています。`,
    timeLimit: 30,
    category: 'ビジネス'
  },
  {
    id: 'e2',
    part: 'E',
    text: `新しい研究によると、定期的に運動する人は記憶力と集中力が良いことがわかりました。研究者は500人の参加者を2年間にわたって調査しました。毎日少なくとも30分運動した人は、認知テストで20%高い成績を出しました。科学者たちは、最良の結果を得るために身体活動と脳のトレーニングを組み合わせることを勧めています。`,
    timeLimit: 30,
    category: '健康'
  },
  {
    id: 'e3',
    part: 'E',
    text: `市は新しい公共交通機関の計画を発表しました。電気バスを50台追加し、地下鉄の路線を空港まで延長する予定です。このプロジェクトは20億ドルの費用がかかり、完成まで3年かかる見込みです。当局は、これにより交通渋滞が30%減少し、環境にも良い影響があると期待しています。`,
    timeLimit: 30,
    category: '交通'
  },
  {
    id: 'e4',
    part: 'E',
    text: `有名なレストランチェーンがメニューを変更して、植物性の料理を増やすことにしました。社長によると、ベジタリアンやビーガン料理の需要がこの1年で2倍になったそうです。来月には10種類の新メニューが登場します。また、年末までに全ての包装を環境に優しい素材に変える計画もあります。`,
    timeLimit: 30,
    category: '食べ物'
  },
  {
    id: 'e5',
    part: 'E',
    text: `大学ではオンライン学習が増えています。昨年、オンラインコースの登録者数は40%増加しました。学生たちはどこからでも勉強できる柔軟性が気に入っていると言っています。しかし、一部の教授は学生が大切な社会的交流を逃していることを心配しています。多くの学校がオンラインと対面授業を組み合わせたハイブリッドプログラムを提供し始めています。`,
    timeLimit: 30,
    category: '教育'
  },
  {
    id: 'e6',
    part: 'E',
    text: `あるテクノロジー企業が、高度なAI機能を搭載した新しいスマートフォンを発売しました。このスマートフォンはリアルタイムで会話を翻訳し、自動的にプロ品質の写真を撮ることができます。価格は999ドルで、来週から店頭に並びます。初期のレビューでは、バッテリーの持ちが改善できると言われていますが、全体的にはポジティブな評価を受けています。`,
    timeLimit: 30,
    category: 'テクノロジー'
  }
];

// Part F: Opinion Questions (Give your opinion in Japanese in 40 seconds)
export const partFQuestions: VersantQuestion[] = [
  {
    id: 'f1',
    part: 'F',
    text: `在宅勤務とオフィス勤務、どちらが良いと思いますか？あなたの意見を聞かせてください。`,
    timeLimit: 40,
    category: '仕事'
  },
  {
    id: 'f2',
    part: 'F',
    text: `SNSは社会にとってプラスの影響が大きいですか、それともマイナスの影響が大きいですか？あなたの考えを教えてください。`,
    timeLimit: 40,
    category: 'テクノロジー'
  },
  {
    id: 'f3',
    part: 'F',
    text: `学校で制服を着ることは必要だと思いますか？理由も含めて答えてください。`,
    timeLimit: 40,
    category: '教育'
  },
  {
    id: 'f4',
    part: 'F',
    text: `大きな都市と小さな町、どちらに住みたいですか？その理由は何ですか？`,
    timeLimit: 40,
    category: '生活'
  },
  {
    id: 'f5',
    part: 'F',
    text: `一人で旅行するのと、友達や家族と旅行するのと、どちらが好きですか？`,
    timeLimit: 40,
    category: '旅行'
  },
  {
    id: 'f6',
    part: 'F',
    text: `外国語を学ぶことは大切だと思いますか？あなたの考えを教えてください。`,
    timeLimit: 40,
    category: '教育'
  },
  {
    id: 'f7',
    part: 'F',
    text: `会社は育児休暇を義務化するべきだと思いますか？あなたの意見を聞かせてください。`,
    timeLimit: 40,
    category: '仕事'
  },
  {
    id: 'f8',
    part: 'F',
    text: `お金を貯めるのと経験に使うのと、どちらが良いと思いますか？`,
    timeLimit: 40,
    category: 'お金'
  },
  {
    id: 'f9',
    part: 'F',
    text: `将来、ネットショッピングが実店舗に取って代わると思いますか？なぜそう思いますか？`,
    timeLimit: 40,
    category: '買い物'
  },
  {
    id: 'f10',
    part: 'F',
    text: `選挙で投票することを義務化するべきだと思いますか？あなたの考えを聞かせてください。`,
    timeLimit: 40,
    category: '政治'
  },
  {
    id: 'f11',
    part: 'F',
    text: `子供が料理を学ぶことは大切だと思いますか？あなたの意見を教えてください。`,
    timeLimit: 40,
    category: '生活スキル'
  },
  {
    id: 'f12',
    part: 'F',
    text: `電気自動車はガソリン車よりも普及すると思いますか？なぜですか？`,
    timeLimit: 40,
    category: '環境'
  },
  {
    id: 'f13',
    part: 'F',
    text: `毎日宿題を出すべきだと思いますか？あなたの意見を聞かせてください。`,
    timeLimit: 40,
    category: '教育'
  },
  {
    id: 'f14',
    part: 'F',
    text: `本を読むのと映画を見るのと、どちらが好きですか？理由も教えてください。`,
    timeLimit: 40,
    category: '娯楽'
  },
  {
    id: 'f15',
    part: 'F',
    text: `ワークライフバランスは大切だと思いますか？どうすれば実現できますか？`,
    timeLimit: 40,
    category: '仕事'
  },
  {
    id: 'f16',
    part: 'F',
    text: `学校でファストフードを禁止するべきだと思いますか？あなたの考えを教えてください。`,
    timeLimit: 40,
    category: '健康'
  },
  {
    id: 'f17',
    part: 'F',
    text: `将来、ロボットが多くの仕事を引き継ぐと思いますか？それは良いことですか、悪いことですか？`,
    timeLimit: 40,
    category: 'テクノロジー'
  },
  {
    id: 'f18',
    part: 'F',
    text: `親しい友達が少ない方がいいですか、知り合いが多い方がいいですか？あなたはどちらを好みますか？`,
    timeLimit: 40,
    category: '人間関係'
  },
  {
    id: 'f19',
    part: 'F',
    text: `プラスチックの使用を減らすべきだと思いますか？個人として何ができますか？`,
    timeLimit: 40,
    category: '環境'
  },
  {
    id: 'f20',
    part: 'F',
    text: `毎日ニュースを見ることは大切だと思いますか？なぜそう思いますか？`,
    timeLimit: 40,
    category: 'メディア'
  }
];

// Get random question by part
export function getRandomQuestion(part: 'E' | 'F'): VersantQuestion {
  const questions = part === 'E' ? partEQuestions : partFQuestions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Get all questions by part
export function getQuestionsByPart(part: 'E' | 'F'): VersantQuestion[] {
  return part === 'E' ? partEQuestions : partFQuestions;
}

// Get question by ID
export function getQuestionById(id: string): VersantQuestion | undefined {
  return [...partEQuestions, ...partFQuestions].find(q => q.id === id);
}
