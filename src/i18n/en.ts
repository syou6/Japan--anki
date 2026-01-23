// English text constants for English AI Diary

export const EN = {
  // App name
  app: {
    name: 'English AI Diary',
    tagline: 'Speak English Every Day',
  },

  // Navigation
  nav: {
    home: 'Home',
    record: 'Record',
    diary: 'Diary',
    practice: 'Practice',
    settings: 'Settings',
    family: 'Share',
    // Descriptions
    homeDesc: 'Dashboard',
    recordDesc: 'Speak',
    diaryDesc: 'History',
    practiceDesc: 'Versant',
    settingsDesc: 'Config',
    // Active indicator
    active: 'Active',
  },

  // Dashboard
  dashboard: {
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    },
    todayPrompt: "Let's record today's diary",
    recordButton: 'Start Recording',
    alreadyRecorded: 'Already recorded today',
    greatJob: 'Great job!',
    viewDiary: 'View Diary',
    practice: 'Practice Speaking',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    // Tips
    tips: {
      title: "Today's Tips",
      tip1: 'What did you eat today?',
      tip2: 'How are you feeling?',
      tip3: 'What made you happy?',
    },
  },

  // Recording
  recording: {
    title: 'Record Your Diary',
    instruction: 'Press the microphone button and speak in English about your day',
    recording: 'Recording...',
    stopButton: 'Stop Recording',
    startButton: 'Start Recording',
    pressToStart: 'Press the microphone to start recording',
    whenDone: 'When you\'re done speaking, press the "Stop Recording" button below',
    // After recording
    completed: 'Recording completed!',
    reviewAndSave: 'Review your recording and save it',
    play: 'Play Recording',
    pause: 'Pause',
    save: 'Save Diary',
    discard: 'Re-record',
    // Save dialog
    saveTitle: 'Save Your Diary',
    transcribedText: 'Transcribed Text',
    additionalNotes: 'Additional Notes (Optional)',
    notesPlaceholder: 'e.g., I went to the park with my friend today...',
    saving: 'Saving...',
    saveButton: 'Save',
    back: 'Back',
    // Transcription
    transcribing: 'Transcribing:',
    noTranscription: 'Voice diary (could not transcribe)',
    additionalNotesLabel: 'Additional Notes',
    // Messages
    startSuccess: 'Recording started',
    stopSuccess: 'Recording stopped',
    saveSuccess: 'Diary saved!',
    saveError: 'Failed to save',
    discardSuccess: 'Recording discarded',
    guestLimit: 'Guest limit reached. Please login.',
    guestTimeLimit: 'Guest mode is limited to 30 seconds',
    micPermissionDenied: 'Microphone access denied. Please check your browser settings.',
    notSupported: 'Your browser does not support voice recognition',
    saveTimeout: 'Save timed out. Please try again.',
    noRecordingData: 'No recording data',
  },

  // Diary list
  diary: {
    title: 'My Diary',
    empty: 'No diary entries yet',
    startFirst: 'Record your first diary!',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this diary?',
    play: 'Play',
    pause: 'Pause',
  },

  // Auth
  auth: {
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginWithGoogle: 'Continue with Google',
    or: 'or',
  },

  // Guest mode
  guest: {
    banner: 'Guest Mode',
    limit: 'entries remaining',
    tryMode: 'Trial Mode',
    loginPrompt: 'Login to save your diaries',
  },

  // Settings
  settings: {
    title: 'Settings',
    cefrLevel: 'English Level (CEFR)',
    cefrDescription: 'AI feedback will be based on this level',
    notifications: 'Notifications',
    notificationSettings: 'Notification Settings',
    language: 'Language',
    account: 'Account',
    logout: 'Logout',
  },

  // CEFR levels
  cefr: {
    A1: 'A1 - Beginner',
    A2: 'A2 - Elementary',
    B1: 'B1 - Intermediate',
    B2: 'B2 - Upper Intermediate',
    C1: 'C1 - Advanced',
    C2: 'C2 - Proficient',
  },

  // Feedback
  feedback: {
    title: 'AI Feedback',
    loading: 'Analyzing your English...',
    grammar: 'Grammar & Phrasing',
    vocabulary: 'Vocabulary',
    pronunciation: 'Pronunciation Tips',
    reading: 'Recommended Reading',
    summary: 'Summary (Japanese)',
    keyVocab: 'Key Vocabulary',
  },

  // Versant Practice
  versant: {
    title: 'Speaking Practice',
    partE: {
      title: 'Part E: Summary',
      description: 'Listen to a short passage and summarize it in 30 seconds.',
      descriptionJa: '短い文章を聞いて30秒以内で要約します。',
    },
    partF: {
      title: 'Part F: Opinion',
      description: 'Answer a question with your opinion in about 40 seconds.',
      descriptionJa: '質問に対して40秒程度で自分の意見を述べます。',
    },
    start: 'Start Practice',
    history: 'Practice History',
    playQuestion: 'Play Question',
    playing: 'Playing...',
    timeLimit: 'Time limit',
    seconds: 'seconds',
    yourAnswer: 'Your Answer',
    sampleAnswer: 'Sample Answer',
    result: 'Your Result',
    advice: 'Advice',
    nextLevel: 'To reach the next level',
    tryAgain: 'Try Again',
    nextQuestion: 'Next Question',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
  },

  // Errors
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    auth: 'Authentication failed. Please login again.',
  },
} as const;

export type TranslationKey = keyof typeof EN;
