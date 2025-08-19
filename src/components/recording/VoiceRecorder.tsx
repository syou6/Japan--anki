import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useDiaryStore } from '../../stores/diaryStore';
import { Mic, MicOff, Play, Pause, Save, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const VoiceRecorder: React.FC = () => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [additionalText, setAdditionalText] = useState('');

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
      await startRecording();
      toast.success('録音を開始しました');
    } catch (error) {
      toast.error('録音の開始に失敗しました');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
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
    if (!currentAudio) return;

    try {
      await createEntry(additionalText, currentAudio);
      toast.success('日記を保存しました！');
      clearRecording();
      setShowSaveDialog(false);
      setAdditionalText('');
    } catch (error) {
      toast.error('保存に失敗しました');
    }
  };

  const handleDiscard = () => {
    clearRecording();
    setShowSaveDialog(false);
    setAdditionalText('');
    toast.success('録音を削除しました');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          音声日記を録音
        </h2>

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
                <div className="text-red-600 text-2xl font-bold mb-4">
                  録音中... {formatTime(recordingTime)}
                </div>
                <div className="flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-8 h-8 bg-red-500 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recording Button */}
          {!currentAudio && (
            <div className="mb-8">
              <Button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                variant={isRecording ? "secondary" : "primary"}
                size="xl"
                className="w-48 h-48 rounded-full"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-16 h-16" />
                    停止
                  </>
                ) : (
                  <>
                    <Mic className="w-16 h-16" />
                    録音開始
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Playback Controls */}
          {currentAudio && !showSaveDialog && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 space-y-6"
            >
              <div className="text-xl text-gray-700">
                録音が完了しました
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handlePlayPause}
                  variant="outline"
                  size="lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-6 h-6" />
                      停止
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6" />
                      再生
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowSaveDialog(true)}
                  variant="primary"
                  size="lg"
                >
                  <Save className="w-6 h-6" />
                  保存
                </Button>

                <Button
                  onClick={handleDiscard}
                  variant="outline"
                  size="lg"
                >
                  <Trash2 className="w-6 h-6" />
                  削除
                </Button>
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
              className="mt-8 p-6 border-2 border-dashed border-blue-300 rounded-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                日記を保存
              </h3>
              
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  追加メモ（オプション）
                </label>
                <textarea
                  value={additionalText}
                  onChange={(e) => setAdditionalText(e.target.value)}
                  placeholder="録音した内容について、追加でメモがあれば書いてください..."
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleSave}
                  variant="primary"
                  size="lg"
                >
                  <Save className="w-6 h-6" />
                  保存する
                </Button>

                <Button
                  onClick={() => setShowSaveDialog(false)}
                  variant="outline"
                  size="lg"
                >
                  <X className="w-6 h-6" />
                  キャンセル
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};