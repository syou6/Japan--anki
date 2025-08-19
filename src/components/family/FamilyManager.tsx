import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Users, UserPlus, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface FamilyMember {
  id: string;
  parent_id: string;
  child_id: string;
  status: 'accepted';
  parent?: any;
  child?: any;
  created_at: string;
}

export const FamilyManager: React.FC = () => {
  const { user } = useAuthStore();
  const [emailInput, setEmailInput] = useState('');
  const [sharedWith, setSharedWith] = useState<FamilyMember[]>([]);
  const [sharedFrom, setSharedFrom] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
    }
  }, [user]);

  const fetchFamilyMembers = async () => {
    if (!user) return;

    try {
      // 自分が共有している相手
      const { data: shared } = await supabase
        .from('family_relationships')
        .select(`
          *,
          child:child_id(id, name, email)
        `)
        .eq('parent_id', user.id)
        .eq('status', 'accepted');

      if (shared) {
        setSharedWith(shared);
      }

      // 自分に共有してくれている相手
      const { data: sharedToMe } = await supabase
        .from('family_relationships')
        .select(`
          *,
          parent:parent_id(id, name, email)
        `)
        .eq('child_id', user.id)
        .eq('status', 'accepted');

      if (sharedToMe) {
        setSharedFrom(sharedToMe);
      }
    } catch (error) {
      console.error('家族メンバー取得エラー:', error);
    }
  };

  const addFamilyMember = async () => {
    if (!user || !emailInput.trim()) return;

    setLoading(true);
    try {
      // メールアドレスからユーザーを検索
      const { data: targetUser } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', emailInput.trim())
        .single();

      if (!targetUser) {
        toast.error('ユーザーが見つかりません');
        return;
      }

      if (targetUser.id === user.id) {
        toast.error('自分自身は追加できません');
        return;
      }

      // 既存の関係をチェック
      const { data: existing } = await supabase
        .from('family_relationships')
        .select('id')
        .eq('parent_id', user.id)
        .eq('child_id', targetUser.id)
        .single();

      if (existing) {
        toast.error('既に共有済みです');
        return;
      }

      // 新しい関係を作成
      const { error } = await supabase
        .from('family_relationships')
        .insert({
          parent_id: user.id,
          child_id: targetUser.id,
          status: 'accepted'
        });

      if (!error) {
        toast.success(`${targetUser.name}さんに日記を共有しました`);
        setEmailInput('');
        fetchFamilyMembers();
      }
    } catch (error) {
      toast.error('追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const removeFamilyMember = async (relationshipId: string) => {
    if (!window.confirm('共有を解除してもよろしいですか？')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('family_relationships')
        .delete()
        .eq('id', relationshipId);

      if (!error) {
        toast.success('共有を解除しました');
        fetchFamilyMembers();
      }
    } catch (error) {
      toast.error('解除に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900">日記の共有設定</h2>
        </div>

        {/* 日記を共有する */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-xl">
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">
            <Eye className="inline w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            日記を見せる相手を追加
          </h3>
          <p className="text-sm sm:text-lg text-blue-800 mb-3 sm:mb-4">
            メールアドレスを入力して、あなたの日記を共有しましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="example@email.com"
              className="flex-1 p-3 sm:p-4 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={addFamilyMember}
              variant="primary"
              disabled={loading || !emailInput.includes('@')}
              className="w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">追加する</span>
            </Button>
          </div>
        </div>

        {/* 自分が共有している相手 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            <Eye className="inline w-5 h-5 mr-2" />
            あなたの日記を見れる人
          </h3>
          <div className="space-y-3">
            {sharedWith.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold">
                    {member.child?.name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {member.child?.name || 'ユーザー'}
                    </div>
                    <div className="text-gray-500">
                      {member.child?.email}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFamilyMember(member.id)}
                >
                  <X className="w-5 h-5 text-red-500" />
                  解除
                </Button>
              </div>
            ))}
            {sharedWith.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                まだ誰にも共有していません
              </div>
            )}
          </div>
        </div>

        {/* 自分に共有してくれている相手 */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            <EyeOff className="inline w-5 h-5 mr-2" />
            あなたが見れる人の日記
          </h3>
          <div className="space-y-3">
            {sharedFrom.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-green-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold">
                    {member.parent?.name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {member.parent?.name || 'ユーザー'}
                    </div>
                    <div className="text-gray-500">
                      {member.parent?.email}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  共有中
                </span>
              </div>
            ))}
            {sharedFrom.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                まだ誰もあなたに共有していません
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};