import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { analyzeText, generateFamilySummary, analyzeHealthScore } from '../lib/gemini';
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
    const startTime = performance.now();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ entries: [], loading: false });
        return;
      }

      // 並列でクエリを実行
      const [relationshipsResult, initialDiariesResult] = await Promise.all([
        // 家族関係を取得
        supabase
          .from('family_relationships')
          .select('parent_id, child_id')
          .or(`parent_id.eq.${user.id},child_id.eq.${user.id}`)
          .eq('status', 'accepted'),
        
        // まず自分の日記だけを取得（高速表示用）
        supabase
          .from('diaries')
          .select(`
            *,
            user:users(*),
            comments:comments(*, user:users(*))
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // 自分の日記を即座に表示
      if (initialDiariesResult.data) {
        set({ entries: initialDiariesResult.data });
      }

      // 家族のIDリストを作成
      const familyIds = new Set([user.id]);
      relationshipsResult.data?.forEach(rel => {
        familyIds.add(rel.parent_id);
        familyIds.add(rel.child_id);
      });

      // 家族が他にいる場合のみ、追加で取得
      if (familyIds.size > 1) {
        const { data, error } = await supabase
          .from('diaries')
          .select(`
            *,
            user:users(*),
            comments:comments(*, user:users(*))
          `)
          .in('user_id', Array.from(familyIds))
          .order('created_at', { ascending: false })
          .limit(50); // 最新50件に制限

        if (!error && data) {
          set({ entries: data });
        }
      }
      
      const endTime = performance.now();
      console.log(`日記取得時間: ${Math.round(endTime - startTime)}ms`);
      
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      set({ loading: false });
    }
  },

  createEntry: async (content: string, audioBlob?: Blob) => {
    try {
      console.log('createEntry start:', { contentLength: content.length, hasAudio: !!audioBlob });
      
      let voiceUrl = null;
      let transcribedContent = content;
      let analysisResult = null;
      
      // Get user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        throw new Error('Not authenticated');
      }
      console.log('User authenticated:', user.id);
      
      // If we have audio, upload it (but don't transcribe)
      if (audioBlob) {
        try {
          const fileName = `${user.id}/voice_${Date.now()}.webm`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('voice-recordings')
            .upload(fileName, audioBlob, {
              contentType: 'audio/webm',
              upsert: false
            });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('voice-recordings')
              .getPublicUrl(fileName);
            voiceUrl = publicUrl;
          } else {
            console.warn('音声アップロードをスキップしました:', uploadError);
          }
        } catch (storageError) {
          console.warn('音声アップロードをスキップしました:', storageError);
        }
      }

      // Analyze text content if provided
      if (content && content.trim()) {
        try {
          if (import.meta.env.VITE_GEMINI_API_KEY) {
            analysisResult = await analyzeText(content);
          }
        } catch (analysisError) {
          console.warn('テキスト分析をスキップしました:', analysisError);
        }
      }

      // Generate AI summary and health score
      let aiSummary = '';
      let healthScore = 75;
      
      try {
        if (transcribedContent && import.meta.env.VITE_GEMINI_API_KEY) {
          aiSummary = await generateFamilySummary(transcribedContent);
          healthScore = await analyzeHealthScore(transcribedContent);
        }
      } catch (aiError) {
        console.warn('AI分析をスキップしました:', aiError);
      }

      console.log('Inserting diary entry...');
      const { data: insertedData, error } = await supabase
        .from('diaries')
        .insert({
          user_id: user.id,
          title: transcribedContent.substring(0, 50),
          content: transcribedContent,
          voice_url: voiceUrl,
          duration: audioBlob ? Math.round(audioBlob.size / 1000) : null,
          emotion: analysisResult?.emotion || '普通',
          health_score: healthScore,
          ai_summary: aiSummary || analysisResult?.summary || '',
          ai_keywords: analysisResult?.keywords || [],
          tags: [],
          visibility: 'family'
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      console.log('Diary saved successfully:', insertedData);

      // Refresh entries
      await get().fetchEntries();
      
      return insertedData;
    } catch (error: any) {
      console.error('Failed to create entry:', error);
      
      // より詳細なエラー情報を提供
      if (error.message) {
        throw new Error(`日記の保存に失敗しました: ${error.message}`);
      }
      throw new Error('日記の保存に失敗しました。ネットワーク接続を確認してください。');
    }
  },

  deleteEntry: async (id: string) => {
    try {
      const { error } = await supabase
        .from('diaries')
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