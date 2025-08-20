import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,

  signUp: async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || '',
            role: 'parent' // デフォルトでparentに設定
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name || '',
            role: 'parent'
          });

        if (profileError) {
          console.warn('プロファイル作成エラー（自動作成されます）:', profileError);
        }
      }
    } catch (error) {
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      console.log('ログイン試行:', { email, url: window.location.origin });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('ログインエラー詳細:', {
          error,
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('メールアドレスが確認されていません。メールを確認してください。');
        }
        throw new Error(`ログインに失敗しました: ${error.message}`);
      }

      // ログイン成功後、ユーザープロファイルが存在するか確認
      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profile) {
          // プロファイルがない場合は作成
          await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || '',
              role: 'parent'
            });
        }
      }
    } catch (error: any) {
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      console.log('Googleログイン開始:', {
        redirectTo: `${window.location.origin}/`,
        origin: window.location.origin
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Googleログインエラー詳細:', {
          error,
          message: error.message,
          code: error.code,
          details: error
        });
        
        if (error.message?.includes('provider is not enabled')) {
          throw new Error('Google認証が有効化されていません。管理者に連絡してください。');
        }
        throw new Error(`Googleログインに失敗しました: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Googleログインエラー:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      console.log('ログアウト処理開始');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('ログアウトエラー:', error);
        throw error;
      }
      
      // ローカルステートをクリア
      set({ user: null });
      
      // ページをリロードして完全にクリーンな状態にする
      window.location.href = '/';
      
      console.log('ログアウト完了');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      // エラーが発生してもログアウト処理を続行
      set({ user: null });
      window.location.href = '/';
    }
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && userProfile) {
          set({ user: userProfile, loading: false });
        } else {
          // ユーザープロファイルが存在しない場合は作成
          const newUserProfile = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || '',
            role: session.user.user_metadata?.role || 'parent',
          };
          
          const { data: createdProfile } = await supabase
            .from('users')
            .insert(newUserProfile)
            .select()
            .single();
          
          set({ user: createdProfile || newUserProfile, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && userProfile) {
            set({ user: userProfile });
          } else {
            // ユーザープロファイルが存在しない場合は作成
            const newUserProfile = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || '',
              role: session.user.user_metadata?.role || 'parent',
            };
            
            const { data: createdProfile } = await supabase
              .from('users')
              .insert(newUserProfile)
              .select()
              .single();
            
            set({ user: createdProfile || newUserProfile });
          }
        } else {
          set({ user: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },
}));