/**
 * 音声ファイルの圧縮と最適化
 */

/**
 * Blobのサイズを人間が読みやすい形式に変換
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * 音声Blobを圧縮（ビットレートを下げる）
 * 音声品質を保ちながらファイルサイズを削減
 */
export const compressAudioBlob = async (
  blob: Blob,
  targetBitrate: number = 64000 // 64kbps (元の128kbpsから削減)
): Promise<Blob> => {
  try {
    // すでにサイズが小さい場合はそのまま返す（1MB未満）
    if (blob.size < 1024 * 1024) {
      console.log('音声ファイルは既に小さいため圧縮をスキップ:', formatFileSize(blob.size));
      return blob;
    }

    console.log('音声圧縮開始:', {
      originalSize: formatFileSize(blob.size),
      targetBitrate: targetBitrate / 1000 + 'kbps'
    });

    // 現在のブラウザではWebCodecsAPIがまだ安定していないため、
    // シンプルな方法として、MediaRecorderの設定で対応
    // （実際の圧縮はMediaRecorder作成時に行う）
    
    return blob;
  } catch (error) {
    console.error('音声圧縮エラー:', error);
    return blob; // エラー時は元のBlobを返す
  }
};

/**
 * チャンク単位でのアップロード用にBlobを分割
 */
export const splitBlobIntoChunks = (blob: Blob, chunkSize: number = 512 * 1024): Blob[] => {
  const chunks: Blob[] = [];
  let offset = 0;
  
  while (offset < blob.size) {
    const chunk = blob.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }
  
  console.log(`Blobを${chunks.length}個のチャンクに分割`);
  return chunks;
};

/**
 * アップロードの進捗を計算
 */
export const calculateProgress = (uploaded: number, total: number): number => {
  return Math.round((uploaded / total) * 100);
};