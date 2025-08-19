export interface User {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'child';
  avatar_url?: string;
  family_id?: string;
  created_at: string;
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