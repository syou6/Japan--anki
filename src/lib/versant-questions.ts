/**
 * Versant Practice Questions
 * Part E: Summary (30 seconds to respond)
 * Part F: Opinion (40 seconds to respond)
 */

export interface VersantQuestion {
  id: string;
  part: 'E' | 'F';
  text: string;
  timeLimit: number; // seconds
  category?: string;
}

// Part E: Summary Questions (Listen to a passage and summarize in 30 seconds)
export const partEQuestions: VersantQuestion[] = [
  {
    id: 'e1',
    part: 'E',
    text: `The company decided to implement a new remote work policy. Starting next month, employees can work from home up to three days per week. This change was made after a survey showed that 80% of employees preferred flexible work arrangements. The management believes this will improve work-life balance and reduce commuting stress.`,
    timeLimit: 30,
    category: 'Business'
  },
  {
    id: 'e2',
    part: 'E',
    text: `A new study found that people who exercise regularly have better memory and concentration. Researchers tested 500 participants over two years. Those who exercised at least 30 minutes a day performed 20% better on cognitive tests. The scientists recommend combining physical activity with mental exercises for best results.`,
    timeLimit: 30,
    category: 'Health'
  },
  {
    id: 'e3',
    part: 'E',
    text: `The city announced a new public transportation plan. They will add 50 electric buses and extend the subway line to the airport. The project will cost 2 billion dollars and take three years to complete. Officials expect this will reduce traffic congestion by 30% and help the environment.`,
    timeLimit: 30,
    category: 'Transportation'
  },
  {
    id: 'e4',
    part: 'E',
    text: `A famous restaurant chain is changing its menu to include more plant-based options. The CEO said customer demand for vegetarian and vegan dishes has doubled in the past year. They will introduce ten new items next month. The company also plans to use only sustainable packaging by the end of the year.`,
    timeLimit: 30,
    category: 'Food'
  },
  {
    id: 'e5',
    part: 'E',
    text: `Universities are seeing a rise in online learning. Last year, enrollment in online courses increased by 40%. Students say they like the flexibility of studying from anywhere. However, some professors worry that students miss important social interactions. Many schools are now offering hybrid programs that combine online and in-person classes.`,
    timeLimit: 30,
    category: 'Education'
  },
  {
    id: 'e6',
    part: 'E',
    text: `A technology company launched a new smartphone with advanced AI features. The phone can translate conversations in real-time and take professional-quality photos automatically. It costs $999 and will be available in stores next week. Early reviews say the battery life could be better, but overall the phone has received positive feedback.`,
    timeLimit: 30,
    category: 'Technology'
  }
];

// Part F: Opinion Questions (Give your opinion in 40 seconds)
export const partFQuestions: VersantQuestion[] = [
  {
    id: 'f1',
    part: 'F',
    text: `Some people think that working from home is better than working in an office. What is your opinion?`,
    timeLimit: 40,
    category: 'Work'
  },
  {
    id: 'f2',
    part: 'F',
    text: `Do you think social media has more positive or negative effects on society? Please explain your view.`,
    timeLimit: 40,
    category: 'Technology'
  },
  {
    id: 'f3',
    part: 'F',
    text: `Should students be required to wear uniforms at school? Why or why not?`,
    timeLimit: 40,
    category: 'Education'
  },
  {
    id: 'f4',
    part: 'F',
    text: `Is it better to live in a big city or a small town? What do you prefer and why?`,
    timeLimit: 40,
    category: 'Lifestyle'
  },
  {
    id: 'f5',
    part: 'F',
    text: `Some people prefer to travel alone, while others like to travel with friends or family. Which do you prefer?`,
    timeLimit: 40,
    category: 'Travel'
  },
  {
    id: 'f6',
    part: 'F',
    text: `Do you think it's important to learn a foreign language? Please explain your answer.`,
    timeLimit: 40,
    category: 'Education'
  },
  {
    id: 'f7',
    part: 'F',
    text: `Should companies be required to offer paid parental leave? What is your opinion?`,
    timeLimit: 40,
    category: 'Work'
  },
  {
    id: 'f8',
    part: 'F',
    text: `Is it better to save money or spend it on experiences? What do you think?`,
    timeLimit: 40,
    category: 'Finance'
  },
  {
    id: 'f9',
    part: 'F',
    text: `Do you think online shopping will replace traditional stores in the future? Why or why not?`,
    timeLimit: 40,
    category: 'Shopping'
  },
  {
    id: 'f10',
    part: 'F',
    text: `Should people be required to vote in elections? Please share your thoughts.`,
    timeLimit: 40,
    category: 'Politics'
  },
  {
    id: 'f11',
    part: 'F',
    text: `Is it important for children to learn how to cook? What do you think?`,
    timeLimit: 40,
    category: 'Life Skills'
  },
  {
    id: 'f12',
    part: 'F',
    text: `Do you think electric cars will become more popular than gasoline cars? Why?`,
    timeLimit: 40,
    category: 'Environment'
  },
  {
    id: 'f13',
    part: 'F',
    text: `Should homework be given to students every day? What is your opinion?`,
    timeLimit: 40,
    category: 'Education'
  },
  {
    id: 'f14',
    part: 'F',
    text: `Do you prefer to read books or watch movies? Please explain your preference.`,
    timeLimit: 40,
    category: 'Entertainment'
  },
  {
    id: 'f15',
    part: 'F',
    text: `Is it important to have a healthy work-life balance? How can people achieve this?`,
    timeLimit: 40,
    category: 'Work'
  },
  {
    id: 'f16',
    part: 'F',
    text: `Should fast food be banned in schools? What do you think?`,
    timeLimit: 40,
    category: 'Health'
  },
  {
    id: 'f17',
    part: 'F',
    text: `Do you think robots will take over many jobs in the future? Is this good or bad?`,
    timeLimit: 40,
    category: 'Technology'
  },
  {
    id: 'f18',
    part: 'F',
    text: `Is it better to have a few close friends or many acquaintances? What do you prefer?`,
    timeLimit: 40,
    category: 'Relationships'
  },
  {
    id: 'f19',
    part: 'F',
    text: `Should people reduce their use of plastic? What can individuals do to help?`,
    timeLimit: 40,
    category: 'Environment'
  },
  {
    id: 'f20',
    part: 'F',
    text: `Do you think it's important to follow the news every day? Why or why not?`,
    timeLimit: 40,
    category: 'Media'
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
