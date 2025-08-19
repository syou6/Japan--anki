import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useDiaryStore } from '../../stores/diaryStore';
import { VoiceTranscriber } from '../../lib/speechRecognition';
import { Mic, MicOff, Play, Pause, Save, X, Trash2, Home } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceRecorderProps {
  onViewChange?: (view: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onViewChange }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [additionalText, setAdditionalText] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const transcriberRef = useRef<VoiceTranscriber | null>(null);

  const {
    isRecording,
    currentAudio,
    startRecording,
    stopRecording,
    clearRecording,
    createEntry
  } = useDiaryStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (currentAudio && !isRecording) {
      const url = URL.createObjectURL(currentAudio);
      const audio = new Audio(url);
      setAudioElement(audio);

      audio.onended = () => setIsPlaying(false);

      return () => {
        URL.revokeObjectURL(url);
        setAudioElement(null);
      };
    }
  }, [currentAudio, isRecording]);

  const handleStartRecording = async () => {
    try {
      // 音声録音を開始
      await startRecording();
      
      // 音声認識も開始
      if (VoiceTranscriber.isSupported()) {
        console.log('音声認識サポート: あり');
        transcriberRef.current = new VoiceTranscriber();
        setIsTranscribing(true);
        transcriberRef.current.start(
          (text, isFinal) => {
            setTranscribedText(text);
            console.log('認識中:', text, 'Final:', isFinal);
          },
          (error) => {
            console.error('音声認識エラー:', error);
            setIsTranscribing(false);
            // エラーをユーザーに通知
            if (error === 'not-allowed') {
              toast.error('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。');
            }
          }
        );
      } else {
        console.log('音声認識サポート: なし');
        toast.warning('お使いのブラウザは音声認識に対応していません');
      }
      
      toast.success('録音を開始しました');
    } catch (error) {
      toast.error('録音の開始に失敗しました');
    }
  };

  const handleStopRecording = async () => {
    try {
      // 録音を停止
      await stopRecording();
      
      // 音声認識を停止して最終テキストを取得
      if (transcriberRef.current) {
        const finalText = transcriberRef.current.stop();
        setTranscribedText(finalText);
        setIsTranscribing(false);
        console.log('最終認識結果:', finalText);
      }
      
      toast.success('録音を停止しました');
      setShowSaveDialog(true);
    } catch (error) {
      toast.error('録音の停止に失敗しました');
    }
  };

  const handlePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSave = async () => {
    if (!currentAudio) {
      toast.error('録音データがありません');
      return;
    }

    if (isSaving) {
      return; // 既に保存処理中の場合は何もしない
    }

    setIsSaving(true);
    
    try {
      // 音声認識されたテキストと追加メモを結合
      let contentToSave = '';
      
      if (transcribedText.trim()) {
        contentToSave = transcribedText.trim();
        if (additionalText.trim()) {
          contentToSave += '\n\n【追加メモ】\n' + additionalText.trim();
        }
      } else if (additionalText.trim()) {
        contentToSave = additionalText.trim();
      } else {
        contentToSave = '音声日記（テキスト認識できませんでした）';
      }
      
      console.log('保存開始:', { 
        transcribedLength: transcribedText.length,
        additionalLength: additionalText.length,
        contentLength: contentToSave.length, 
        audioSize: currentAudio.size 
      });
      
      // 保存処理中のトーストを表示
      const loadingToast = toast.loading('日記を保存中です...');
      
      await createEntry(contentToSave, currentAudio);
      
      // 成功トーストに切り替え
      toast.dismiss(loadingToast);
      toast.success('日記を保存しました！');
      
      clearRecording();
      setShowSaveDialog(false);
      setAdditionalText('');
      setTranscribedText('');
      
      // ホーム画面に戻る
      if (onViewChange) {
        setTimeout(() => {
          onViewChange('home');
        }, 1000);
      }
    } catch (error) {
      console.error('保存エラー:', error);
      toast.error('保存に失敗しました: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    clearRecording();
    setShowSaveDialog(false);
    setAdditionalText('');
    setTranscribedText('');
    if (transcriberRef.current) {
      transcriberRef.current.abort();
    }
    toast.success('録音を削除しました');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Header with Instructions */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            音声日記を録音
          </h2>
          {!isRecording && !currentAudio && (
            <p className="text-xl text-gray-600">
              下のマイクボタンを押して、今日の出来事をお話しください
            </p>
          )}
        </div>

        <div className="text-center">
          {/* Recording Status */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-8"
              >
                <div className="bg-red-50 rounded-2xl p-8 mb-6">
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <Mic className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <div className="text-red-600 text-3xl font-bold mb-2">
                    録音中...
                  </div>
                  <div className="text-4xl font-bold text-gray-800">
                    {formatTime(recordingTime)}
                  </div>
                  
                  {/* リアルタイム音声認識表示 */}
                  {isTranscribing && transcribedText && (
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">認識中のテキスト:</p>
                      <p className="text-base text-gray-700">{transcribedText}</p>
                    </div>
                  )}
                  
                  <p className="text-lg text-gray-600 mt-4">
                    お話が終わったら、下の「録音を止める」ボタンを押してください
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recording Button */}
          {!currentAudio && (
            <div className="mb-6 sm:mb-8">
              {isRecording ? (
                <Button
                  onClick={handleStopRecording}
                  variant="secondary"
                  size="xl"
                  className="w-full sm:w-64 h-24 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                >
                  <MicOff className="w-10 h-10" />
                  <span className="text-2xl font-bold ml-3">録音を止める</span>
                </Button>
              ) : (
                <div className="space-y-6">
                  <motion.button
                    onClick={handleStartRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-xl flex flex-col items-center justify-center gap-3"
                  >
                    <Mic className="w-20 h-20 sm:w-24 sm:h-24" />
                    <span className="text-2xl sm:text-3xl font-bold">録音開始</span>
                  </motion.button>
                  <p className="text-lg text-gray-500">
                    マイクボタンを押すと録音が始まります
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Playback Controls */}
          {currentAudio && !showSaveDialog && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-green-50 rounded-2xl p-8 mb-6">
                <div className="text-3xl font-bold text-green-600 mb-4">
                  ✓ 録音が完了しました！
                </div>
                <p className="text-xl text-gray-700 mb-6">
                  録音した内容を確認してから保存してください
                </p>
                
                <div className="space-y-4">
                  {/* 再生ボタン */}
                  <Button
                    onClick={handlePlayPause}
                    variant="outline"
                    size="xl"
                    className="w-full sm:w-80 h-20 text-xl border-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-8 h-8 mr-3" />
                        <span className="font-bold">一時停止</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-8 h-8 mr-3" />
                        <span className="font-bold">録音を聞く</span>
                      </>
                    )}
                  </Button>

                  {/* 保存ボタン */}
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    variant="primary"
                    size="xl"
                    className="w-full sm:w-80 h-20 text-xl bg-green-500 hover:bg-green-600"
                  >
                    <Save className="w-8 h-8 mr-3" />
                    <span className="font-bold">日記を保存する</span>
                  </Button>

                  {/* やり直しボタン */}
                  <Button
                    onClick={handleDiscard}
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-80 text-lg text-gray-600"
                  >
                    <Trash2 className="w-6 h-6 mr-2" />
                    録音をやり直す
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Save Dialog */}
        <AnimatePresence>
          {showSaveDialog && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  日記の保存
                </h3>
                
                {/* 音声認識されたテキスト */}
                {transcribedText && (
                  <div className="mb-6 p-4 bg-white rounded-xl">
                    <label className="block text-lg font-bold text-gray-700 mb-2">
                      音声から認識されたテキスト
                    </label>
                    <p className="text-base text-gray-700 whitespace-pre-wrap">
                      {transcribedText}
                    </p>
                  </div>
                )}
                
                <div className="mb-8">
                  <label className="block text-xl font-bold text-gray-700 mb-3">
                    追加メモを入力できます（省略可）
                  </label>
                  <textarea
                    value={additionalText}
                    onChange={(e) => setAdditionalText(e.target.value)}
                    placeholder="例：今日は孫と公園に行きました..."
                    className="w-full px-5 py-4 text-xl border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleSave}
                    variant="primary"
                    size="xl"
                    className="w-full h-20 text-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 mr-3"
                        >
                          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
                        </motion.div>
                        <span className="font-bold">保存中...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-8 h-8 mr-3" />
                        <span className="font-bold">保存する</span>
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setShowSaveDialog(false)}
                    variant="outline"
                    size="lg"
                    className="w-full h-16 text-lg"
                    disabled={isSaving}
                  >
                    <X className="w-6 h-6 mr-2" />
                    戻る
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};