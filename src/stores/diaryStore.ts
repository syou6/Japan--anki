import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { geminiService } from '../lib/gemini';
import type { DiaryEntry } from '../types';

interface DiaryStore {
  entries: DiaryEntry[];
  loading: boolean;
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  currentAudio: Blob | null;
  
  fetchEntries: () => Promise<void>;
  createEntry: (content: string, audioBlob?: Blob) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  clearRecording: () => void;
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  entries: [],
  loading: false,
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
  currentAudio: null,

  fetchEntries: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select(`
          *,
          user:users(*),
          comments:comments(*, user:users(*))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ entries: data || [] });
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      set({ loading: false });
    }
  },

  createEntry: async (content: string, audioBlob?: Blob) => {
    try {
      let voiceUrl = null;
      let transcribedContent = content;
      
      // If we have audio, upload it and transcribe
      if (audioBlob) {
        const fileName = `voice_${Date.now()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('voice-recordings')
          .upload(fileName, audioBlob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('voice-recordings')
          .getPublicUrl(fileName);

        voiceUrl = publicUrl;

        // Transcribe the audio using Gemini
        if (!content.trim()) {
          transcribedContent = await geminiService.transcribeAudio(audioBlob);
        }
      }

      // Generate AI analysis
      const aiAnalysis = await geminiService.analyzeEmotion(transcribedContent);
      const aiSummary = await geminiService.generateSummary(transcribedContent);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: user.id,
          content: transcribedContent,
          voice_url: voiceUrl,
          duration: audioBlob ? Math.round(audioBlob.size / 1000) : null,
          emotion: aiAnalysis.emotion,
          health_score: aiAnalysis.healthScore,
          ai_summary: aiSummary,
          tags: [],
          visibility: 'family'
        });

      if (error) throw error;

      // Refresh entries
      get().fetchEntries();
    } catch (error) {
      console.error('Failed to create entry:', error);
      throw error;
    }
  },

  deleteEntry: async (id: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw error;
    }
  },

  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.start();
      set({ 
        mediaRecorder, 
        audioChunks, 
        isRecording: true 
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  },

  stopRecording: async () => {
    const { mediaRecorder, audioChunks } = get();
    
    return new Promise((resolve) => {
      if (!mediaRecorder) {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        set({ 
          currentAudio: audioBlob,
          isRecording: false,
          mediaRecorder: null
        });
        resolve(audioBlob);
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  },

  clearRecording: () => {
    set({
      currentAudio: null,
      audioChunks: [],
      isRecording: false,
      mediaRecorder: null
    });
  }
}));