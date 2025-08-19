// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export class VoiceTranscriber {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private finalTranscript: string = '';
  private onResultCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      
      // 設定
      this.recognition.continuous = true;  // 継続的に音声を認識
      this.recognition.interimResults = true;  // 途中結果も取得
      this.recognition.lang = 'ja-JP';  // 日本語
      this.recognition.maxAlternatives = 1;

      // イベントハンドラ
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            this.finalTranscript += transcript + ' ';
            if (this.onResultCallback) {
              this.onResultCallback(this.finalTranscript, true);
            }
          } else {
            interimTranscript += transcript;
            if (this.onResultCallback) {
              this.onResultCallback(this.finalTranscript + interimTranscript, false);
            }
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('音声認識エラー:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('音声認識終了');
      };

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('音声認識開始');
      };
    }
  }

  // 音声認識を開始
  start(onResult?: (text: string, isFinal: boolean) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      console.error('音声認識がサポートされていません');
      if (onError) onError('音声認識がサポートされていません');
      return;
    }

    this.finalTranscript = '';
    this.onResultCallback = onResult || null;
    this.onErrorCallback = onError || null;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('音声認識の開始に失敗:', error);
      if (onError) onError('音声認識の開始に失敗しました');
    }
  }

  // 音声認識を停止
  stop(): string {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    return this.finalTranscript.trim();
  }

  // 音声認識をキャンセル
  abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
    this.finalTranscript = '';
  }

  // 音声認識がサポートされているかチェック
  static isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  // リスニング中かどうか
  getIsListening(): boolean {
    return this.isListening;
  }

  // 現在のテキストを取得
  getCurrentTranscript(): string {
    return this.finalTranscript.trim();
  }
}