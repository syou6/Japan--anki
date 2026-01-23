import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateEnglishFeedback, type CEFRLevel } from '../lib/gemini-feedback';
import type { VersantQuestion } from '../lib/versant-questions';

export interface VersantFeedback {
  cefrLevel: CEFRLevel;
  score: number;
  advice: string;
  sampleAnswer: string;
  grammarNotes: string[];
  vocabularyTips: string[];
}

export interface VersantAnswer {
  id: string;
  questionId: string;
  part: 'E' | 'F';
  question: VersantQuestion;
  transcribedText: string;
  audioUrl?: string;
  feedback?: VersantFeedback;
  createdAt: string;
}

interface VersantStore {
  // State
  currentQuestion: VersantQuestion | null;
  isRecording: boolean;
  isPracticing: boolean;
  timeRemaining: number;
  answers: VersantAnswer[];
  loading: boolean;

  // Actions
  setCurrentQuestion: (question: VersantQuestion | null) => void;
  startPractice: (question: VersantQuestion) => void;
  stopPractice: () => void;
  setTimeRemaining: (time: number) => void;
  saveAnswer: (questionId: string, transcribedText: string, audioBlob?: Blob) => Promise<VersantAnswer>;
  fetchHistory: () => Promise<void>;
  clearCurrentSession: () => void;
}

export const useVersantStore = create<VersantStore>((set, get) => ({
  currentQuestion: null,
  isRecording: false,
  isPracticing: false,
  timeRemaining: 0,
  answers: [],
  loading: false,

  setCurrentQuestion: (question) => {
    set({ currentQuestion: question });
  },

  startPractice: (question) => {
    set({
      currentQuestion: question,
      isPracticing: true,
      isRecording: false,
      timeRemaining: question.timeLimit
    });
  },

  stopPractice: () => {
    set({
      isPracticing: false,
      isRecording: false
    });
  },

  setTimeRemaining: (time) => {
    set({ timeRemaining: time });
  },

  saveAnswer: async (questionId: string, transcribedText: string, audioBlob?: Blob) => {
    const { currentQuestion } = get();
    if (!currentQuestion) {
      throw new Error('No current question');
    }

    set({ loading: true });

    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();

      // Generate feedback using Gemini
      let feedback: VersantFeedback | undefined;

      if (transcribedText.trim()) {
        try {
          // Get user's CEFR level
          let userCefrLevel: CEFRLevel = 'B1';
          if (user) {
            const { data: profile } = await supabase
              .from('users')
              .select('cefr_level')
              .eq('id', user.id)
              .single();
            userCefrLevel = profile?.cefr_level || 'B1';
          }

          // Generate feedback based on the question type
          const feedbackPrompt = currentQuestion.part === 'E'
            ? `The user was asked to summarize the following passage:\n"${currentQuestion.text}"\n\nTheir summary was:\n"${transcribedText}"`
            : `The user was asked: "${currentQuestion.text}"\n\nTheir response was:\n"${transcribedText}"`;

          const aiFeedback = await generateEnglishFeedback(feedbackPrompt, userCefrLevel);

          feedback = {
            cefrLevel: aiFeedback.cefrLevel,
            score: aiFeedback.overallScore,
            advice: aiFeedback.encouragement,
            sampleAnswer: generateSampleAnswer(currentQuestion),
            grammarNotes: aiFeedback.grammarCorrections.map(g => `${g.original} → ${g.corrected}: ${g.explanation}`),
            vocabularyTips: aiFeedback.vocabularySuggestions.map(v => `${v.original} → ${v.suggestion}`)
          };
        } catch (feedbackError) {
          console.error('Failed to generate feedback:', feedbackError);
        }
      }

      // Upload audio if provided
      let audioUrl: string | undefined;
      if (audioBlob && user) {
        try {
          const fileName = `${user.id}/versant_${Date.now()}.webm`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('voice-recordings')
            .upload(fileName, audioBlob, {
              contentType: 'audio/webm'
            });

          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('voice-recordings')
              .getPublicUrl(fileName);
            audioUrl = publicUrl;
          }
        } catch (uploadError) {
          console.error('Failed to upload audio:', uploadError);
        }
      }

      // Create answer object
      const answer: VersantAnswer = {
        id: crypto.randomUUID(),
        questionId,
        part: currentQuestion.part,
        question: currentQuestion,
        transcribedText,
        audioUrl,
        feedback,
        createdAt: new Date().toISOString()
      };

      // Save to database if user is logged in
      if (user) {
        try {
          await supabase
            .from('versant_answers')
            .insert({
              id: answer.id,
              user_id: user.id,
              question_id: questionId,
              part: currentQuestion.part,
              transcribed_text: transcribedText,
              audio_url: audioUrl,
              feedback: feedback,
              created_at: answer.createdAt
            });
        } catch (dbError) {
          console.error('Failed to save to database:', dbError);
          // Continue anyway - answer is still in memory
        }
      }

      // Update local state
      set(state => ({
        answers: [answer, ...state.answers],
        loading: false,
        isPracticing: false
      }));

      return answer;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchHistory: async () => {
    set({ loading: true });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ answers: [], loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('versant_answers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const answers: VersantAnswer[] = (data || []).map(row => ({
        id: row.id,
        questionId: row.question_id,
        part: row.part as 'E' | 'F',
        question: {
          id: row.question_id,
          part: row.part as 'E' | 'F',
          text: '', // Will need to be fetched from questions
          timeLimit: row.part === 'E' ? 30 : 40
        },
        transcribedText: row.transcribed_text,
        audioUrl: row.audio_url,
        feedback: row.feedback as VersantFeedback | undefined,
        createdAt: row.created_at
      }));

      set({ answers, loading: false });
    } catch (error) {
      console.error('Failed to fetch history:', error);
      set({ loading: false });
    }
  },

  clearCurrentSession: () => {
    set({
      currentQuestion: null,
      isPracticing: false,
      isRecording: false,
      timeRemaining: 0
    });
  }
}));

// Helper function to generate sample answers
function generateSampleAnswer(question: VersantQuestion): string {
  if (question.part === 'E') {
    return 'The passage discusses key points about the topic. The main idea is... and it mentions that... In conclusion...';
  }

  // Part F sample answers based on category
  const sampleAnswers: Record<string, string> = {
    'Work': 'In my opinion, this is an important topic in today\'s workplace. I believe that... because... For example, in my experience...',
    'Technology': 'Technology has both advantages and disadvantages. On one hand... On the other hand... Personally, I think...',
    'Education': 'Education plays a crucial role in our society. I think that... This is because... Furthermore...',
    'Lifestyle': 'This is something many people think about. My preference is... because... Additionally...',
    'default': 'This is an interesting question. In my view... The reason I think this is... To conclude...'
  };

  return sampleAnswers[question.category || ''] || sampleAnswers.default;
}
