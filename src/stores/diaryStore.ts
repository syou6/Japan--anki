import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { analyzeText, generateFamilySummary, analyzeHealthScore } from '../lib/gemini';
import { toast } from 'sonner';
import type { DiaryEntry } from '../types';

// ファイルサイズのフォーマット関数（インライン定義）
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

interface DiaryStore {
  entries: DiaryEntry[];
  loading: boolean;
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  currentAudio: Blob | null;
  
  fetchEntries: () => Promise<void>;
  createEntry: (content: string, audioBlob?: Blob) => Promise<any>;
  deleteEntry: (id: string) => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  clearRecording: () => void;
  notifyFamilyMembers: (authorId: string, authorName: string) => Promise<void>;
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

  createEntry: async (content: string, audioBlob?: Blob): Promise<any> => {
    try {
      console.log('createEntry start:', { contentLength: content.length, hasAudio: !!audioBlob });
      
      let voiceUrl = null;
      let transcribedContent = content;
      
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
          const audioSize = audioBlob.size;
          console.log('音声アップロード開始:', {
            size: formatFileSize(audioSize),
            type: audioBlob.type
          });
          
          // ファイルサイズ制限 (50MB)
          const MAX_FILE_SIZE = 50 * 1024 * 1024;
          if (audioSize > MAX_FILE_SIZE) {
            throw new Error(`ファイルサイズが大きすぎます (${formatFileSize(audioSize)})。50MB以下にしてください。`);
          }
          
          const uploadStartTime = performance.now();
          const fileName = `${user.id}/voice_${Date.now()}.webm`;
          
          // タイムアウト付きアップロード (30秒)
          const uploadPromise = supabase.storage
            .from('voice-recordings')
            .upload(fileName, audioBlob, {
              contentType: 'audio/webm',
              upsert: false
            });
            
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('アップロードがタイムアウトしました（30秒）')), 30000)
          );
          
          const { data: uploadData, error: uploadError } = await Promise.race([
            uploadPromise,
            timeoutPromise
          ]).catch(err => ({ data: null, error: err })) as any;

          const uploadEndTime = performance.now();
          const uploadTime = Math.round(uploadEndTime - uploadStartTime);
          console.log(`音声アップロード時間: ${uploadTime}ms`);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('voice-recordings')
              .getPublicUrl(fileName);
            voiceUrl = publicUrl;
            console.log('音声URL取得成功');
          } else {
            console.error('音声アップロードエラー:', uploadError);
            toast.error('音声のアップロードに失敗しました。日記は音声なしで保存されます。');
            // 音声なしでも日記は保存を続行
          }
        } catch (storageError: any) {
          console.error('音声アップロードエラー:', storageError);
          toast.error(storageError.message || '音声のアップロードに失敗しました');
          // 音声なしでも日記は保存を続行
        }
      }

      // 無料AI分析機能（APIコストゼロ）
      let analysisResult: any = null;
      let aiSummary = '';
      let healthScore = 75;
      
      // テキストコンテンツがある場合は無料分析を実行
      if (content && content.trim()) {
        try {
          analysisResult = await analyzeText(content);
          aiSummary = await generateFamilySummary(content);
          healthScore = await analyzeHealthScore(content);
        } catch (analysisError) {
          console.warn('無料分析エラー:', analysisError);
        }
      }

      console.log('Inserting diary entry...');
      const { data: insertedData, error } = await supabase
        .from('diaries')
        .insert({
          user_id: user.id,
          title: content.substring(0, 50),
          content: content,
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
      
      // 家族に通知を送信
      try {
        // ユーザー名を取得
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();
        
        if (userData?.name) {
          await get().notifyFamilyMembers(user.id, userData.name);
        }
      } catch (notifyError) {
        console.error('Failed to send notifications:', notifyError);
        // 通知エラーは無視して続行
      }
      
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
      // Soft delete - ゴミ箱に移動（deleted_atを設定）
      const { error } = await supabase
        .from('diaries')
        .update({ 
          deleted_at: new Date().toISOString(),
          delete_after: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30日後
        })
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
      // シンプルなオプションに戻す（互換性のため）
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // MediaRecorderのオプションを設定（ビットレート削減）
      let mediaRecorder: MediaRecorder;
      try {
        const options = {
          mimeType: 'audio/webm',
          audioBitsPerSecond: 64000 // 64kbps（互換性を考慮して少し上げる）
        };
        mediaRecorder = new MediaRecorder(stream, options);
        console.log('録音開始: ビットレート64kbps');
      } catch (e) {
        // フォールバック：デフォルト設定を使用
        console.warn('カスタム設定が使用できません。デフォルト設定を使用します。');
        mediaRecorder = new MediaRecorder(stream);
      }
      
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      // 通常の開始方法に戻す（安定性重視）
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
  },

  notifyFamilyMembers: async (authorId: string, authorName: string) => {
    try {
      // 家族関係を取得
      const { data: relationships } = await supabase
        .from('family_relationships')
        .select('parent_id, child_id')
        .or(`parent_id.eq.${authorId},child_id.eq.${authorId}`)
        .eq('status', 'accepted');

      if (!relationships || relationships.length === 0) {
        console.log('No family relationships found');
        return;
      }

      // 通知対象のユーザーIDを収集
      const familyUserIds = new Set<string>();
      relationships.forEach(rel => {
        if (rel.parent_id !== authorId) familyUserIds.add(rel.parent_id);
        if (rel.child_id !== authorId) familyUserIds.add(rel.child_id);
      });

      // 各家族メンバーに通知を送信
      for (const userId of familyUserIds) {
        try {
          // Edge Function経由でバックグラウンド通知を送信
          const response = await supabase.functions.invoke('send-push-notification', {
            body: {
              userId,
              title: '新しい日記が投稿されました',
              body: `${authorName}さんが日記を投稿しました`,
              type: 'family_diary',
              data: {
                url: 'https://journal-ai.cloud/diary'
              }
            }
          });

          if (response.error) {
            console.error(`Failed to send push notification to user ${userId}:`, response.error);
          } else {
            console.log(`Push notification sent to user ${userId}`);
          }

          // ブラウザが開いている場合はローカル通知も送信（フォールバック）
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_NOTIFICATION',
              title: '新しい日記が投稿されました',
              body: `${authorName}さんが日記を投稿しました`,
              data: {
                url: '/diary'
              }
            });
          }
        } catch (error) {
          console.error(`Failed to notify user ${userId}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to notify family members:', error);
    }
  }
}));