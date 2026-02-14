// English text constants for Japanese AI Diary

export const EN = {
  // App name
  app: {
    name: 'Japanese AI Diary',
    tagline: 'Speak Japanese Every Day',
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
    practiceDesc: 'JLPT',
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
    instruction: 'Press the microphone button and speak in Japanese about your day',
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
    notesPlaceholder: 'e.g., Today I went to the park with my friend...',
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
    cefrLevel: 'Japanese Level (CEFR)',
    cefrDescription: 'AI feedback will be based on this level',
    notifications: 'Notifications',
    notificationSettings: 'Notification Settings',
    language: 'Language',
    account: 'Account',
    logout: 'Logout',
    apiUsage: 'AI Usage Statistics',
  },

  // CEFR levels (10 stages) with JLPT mapping
  cefr: {
    'A1': '入門 — ひらがな・カタカナ、基本的な挨拶（N5相当）',
    'A1+': '入門上 — 簡単な自己紹介、基本的な助詞',
    'A2': '初級 — 日常会話、基本漢字（N4相当）',
    'A2+': '初級上 — 身近な場面での会話、て形の活用',
    'B1': '中級 — 一般的な話題、複文（N3相当）',
    'B1+': '中級上 — 意見表明、敬語の基礎',
    'B2': '中上級 — 抽象的な話題、フォーマルな文章（N2相当）',
    'B2+': '中上級上 — ニュアンスのある議論、ニュース理解',
    'C1': '上級 — 複雑な文章、自然な表現（N1相当）',
    'C1+': '熟達 — ネイティブに近い流暢さ、専門分野の議論',
  },

  // Feedback
  feedback: {
    title: 'AI Feedback',
    loading: 'Analyzing your Japanese...',
    grammar: 'Grammar & Particles',
    vocabulary: 'Vocabulary & Kanji',
    pronunciation: 'Pronunciation & Pitch Accent',
    reading: 'Recommended Reading',
    summary: 'English Summary',
    keyVocab: 'Key Vocabulary',
  },

  // Speaking Practice (JLPT-style)
  versant: {
    title: 'Speaking Practice',
    partE: {
      title: 'Part E: Summary',
      description: 'Listen to a short Japanese passage and summarize it in 30 seconds.',
      descriptionJa: 'Listen to a passage in Japanese and summarize the main points.',
    },
    partF: {
      title: 'Part F: Opinion',
      description: 'Answer a question in Japanese with your opinion in about 40 seconds.',
      descriptionJa: 'Listen to a question and give your opinion in Japanese.',
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
    familyDiary: 'Student Diary',
    familyDiaryDesc: 'Get notified when your student posts a diary',
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
    step4: 'Open "Japanese AI Diary" from home screen',
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

  // Teacher Sharing
  family: {
    title: 'Teacher Connection',
    addRecipient: 'Invite Your Japanese Teacher',
    addDescription: 'Enter your teacher\'s email address to share your diary for feedback',
    addButton: 'Invite',
    yourViewers: 'Your Teacher',
    youCanView: 'Students You Teach',
    remove: 'Remove',
    removeConfirm: 'Are you sure you want to disconnect from this teacher?',
    removed: 'Teacher removed',
    noSharing: 'No teacher connected yet. Invite your teacher to get feedback!',
    noViewers: 'No students connected yet',
    userNotFound: 'Teacher not found. Please check the email address.',
    cannotAddSelf: 'Cannot add yourself',
    alreadyShared: 'Already connected',
    shareSuccess: 'Now connected with',
    addError: 'Failed to connect',
    user: 'User',
  },

  // Subscription
  subscription: {
    title: 'サブスクリプション管理',
    subtitle: 'プランと利用状況',
    currentPlan: '現在のプラン',
    active: '有効',
    freePlan: '無料プラン',
    nextRenewal: '次回更新日',
    cancelScheduled: '期間終了時にキャンセル予定',
    manage: 'サブスクリプションを管理',
    processing: '処理中...',
    popular: '人気',
    perMonth: '/月',
    perYear: '/年',
    selectPlan: 'プランを選択',
    startFree: '無料で始める',
    usage: '利用状況',
    recordings: '今月の録音数',
    savedDiaries: '保存済み日記',
    sharedMembers: '共有メンバー数',
    error: {
      loadStatus: 'サブスクリプション情報の取得に失敗しました',
      checkout: 'チェックアウトの開始に失敗しました',
      portal: '管理ポータルを開けませんでした',
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
    recordPrompt: 'Record your Japanese diary',
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
    familyComments: "Teacher's Comments",
    familyMessages: "Teacher's Messages",
    noMessages: 'No messages from your teacher yet',
    sharePrompt: 'Connect with your teacher to get feedback',
    viewAllComments: 'View All Diaries & Comments',
  },
  // Onboarding/Welcome
  onboarding: {
    steps: [
      {
        title: 'Practice Japanese Every Day',
        description: 'Record a short diary in Japanese each day. Just 1-3 minutes of speaking practice helps you improve naturally.',
        benefit: 'Build a daily Japanese habit'
      },
      {
        title: 'Just Speak - No Typing Required',
        description: 'Press record and speak about your day in Japanese. The app transcribes your speech automatically.',
        benefit: 'Perfect for busy learners'
      },
      {
        title: 'Get AI Feedback',
        description: 'Receive personalized feedback on your grammar, vocabulary, and pronunciation from AI.',
        benefit: 'Learn from your mistakes'
      },
      {
        title: 'Track Your Progress',
        description: 'Review past entries, see your CEFR level progress, and practice with JLPT-style questions.',
        benefit: 'Measure your improvement'
      }
    ],
    previous: 'Previous',
    next: 'Next',
    start: 'Get Started',
    skip: 'Skip',
  },

  // Help
  help: {
    title: 'Help',
    subtitle: 'How to use guide',
    home: {
      title: 'Home Screen',
      description: 'Record and view your diary entries',
      tips: [
        'Press the large record button to start recording',
        'Scroll down to see your recent diary entries',
        'Tap a diary entry to see details and AI feedback'
      ]
    },
    recording: {
      title: 'Recording Screen',
      description: 'Record your voice diary in Japanese',
      tips: [
        'Press the record button to start',
        'Speak in Japanese for 1-3 minutes',
        'The volume meter shows if your voice is clear',
        'Review and save your recording when done'
      ]
    },
    diary: {
      title: 'Diary List',
      description: 'View your past diary entries',
      tips: [
        'Tap a diary to see full details',
        'Press play to listen to your recording',
        'View AI feedback for grammar and vocabulary'
      ]
    },
    settings: {
      title: 'Settings',
      description: 'Configure your preferences',
      tips: [
        'Set your Japanese level (CEFR / JLPT)',
        'Manage notifications',
        'View your account details'
      ]
    },
    faq: {
      title: 'FAQ',
      q1: "Recording doesn't work?",
      q2: 'How to connect with my teacher?',
      q3: 'How to recover deleted diary?',
    },
    support: {
      title: "Need more help?",
      description: 'Contact our support team',
      button: 'Contact Support',
    },
  },

  // PWA Install
  pwa: {
    useAsApp: 'Use as App',
    install: 'Install App',
    installDescription: 'Add Japanese AI Diary to your home screen for the best experience. You\'ll also receive push notifications.',
    iosInstructions: 'Add to home screen to enable push notifications',
    step1: 'Tap the share button below',
    step2: 'Select "Add to Home Screen"',
    step3: 'Tap "Add" at the top right',
    installButton: 'Install',
    later: 'Later',
  },

  // Pricing
  pricing: {
    popular: '一番人気',
    currentPlan: '現在のプラン',
    freePlan: '無料プラン',
    processing: '処理中...',
    startNow: '今すぐ始める',
    managePlan: 'プランを管理',
    loginRequired: 'ログインしてください',
    notAvailable: 'このプランは現在利用できません',
    error: 'エラーが発生しました。もう一度お試しください。',
  },

  // Dialog defaults
  dialog: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    processing: 'Processing...',
    confirmation: 'Confirmation',
    areYouSure: 'Are you sure?',
    execute: 'OK',
    close: 'Close',
    showMore: 'Show more',
  },

  // Elderly mode (simplified navigation)
  elderly: {
    nav: {
      home: 'Home',
      homeDesc: 'Main',
      record: 'Record',
      recordDesc: 'Speak',
      listen: 'Listen',
      listenDesc: 'Playback',
    },
    guestMode: 'Guest Mode (Trial)',
    diaryList: 'Diary List',
    noDiaries: 'No diaries yet',
    pleaseRecord: 'Please record',
    loading: 'Loading...',
    stop: 'Stop',
    play: 'Play',
    delete: 'Delete',
    deleteConfirm: 'Delete this diary?',
    deleteButton: 'Delete',
    cancelButton: 'Cancel',
    deleteMessage: 'Are you sure you want to delete this diary?',
    deleted: 'Diary deleted',
    deleteFailed: 'Failed to delete',
    shared: 'Shared',
    copyFailed: 'Failed to copy',
    copiedToClipboard: 'Copied to clipboard',
    playFailed: 'Failed to play audio',
  },

  // Subscription pages
  subscriptionPage: {
    back: '戻る',
    selectPlan: 'プランを選ぶ',
    chooseDescription: 'あなたに合ったプランを選択してください',
    campaign: '期間限定キャンペーン',
    campaignDesc: 'プレミアムを30日間無料でお試し！',
    securePayment: '安全なお支払い',
    instantUpgrade: '即時アップグレード',
    faq: 'よくある質問',
    faqCancelQ: 'いつでもキャンセルできますか？',
    faqCancelA: 'はい、いつでもキャンセル可能です。請求期間の終了までサービスをご利用いただけます。',
    faqPaymentQ: 'どの決済方法が使えますか？',
    faqPaymentA: 'Visa、Mastercard、American Express、JCBのクレジットカードに対応しています。',
    faqChangeQ: 'プランの変更はできますか？',
    faqChangeA: 'はい、いつでもアップグレード・ダウングレード可能です。料金は日割りで計算されます。',
    sslEncrypted: 'SSL暗号化',
    poweredBy: 'Powered by',
  },

  // Subscription success/cancel
  subscriptionResult: {
    successTitle: 'サブスクリプション開始！',
    successMessage: 'ご登録ありがとうございます。プレミアム機能をご利用いただけます。',
    startApp: 'アプリを開始',
    manageSubscription: 'サブスクリプションを管理',
    premiumActivated: 'プレミアム機能が有効になりました。無制限の日記作成、AI分析・フィードバック、共有機能をご利用いただけます。',
    cancelTitle: 'サブスクリプションをキャンセルしました',
    cancelMessage: 'サブスクリプションがキャンセルされました。いつでも再登録できます。',
    backToApp: 'アプリに戻る',
    reviewPlans: 'プランを確認',
    freeFeatures: '無料プランの基本機能は引き続きご利用いただけます。日記作成には制限があります。',
  },
} as const;

export type TranslationKey = keyof typeof EN;
