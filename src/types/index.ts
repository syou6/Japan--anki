export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'child';
  avatar_url?: string;
  family_id?: string;
  cefr_level?: CEFRLevel;
  created_at: string;
}

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

export interface DiaryEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  voice_url?: string;
  duration?: number;
  emotion?: string;
  health_score?: number;
  weather?: string;
  tags: string[];
  visibility: 'private' | 'family' | 'custom';
  ai_summary?: string;
  ai_feedback?: EnglishFeedback;
  created_at: string;
  user?: User;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  diary_id: string;
  user_id: string;
  content: string;
  voice_url?: string;
  created_at: string;
  user?: User;
}

export interface Family {
  id: string;
  name: string;
  created_at: string;
  members?: User[];
}

export interface HealthAnalysis {
  score: number;
  mood: string;
  energy_level: number;
  concerns: string[];
  recommendations: string[];
}