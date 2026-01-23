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

  // User
  user: {
    guest: 'Guest',
    user: 'User',
    admin: 'Admin',
    trialMode: 'Trial Mode',
  },

  // Header
  header: {
    voiceJournal: 'Voice Journal',
    logout: 'Logout',
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

  // Guest mode messages
  guestMode: {
    banner: 'Guest Mode',
    remaining: 'tries remaining',
    loginPrompt: 'Login to save all features',
    createAccount: 'Create Free Account',
    login: 'Login',
    loginSignup: 'Login / Sign Up',
    limitReached: 'Guest limit reached',
    limitMessage: 'Create a free account to continue',
    noDiaries: 'No diary entries yet',
    startRecording: 'Record your first diary entry',
    autoDelete: 'This diary will be auto-deleted in 30 minutes',
    expiresIn: 'Expires in',
    minutes: 'minutes',
    expired: 'Expired',
    deleteConfirm: 'Are you sure you want to delete this diary?',
    deleted: 'Diary deleted',
    healthScore: 'Health Score',
    aiSummary: 'AI Summary',
    play: 'Play',
    stop: 'Stop',
    playAudio: 'Play Audio',
  },

  // Volume indicator
  volume: {
    level: 'Volume Level',
    startRecording: 'Press record to start',
    tooQuiet: 'Too quiet',
    tooLoud: 'Too loud',
    justRight: 'Perfect volume',
    low: 'Low',
    optimal: 'Optimal',
    high: 'High',
  },

  // Share
  share: {
    button: 'Share',
    copied: 'Link copied!',
    copyLink: 'Copy Link',
  },

  // Notifications
  notifications: {
    title: 'Notification Settings',
    premium: 'Premium Plan',
    premiumDesc: 'Get all features for $5/month',
    viewPlans: 'View Plans',
    on: 'Notifications On',
    off: 'Notifications Off',
    types: 'Notification Types',
    newComment: 'New Comments',
    newCommentDesc: 'Get notified when someone comments on your diary',
    familyDiary: 'Family Diary',
    familyDiaryDesc: 'Get notified when family posts a diary',
    dailyReminder: 'Daily Reminder',
    dailyReminderDesc: 'Get reminded to write your diary',
    reminderTime: 'Reminder Time',
    testNotification: 'Send Test Notification',
    testSent: 'Test notification sent',
    enablePrompt: 'Enable push notifications to receive updates in real-time',
    iosInstruction: 'To enable notifications on iPhone, add this app to your home screen',
    howToAdd: 'How to add:',
    step1: 'Tap the share button at the bottom of Safari',
    step2: 'Select "Add to Home Screen"',
    step3: 'Tap "Add" at the top right',
    step4: 'Open "English AI Diary" from home screen',
    iosNote: 'Requires iOS 16.4 or later',
    androidTip: 'For smartphone users',
    androidInstructions: 'Use Chrome/Edge browser, Menu → Add to Home Screen',
    enableButton: 'Enable Notifications',
    success: {
      on: 'Notifications enabled',
      off: 'Notifications disabled',
      updated: 'Settings updated',
    },
    error: {
      enable: 'Failed to enable notifications',
      disable: 'Failed to disable notifications',
      update: 'Failed to update settings',
    },
  },

  // Family/Sharing
  family: {
    title: 'Diary Sharing Settings',
    addRecipient: 'Add someone to share with',
    addDescription: 'Enter email address to share your diary',
    addButton: 'Add',
    yourViewers: 'People who can see your diary',
    youCanView: 'Diaries you can view',
    remove: 'Remove',
    removeConfirm: 'Are you sure you want to stop sharing?',
    removed: 'Sharing removed',
    noSharing: 'Not sharing with anyone yet',
    noViewers: 'No one is sharing with you yet',
    userNotFound: 'User not found',
    cannotAddSelf: 'Cannot add yourself',
    alreadyShared: 'Already sharing',
    shareSuccess: 'Now sharing with',
    addError: 'Failed to add',
    user: 'User',
  },

  // Subscription
  subscription: {
    title: 'Subscription Management',
    subtitle: 'Your plan and usage',
    currentPlan: 'Current Plan',
    active: 'Active',
    freePlan: 'Free Plan',
    nextRenewal: 'Next renewal',
    cancelScheduled: 'Scheduled to cancel at period end',
    manage: 'Manage Subscription',
    processing: 'Processing...',
    popular: 'Popular',
    perMonth: '/month',
    perYear: '/year',
    selectPlan: 'Select Plan',
    startFree: 'Start Free',
    usage: 'Usage',
    recordings: 'Recordings this month',
    savedDiaries: 'Saved diaries',
    sharedMembers: 'Shared members',
    error: {
      loadStatus: 'Failed to load subscription status',
      checkout: 'Failed to start checkout',
      portal: 'Failed to open management portal',
    },
  },

  // API Usage
  apiUsage: {
    guestMode: 'Guest Mode',
    usage: 'Gemini API Usage',
    simple: 'Simple',
    details: 'Details',
    aiUsage: 'AI Analysis Usage',
    times: 'times',
    status: 'Status',
    used: 'AI analysis used',
    available: 'AI analysis available',
    aiLimitGuest: 'AI analysis limited to 1 use. Please login to continue.',
    todayUsage: 'Today\'s usage',
    remaining: 'Remaining',
    estimatedTokens: 'Estimated tokens',
    estimatedCost: 'Estimated cost',
    limitReached: 'Daily limit reached. Please try again tomorrow.',
    nearLimit: 'Approaching usage limit.',
    resetUsage: 'Reset Usage (Dev)',
  },

  // Dashboard
  parentDashboard: {
    todayDate: 'Today is',
    weather: 'Sunny',
    recordPrompt: 'Record your English diary',
    recordSubPrompt: '1-3 minutes is perfect!',
    topicIdeas: 'Topic ideas:',
    topics: {
      food: 'What you ate today',
      feeling: 'How you\'re feeling',
      activities: 'What made you happy',
    },
    startRecording: 'Start Recording',
    viewDiaries: 'View Past Diaries',
    viewDiariesDesc: 'Review your diary history',
    viewDiaryButton: 'View Diary',
    todaySummary: 'Today\'s Summary',
    speakingScore: 'Speaking Score',
    todayMood: 'Today\'s Mood',
    familyComments: 'Family Comments',
    familyMessages: 'Family Messages',
    noMessages: 'No family messages yet',
    sharePrompt: 'Share your diary to connect with family',
    viewAllComments: 'View All Diaries & Comments',
  },
} as const;

export type TranslationKey = keyof typeof EN;
