// সীরাত.ব্লগ — Sample Data
// Realistic Bengali content for development

export const sampleTopics = [
  {
    id: '1',
    slug: 'sirat',
    name: 'সিরাত',
    nameEn: 'Sirat',
    category: 'historical',
    categoryName: 'ঐতিহাসিক সিরাত পর্ব',
    description: 'রাসূলুল্লাহ ﷺ-এর সামগ্রিক পুণ্যময় জীবনচরিত, সার্বজনীন নবুওয়াত ও ঐতিহাসিক জীবনধারা।',
    articleCount: 24,
    icon: '📖',
    gradient: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
    tags: ['নবুওয়াত', 'হিজরত', 'মদীনা রাষ্ট্র', 'বিদায় হজ'],
    authorIds: ['author-1', 'author-4'],
  },
  {
    id: '2',
    slug: 'akhlaq',
    name: 'আখলাক ও শামায়েল',
    nameEn: 'Akhlaq & Shamail',
    category: 'thematic',
    categoryName: 'শাস্ত্রীয় ও আত্মিক ক্ষেত্র',
    description: 'নবীজী ﷺ-এর মহান চরিত্র মাহাত্ম্য, খুলুকে আযীম, বিনম্রতা, ক্ষমা ও সৃষ্টির প্রতি অপার দয়ার অনুপম দৃষ্টান্ত।',
    articleCount: 18,
    icon: '🌿',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
    tags: ['খুলুকে আযীম', 'রহমত', 'আদর্শ পরিবার', 'বিনয়'],
    authorIds: ['author-2', 'author-1'],
  },
  {
    id: '3',
    slug: 'hadith',
    name: 'হাদিস ও সুন্নাহ',
    nameEn: 'Hadith & Sunnah',
    category: 'thematic',
    categoryName: 'শাস্ত্রীয় ও আত্মিক ক্ষেত্র',
    description: 'সহীহ সনদে বর্ণিত নববী বাণী, দৈনন্দিন সুন্নতের সৌন্দর্য ও হাদিস শাস্ত্রীয় তাহকিকমূলক বিশ্লেষণ।',
    articleCount: 31,
    icon: '📚',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
    tags: ['সহীহ হাদিস', 'সুন্নাহ চর্চা', 'তাহকিক', 'আমল'],
    authorIds: ['author-2', 'author-3'],
  },
  {
    id: '4',
    slug: 'makki-jiban',
    name: 'মক্কী জীবন ও দাওয়াত',
    nameEn: 'Makkan Period',
    category: 'historical',
    categoryName: 'ঐতিহাসিক সিরাত পর্ব',
    description: 'নবুওয়াত-পূর্ব জীবন, প্রথম ওহী লাভ, দারুল আরকামের পাঠশালা এবং মক্কার কঠিন প্রতিকূলতায় তাওহীদের দাওয়াত।',
    articleCount: 12,
    icon: '🕋',
    gradient: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
    tags: ['হেরা গুহা', 'প্রথম ওহী', 'দারুল আরকাম', 'তায়েফ গমন'],
    authorIds: ['author-1', 'author-4'],
  },
  {
    id: '5',
    slug: 'madani-jiban',
    name: 'মাদানী জীবন ও সমাজ বিনির্মাণ',
    nameEn: 'Madinan Period',
    category: 'historical',
    categoryName: 'ঐতিহাসিক সিরাত পর্ব',
    description: 'মদীনায় হিজরত, মসজিদে নববী নির্মাণ, মদীনাহ সনদ, ইসলামী সমাজ ও ইনসাফভিত্তিক রাষ্ট্র প্রতিষ্ঠা।',
    articleCount: 15,
    icon: '🌙',
    gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
    tags: ['মদীনাহ সনদ', 'মসজিদে নববী', 'মুওয়াখাত', 'বদর ও ওহুদ'],
    authorIds: ['author-1', 'author-4'],
  },
  {
    id: '6',
    slug: 'tafsir',
    name: 'তাফসির ও সিরাত-আয়াত',
    nameEn: 'Tafsir & Quran',
    category: 'thematic',
    categoryName: 'শাস্ত্রীয় ও আত্মিক ক্ষেত্র',
    description: 'পবিত্র কুরআনের যেসকল আয়াতে রাসূলুল্লাহ ﷺ-এর মর্যাদা, বৈশিষ্ট্য ও সিরাতের ঘটনা বিবৃত হয়েছে তার তাফসির।',
    articleCount: 9,
    icon: '📜',
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
    tags: ['সিরাত তাফসির', 'শানে নুযূল', 'কুরআনী চরিত্র'],
    authorIds: ['author-3', 'author-1'],
  },
  {
    id: '7',
    slug: 'dawah',
    name: 'দাওয়াহ ও প্রজ্ঞাপূর্ণ কৌশল',
    nameEn: 'Dawah & Wisdom',
    category: 'thematic',
    categoryName: 'শাস্ত্রীয় ও আত্মিক ক্ষেত্র',
    description: 'হিকমাহ ও সুন্দর উপদেশের মাধ্যমে সত্যের পয়গাম মানুষের অন্তরে পৌঁছে দেওয়ার নববী পদ্ধতি ও আধুনিক প্রাসঙ্গিকতা।',
    articleCount: 7,
    icon: '🤲',
    gradient: 'linear-gradient(135deg, #C026D3 0%, #DB2777 100%)',
    tags: ['হিকমাহ', 'দাওয়াত কৌশল', 'চরিত্রের মাধ্যমে দাওয়াহ'],
    authorIds: ['author-4', 'author-2'],
  },
  {
    id: '8',
    slug: 'islamic-history',
    name: 'ইসলামী ইতিহাস ও খিলাফত',
    nameEn: 'Islamic History',
    category: 'historical',
    categoryName: 'ঐতিহাসিক সিরাত পর্ব',
    description: 'সাহাবায়ে কেরামের গৌরবোজ্জ্বল জীবন, খুলাফায়ে রাশিদীনের যুগ ও মুসলিম উম্মাহর সোনালী ঐতিহ্য।',
    articleCount: 11,
    icon: '🏛️',
    gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
    tags: ['সাহাবা চরিত্র', 'খিলাফতে রাশেদা', 'ঐতিহাসিক প্রেক্ষাপট'],
    authorIds: ['author-1', 'author-3'],
  },
];

export const sampleAuthors = [
  {
    id: 'author-1',
    uid: 'author-1',
    displayName: 'ড. আবদুর রহমান',
    email: 'abdur@example.com',
    photoURL: null,
    bio: 'ঢাকা বিশ্ববিদ্যালয়ের ইসলামিক স্টাডিজ বিভাগের অধ্যাপক। সিরাত গবেষণায় দুই দশকের অভিজ্ঞতা। একাধিক গবেষণাগ্রন্থের রচয়িতা।',
    expertise: 'সিরাত গবেষণা, ইসলামী ইতিহাস',
    role: 'writer',
    isVerified: true,
    writerStatus: 'approved',
    joinedAt: { seconds: 1700000000 },
    articleCount: 24,
  },
  {
    id: 'author-2',
    uid: 'author-2',
    displayName: 'উস্তাযা ফাতিমা খান',
    email: 'fatima@example.com',
    photoURL: null,
    bio: 'আল-আযহার বিশ্ববিদ্যালয় থেকে হাদিস শাস্ত্রে মাস্টার্স। বর্তমানে স্বতন্ত্র গবেষক ও লেখক। নবীজী ﷺ-এর আখলাক বিষয়ে বিশেষ আগ্রহ।',
    expertise: 'হাদিস শাস্ত্র, নববী আখলাক',
    role: 'writer',
    isVerified: false,
    writerStatus: 'under_review',
    joinedAt: { seconds: 1705000000 },
    articleCount: 18,
  },
  {
    id: 'author-3',
    uid: 'author-3',
    displayName: 'মুহাম্মাদ ইবরাহীম',
    email: 'ibrahim@example.com',
    photoURL: null,
    bio: 'তরুণ ইসলামী গবেষক ও লেখক। মদীনা ইসলামী বিশ্ববিদ্যালয়ের শিক্ষার্থী। তাফসির ও সিরাত বিষয়ে নিয়মিত লেখালেখি করেন।',
    expertise: 'তাফসির, সিরাত',
    role: 'writer',
    isVerified: false,
    writerStatus: 'unverified',
    joinedAt: { seconds: 1710000000 },
    articleCount: 12,
  },
  {
    id: 'author-4',
    uid: 'author-4',
    displayName: 'শায়খ আহমাদ আলী',
    email: 'ahmad@example.com',
    photoURL: null,
    bio: 'ইসলামী শিক্ষাবিদ ও দাঈ। তিন দশকেরও বেশি সময় ধরে ইসলামী শিক্ষা ও দাওয়াহর কাজে নিয়োজিত। বিভিন্ন আন্তর্জাতিক সম্মেলনে বক্তা।',
    expertise: 'দাওয়াহ, ইসলামী শিক্ষা',
    role: 'writer',
    isVerified: true,
    writerStatus: 'approved',
    joinedAt: { seconds: 1695000000 },
    articleCount: 15,
  },
];

export const sampleArticles = [
  {
    id: 'quiz-post-1',
    slug: 'seerah-quiz-badr-year',
    title: 'সিরাত কুইজ: বদর যুদ্ধ কোন হিজরিতে সংঘটিত হয়েছিল?',
    excerpt: 'ঐতিহাসিক বদর প্রান্তরে ইসলামের প্রথম মহাসংগ্রাম কোন হিজরিতে সংঘটিত হয়?',
    quizData: {
      question: 'ঐতিহাসিক বদর প্রান্তরে ইসলামের প্রথম মহাসংগ্রাম কোন হিজরি সনের কত তারিখে সংঘটিত হয়?',
      options: [
        { id: 'opt_1', text: '২য় হিজরির ১৭ই রমজান' },
        { id: 'opt_2', text: '১ম হিজরির ১০ই মুহররম' },
        { id: 'opt_3', text: '৩য় হিজরির ৫ই শাওয়াল' },
        { id: 'opt_4', text: '৪র্থ হিজরির পহেলা জিলহজ' },
      ],
      correctOptionId: 'opt_1',
      explanation: '২য় হিজরির ১৭ই রমজান শুক্রবার ঐতিহাসিক বদর প্রান্তর যুদ্ধ সংঘটিত হয়, যেখানে ৩১৩ জন সাহাবি ৩ গুণ বড় কুরাইশ বাহিনীর বিরুদ্ধে বিজয় লাভ করেন।',
    },
    sources: ['সহীহ বুখারী: ৩৯৫১', 'আর-রাহীকুল মাখতূম, পৃ. ১৮৫'],
    authorId: 'author-1',
    authorName: 'ড. আবদুর রহমান',
    topicSlug: 'madani-life',
    topicName: 'মাদানী বিপ্লব',
    status: 'published',
    readingTime: 1,
    jazakallahCount: 245,
    salawatCount: 180,
    publishedAt: { seconds: Math.floor(Date.now() / 1000) - 1800 },
  },
  {
    id: 'quote-post-1',
    slug: 'quote-prophet-mercy',
    title: 'সিরাত উদ্ধৃতি ও অনুভূতি',
    excerpt: 'আমি অভিশাপদাতা হিসেবে প্রেরিত হইনি, বরং বিশ্ববাসীর জন্য রহমতস্বরূপ প্রেরিত হয়েছি।',
    quoteData: {
      text: 'রাসূলুল্লাহ ﷺ বলেছেন: "নিশ্চয়ই আমি অভিশাপদাতা হিসেবে প্রেরিত হইনি, বরং আমি তো প্রেরিত হয়েছি বিশ্বজগতের জন্য কেবলই পরম রহমতস্বরূপ।"',
      reference: 'সহীহ মুসলিম: ২৫৯৯',
      bgId: 'bg-emerald',
      gradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)',
      textColor: '#FFFFFF',
    },
    sources: ['সহীহ মুসলিম: হাদিস ২৫৯৯'],
    authorId: 'author-4',
    authorName: 'শায়খ আহমাদ আলী',
    topicSlug: 'akhlaq',
    topicName: 'আখলাক ও চরিত্র',
    status: 'published',
    readingTime: 1,
    jazakallahCount: 312,
    salawatCount: 240,
    publishedAt: { seconds: Math.floor(Date.now() / 1000) - 3600 },
  },
  {
    id: 'article-1',
    slug: 'rasulullah-er-khulq-azim',
    title: 'রাসূলুল্লাহ ﷺ-এর খুলুকে আযীম: চরিত্র মাহাত্ম্যের অনন্য দৃষ্টান্ত',
    subtitle: 'কুরআনে বর্ণিত "خُلُقٍ عَظِيمٍ"-এর গভীর তাৎপর্য ও আমাদের জীবনে এর প্রতিফলন',
    content: `<p>আল্লাহ তাআলা পবিত্র কুরআনে রাসূলুল্লাহ ﷺ সম্পর্কে বলেছেন:</p>
<div class="arabic-block">وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ</div>
<p>"এবং নিশ্চয়ই আপনি মহান চরিত্রের উপর অধিষ্ঠিত।" (সূরা আল-কলম, আয়াত ৪)</p>
<p>এই আয়াতে আল্লাহ সুবহানাহু ওয়া তাআলা স্বয়ং তাঁর প্রিয় হাবীব ﷺ-এর চরিত্রের সাক্ষ্য দিয়েছেন। এটি কেবল একটি প্রশংসা নয়, বরং এটি একটি ঐশী সনদ — যা মানব ইতিহাসে অন্য কোনো ব্যক্তির জন্য দেওয়া হয়নি।</p>
<h2>খুলুকে আযীমের তাৎপর্য</h2>
<p>"খুলুক" (خُلُق) শব্দটি আরবি ভাষায় চরিত্র, স্বভাব ও আচরণের সামগ্রিক রূপকে বোঝায়। আর "আযীম" (عَظِيم) অর্থ মহান, বিশাল, অতুলনীয়। সুতরাং "খুলুকিন আযীম" অর্থ এমন এক চরিত্র যা সকল মানবীয় গুণের শীর্ষে, যা পূর্ণতার চূড়ান্ত পর্যায়ে পৌঁছেছে।</p>
<p>ইমাম ইবনে কাসীর রহিমাহুল্লাহ তাঁর তাফসীরে উল্লেখ করেছেন যে, উম্মুল মু'মিনীন আয়িশা রাদিয়াল্লাহু আনহাকে রাসূলুল্লাহ ﷺ-এর চরিত্র সম্পর্কে জিজ্ঞাসা করা হলে তিনি বলেন:</p>
<blockquote>তাঁর চরিত্র ছিল কুরআন। তোমরা কি কুরআন পড়ো না? আল্লাহ তাআলা বলেছেন: "এবং নিশ্চয়ই আপনি মহান চরিত্রের উপর অধিষ্ঠিত।"</blockquote>
<h2>দৈনন্দিন জীবনে প্রতিফলন</h2>
<p>রাসূলুল্লাহ ﷺ-এর চরিত্র কেবল তত্ত্বগত আলোচনার বিষয় নয়। এটি আমাদের প্রতিদিনের জীবনে অনুসরণযোগ্য একটি পূর্ণাঙ্গ মডেল। তিনি ছিলেন সবচেয়ে সত্যবাদী, সবচেয়ে আমানতদার, সবচেয়ে দয়ালু এবং সবচেয়ে ন্যায়পরায়ণ মানুষ।</p>
<p>তাঁর চরিত্রের একটি অনন্য বৈশিষ্ট্য ছিল — তিনি কখনো ব্যক্তিগত কারণে কারো উপর রাগ করতেন না, কিন্তু আল্লাহর হুকুম লঙ্ঘিত হলে তিনি দৃঢ়ভাবে প্রতিবাদ করতেন।</p>
<h2>উপসংহার</h2>
<p>রাসূলুল্লাহ ﷺ-এর চরিত্র অধ্যয়ন করা শুধু জ্ঞান অর্জন নয়, বরং আত্মশুদ্ধি ও আত্মগঠনের অন্যতম মাধ্যম। তাঁর চরিত্র থেকে শিক্ষা নিয়ে নিজেদের জীবনে তা বাস্তবায়ন করাই হবে তাঁর প্রতি সত্যিকার ভালোবাসার প্রকাশ।</p>`,
    excerpt: 'কুরআনে বর্ণিত "خُلُقٍ عَظِيمٍ"-এর গভীর তাৎপর্য ও আমাদের দৈনন্দিন জীবনে রাসূলুল্লাহ ﷺ-এর চরিত্রের প্রতিফলন নিয়ে একটি বিস্তারিত আলোচনা।',
    coverImageURL: null,
    authorId: 'author-1',
    authorName: 'ড. আবদুর রহমান',
    topicSlug: 'akhlaq',
    topicName: 'আখলাক',
    status: 'published',
    featured: true,
    readingTime: 8,
    jazakallahCount: 142,
    salawatCount: 89,
    publishedAt: { seconds: 1724200000 },
    createdAt: { seconds: 1724100000 },
    updatedAt: { seconds: 1724200000 },
    references: [
      'তাফসীর ইবনে কাসীর, সূরা আল-কলম-এর তাফসীর',
      'সহীহ মুসলিম, হাদিস নং ৭৪৬',
      'আর-রাহীকুল মাখতূম, শফিউর রহমান মুবারকপুরী',
    ],
  },
  {
    id: 'article-2',
    slug: 'makkar-poth-theke-madinay',
    title: 'মক্কার পথ থেকে মদীনায়: হিজরতের অমর যাত্রা',
    subtitle: 'ইসলামের ইতিহাসে সবচেয়ে গুরুত্বপূর্ণ যাত্রার বিস্তারিত বিবরণ',
    content: `<p>হিজরত ইসলামের ইতিহাসে একটি যুগান্তকারী ঘটনা। এটি শুধু একটি ভৌগোলিক স্থানান্তর ছিল না, বরং এটি ছিল একটি সভ্যতার জন্মের সূচনা।</p>
<h2>হিজরতের প্রেক্ষাপট</h2>
<p>মক্কায় তেরো বছর দাওয়াতের পর যখন কুরাইশদের অত্যাচার চরম পর্যায়ে পৌঁছায়, তখন আল্লাহ তাআলা তাঁর রাসূল ﷺ-কে মদীনায় হিজরতের অনুমতি দেন। এর আগে মুসলমানরা দুইবার আবিসিনিয়ায় হিজরত করেছিলেন।</p>
<h2>হিজরতের রাত</h2>
<p>কুরাইশরা যখন রাসূলুল্লাহ ﷺ-কে হত্যার ষড়যন্ত্র করে, তখন আল্লাহ তাআলা তাঁকে এই ষড়যন্ত্র সম্পর্কে অবহিত করেন। সেই রাতে তিনি আলী রাদিয়াল্লাহু আনহুকে নিজের বিছানায় রেখে আবু বকর রাদিয়াল্লাহু আনহুকে সঙ্গে নিয়ে বের হন।</p>
<blockquote>আল্লাহ তাআলা বলেন: "যখন কাফিররা তোমার বিরুদ্ধে ষড়যন্ত্র করেছিল — তোমাকে বন্দী করতে, হত্যা করতে কিংবা নির্বাসিত করতে। তারা ষড়যন্ত্র করে আর আল্লাহও কৌশল করেন। আর আল্লাহ হলেন সর্বোত্তম কৌশলী।" (সূরা আল-আনফাল: ৩০)</blockquote>
<h2>সওর গুহায় আশ্রয়</h2>
<p>রাসূলুল্লাহ ﷺ এবং আবু বকর সিদ্দীক রাদিয়াল্লাহু আনহু মক্কার দক্ষিণে সওর পাহাড়ের গুহায় তিন রাত আশ্রয় নেন। এই সময়ে আবু বকরের ছেলে আবদুল্লাহ রাতে তাঁদের কাছে সংবাদ পৌঁছাতেন, আর তাঁর কন্যা আসমা খাবার নিয়ে আসতেন।</p>
<h2>মদীনায় আগমন</h2>
<p>দীর্ঘ যাত্রা শেষে রাসূলুল্লাহ ﷺ মদীনায় পৌঁছান। মদীনাবাসী তাঁকে অভূতপূর্ব আনন্দ ও উৎসাহের সাথে বরণ করে নেন। শিশুরা গান গেয়ে তাঁকে স্বাগত জানায়।</p>
<p>এভাবে শুরু হয় ইসলামী সভ্যতার এক নতুন অধ্যায়।</p>`,
    excerpt: 'ইসলামের ইতিহাসে সবচেয়ে গুরুত্বপূর্ণ যাত্রা — মক্কা থেকে মদীনায় হিজরতের বিস্তারিত বিবরণ, প্রেক্ষাপট এবং তাৎপর্য।',
    coverImageURL: null,
    authorId: 'author-1',
    authorName: 'ড. আবদুর রহমান',
    topicSlug: 'sirat',
    topicName: 'সিরাত',
    status: 'published',
    featured: false,
    readingTime: 12,
    jazakallahCount: 98,
    salawatCount: 67,
    publishedAt: { seconds: 1723900000 },
    createdAt: { seconds: 1723800000 },
    updatedAt: { seconds: 1723900000 },
    references: [
      'আর-রাহীকুল মাখতূম, শফিউর রহমান মুবারকপুরী',
      'সীরাতে ইবনে হিশাম',
      'সহীহ বুখারী, হিজরত অধ্যায়',
    ],
  },
  {
    id: 'article-3',
    slug: 'nobiji-er-dayar-drishtanto',
    title: 'নবীজী ﷺ-এর দয়ার দৃষ্টান্ত: রাহমাতুল লিল আলামীন',
    subtitle: 'সৃষ্টিকুলের প্রতি রাসূলুল্লাহ ﷺ-এর অসীম করুণার নির্বাচিত ঘটনাবলী',
    content: `<p>আল্লাহ তাআলা তাঁর প্রিয় রাসূল ﷺ সম্পর্কে বলেছেন:</p>
<div class="arabic-block">وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ</div>
<p>"আমি আপনাকে সমগ্র সৃষ্টিকুলের জন্য রহমত হিসেবেই প্রেরণ করেছি।" (সূরা আল-আম্বিয়া: ১০৭)</p>
<p>রাসূলুল্লাহ ﷺ-এর দয়া শুধু মুসলমানদের জন্য সীমাবদ্ধ ছিল না। তাঁর দয়া ছিল সার্বজনীন — মানুষ, প্রাণী, এমনকি গাছপালার প্রতিও।</p>
<h2>শিশুদের প্রতি দয়া</h2>
<p>রাসূলুল্লাহ ﷺ শিশুদের অত্যন্ত ভালোবাসতেন। তিনি নামাজে দাঁড়ানো অবস্থায়ও তাঁর নাতনী উমামাকে কোলে তুলে নিতেন। তিনি বলতেন: "যে ছোটদের স্নেহ করে না এবং বড়দের সম্মান করে না, সে আমাদের দলভুক্ত নয়।"</p>
<h2>শত্রুদের প্রতি দয়া</h2>
<p>তায়েফের ঘটনা রাসূলুল্লাহ ﷺ-এর দয়ার সবচেয়ে মর্মস্পর্শী দৃষ্টান্তগুলোর একটি। যখন তায়েফবাসী তাঁকে পাথর মেরে রক্তাক্ত করে, তখন আল্লাহ পাহাড়ের ফেরেশতাকে পাঠান। ফেরেশতা বলেন, আপনি চাইলে আমি এই দুই পাহাড় একত্র করে তায়েফবাসীকে ধ্বংস করে দিতে পারি। কিন্তু রাসূলুল্লাহ ﷺ বলেন:</p>
<blockquote>"না, আমি আশা করি আল্লাহ তাদের বংশধরদের মধ্য থেকে এমন মানুষ বের করবেন যারা একমাত্র আল্লাহর ইবাদত করবে।"</blockquote>
<h2>প্রাণীদের প্রতি দয়া</h2>
<p>রাসূলুল্লাহ ﷺ প্রাণীদের প্রতি দয়ার শিক্ষা দিয়েছেন। তিনি বলেছেন যে একটি মহিলা একটি বিড়ালকে বেঁধে রেখে না খাইয়ে মৃত্যু ঘটানোর কারণে জাহান্নামে প্রবেশ করবে, আর একজন পাপী ব্যক্তি একটি তৃষ্ণার্ত কুকুরকে পানি খাওয়ানোর কারণে ক্ষমা পাবে।</p>`,
    excerpt: 'সৃষ্টিকুলের প্রতি রাসূলুল্লাহ ﷺ-এর অসীম করুণা ও দয়ার নির্বাচিত ঘটনাবলী — শিশু, শত্রু এবং প্রাণীদের প্রতি।',
    coverImageURL: null,
    authorId: 'author-2',
    authorName: 'উস্তাযা ফাতিমা খান',
    topicSlug: 'akhlaq',
    topicName: 'আখলাক',
    status: 'published',
    featured: false,
    readingTime: 10,
    jazakallahCount: 215,
    salawatCount: 156,
    publishedAt: { seconds: 1723600000 },
    createdAt: { seconds: 1723500000 },
    updatedAt: { seconds: 1723600000 },
    references: [
      'সহীহ বুখারী, আদব অধ্যায়',
      'সহীহ মুসলিম, ফাযায়িল অধ্যায়',
    ],
  },
  {
    id: 'article-4',
    slug: 'hadither-aloke-nobi-poribarer-jibon',
    title: 'হাদিসের আলোকে নবী-পরিবারের জীবন',
    subtitle: 'রাসূলুল্লাহ ﷺ-এর পারিবারিক জীবনের সৌন্দর্য ও শিক্ষা',
    content: `<p>রাসূলুল্লাহ ﷺ শুধু একজন নবী ও রাষ্ট্রনায়ক ছিলেন না, তিনি ছিলেন একজন আদর্শ স্বামী, একজন স্নেহময় পিতা এবং একজন দায়িত্বশীল পরিবারপ্রধান। তাঁর পারিবারিক জীবনের প্রতিটি অংশে রয়েছে আমাদের জন্য অমূল্য শিক্ষা।</p>
<h2>স্ত্রীদের সাথে আচরণ</h2>
<p>রাসূলুল্লাহ ﷺ বলেছেন: "তোমাদের মধ্যে সবচেয়ে ভালো সেই ব্যক্তি যে তার পরিবারের কাছে সবচেয়ে ভালো। আর আমি আমার পরিবারের কাছে তোমাদের মধ্যে সবচেয়ে ভালো।"</p>
<p>তিনি ঘরের কাজে সাহায্য করতেন, নিজের জুতা নিজে সেলাই করতেন, ঘর ঝাড়ু দিতেন এবং নিজের কাপড় ধুতেন। এটি প্রমাণ করে যে ঘরের কাজ করা পুরুষের মর্যাদা কমায় না, বরং বাড়ায়।</p>
<h2>সন্তানদের সাথে আচরণ</h2>
<p>ফাতিমা রাদিয়াল্লাহু আনহা ঘরে এলে রাসূলুল্লাহ ﷺ দাঁড়িয়ে তাঁকে অভ্যর্থনা জানাতেন, তাঁর কপালে চুমু দিতেন এবং নিজের আসনে বসাতেন। এটি ছিল তাঁর সন্তানদের প্রতি ভালোবাসার একটি সুন্দর প্রকাশ।</p>`,
    excerpt: 'রাসূলুল্লাহ ﷺ-এর পারিবারিক জীবনের সৌন্দর্য — একজন আদর্শ স্বামী ও স্নেহময় পিতা হিসেবে তাঁর অনুপম দৃষ্টান্ত।',
    coverImageURL: null,
    authorId: 'author-2',
    authorName: 'উস্তাযা ফাতিমা খান',
    topicSlug: 'hadith',
    topicName: 'হাদিস',
    status: 'published',
    featured: false,
    readingTime: 7,
    jazakallahCount: 176,
    salawatCount: 120,
    publishedAt: { seconds: 1723300000 },
    createdAt: { seconds: 1723200000 },
    updatedAt: { seconds: 1723300000 },
    references: [
      'সুনানে তিরমিযী, হাদিস নং ৩৮৯৫',
      'সহীহ বুখারী, আদব অধ্যায়',
    ],
  },
  {
    id: 'article-5',
    slug: 'madinar-sonod-itihasher-prothom-sonbidhan',
    title: 'মদীনার সনদ: ইতিহাসের প্রথম সংবিধান',
    subtitle: 'রাসূলুল্লাহ ﷺ প্রণীত মদীনা সনদের ঐতিহাসিক গুরুত্ব ও সমকালীন প্রাসঙ্গিকতা',
    content: `<p>মদীনায় হিজরতের পর রাসূলুল্লাহ ﷺ যে প্রথম ও সবচেয়ে গুরুত্বপূর্ণ কাজটি করেছিলেন তা হলো মদীনা সনদ প্রণয়ন। এটিকে অনেক গবেষক পৃথিবীর প্রথম লিখিত সংবিধান হিসেবে বিবেচনা করেন।</p>
<h2>সনদের প্রেক্ষাপট</h2>
<p>মদীনায় তখন আউস ও খাযরাজ — দুটি আরব গোত্র এবং কয়েকটি ইহুদি গোত্র বসবাস করত। তাদের মধ্যে দীর্ঘদিনের বিরোধ ও সংঘাত চলমান ছিল। রাসূলুল্লাহ ﷺ এই বৈচিত্র্যময় সমাজকে একটি সুশৃঙ্খল রাষ্ট্রকাঠামোর অধীনে আনার জন্য এই সনদ প্রণয়ন করেন।</p>
<h2>সনদের মূল বৈশিষ্ট্য</h2>
<p>মদীনা সনদে মোট ৪৭টি ধারা ছিল যেখানে নাগরিক অধিকার, ধর্মীয় স্বাধীনতা, সামাজিক দায়বদ্ধতা এবং সামরিক সহযোগিতার বিষয়গুলো অন্তর্ভুক্ত ছিল।</p>
<h2>সমকালীন প্রাসঙ্গিকতা</h2>
<p>মদীনা সনদ আজকের বহু-সাংস্কৃতিক সমাজের জন্যও একটি অনুসরণযোগ্য মডেল। এটি প্রমাণ করে যে ইসলাম বৈচিত্র্যকে সম্মান করে এবং সহাবস্থানের নীতিতে বিশ্বাস করে।</p>`,
    excerpt: 'মদীনায় হিজরতের পর রাসূলুল্লাহ ﷺ প্রণীত মদীনা সনদ — পৃথিবীর প্রথম লিখিত সংবিধানের ইতিহাস ও প্রাসঙ্গিকতা।',
    coverImageURL: null,
    authorId: 'author-3',
    authorName: 'মুহাম্মাদ ইবরাহীম',
    topicSlug: 'madani-jiban',
    topicName: 'মাদানী জীবন',
    status: 'published',
    featured: false,
    readingTime: 9,
    jazakallahCount: 88,
    salawatCount: 54,
    publishedAt: { seconds: 1723000000 },
    createdAt: { seconds: 1722900000 },
    updatedAt: { seconds: 1723000000 },
    references: [
      'সীরাতে ইবনে হিশাম',
      'আল-ওয়াসায়িকুস সিয়াসিয়্যাহ, ড. মুহাম্মাদ হামিদুল্লাহ',
    ],
  },
  {
    id: 'article-6',
    slug: 'dawah-er-potho-nobiji-er-hikmat',
    title: 'দাওয়াহর পথে নবীজী ﷺ-এর হিকমাহ',
    subtitle: 'ইসলাম প্রচারে রাসূলুল্লাহ ﷺ-এর অনুসৃত প্রজ্ঞাপূর্ণ কৌশলসমূহ',
    content: `<p>রাসূলুল্লাহ ﷺ ছিলেন সর্বকালের সর্বশ্রেষ্ঠ দাঈ ইলাল্লাহ। তাঁর দাওয়াতের পদ্ধতি ছিল প্রজ্ঞাপূর্ণ, হৃদয়গ্রাহী এবং অত্যন্ত কার্যকর।</p>
<h2>হিকমাহর সাথে দাওয়াহ</h2>
<p>আল্লাহ তাআলা বলেন: "তুমি মানুষকে তোমার রবের পথে আহ্বান করো হিকমাহ ও সুন্দর উপদেশের মাধ্যমে।" (সূরা আন-নাহল: ১২৫)</p>
<p>রাসূলুল্লাহ ﷺ প্রত্যেক মানুষের সাথে তার বোধগম্যতা ও পরিস্থিতি অনুযায়ী কথা বলতেন। তিনি কখনো কারো বিশ্বাসকে অপমান করতেন না, বরং সুন্দরভাবে সত্যের দিকে আহ্বান জানাতেন।</p>`,
    excerpt: 'ইসলাম প্রচারে রাসূলুল্লাহ ﷺ কীভাবে হিকমাহ ও প্রজ্ঞার সাথে মানুষকে আহ্বান করতেন — তার শিক্ষণীয় দৃষ্টান্তসমূহ।',
    coverImageURL: null,
    authorId: 'author-4',
    authorName: 'শায়খ আহমাদ আলী',
    topicSlug: 'dawah',
    topicName: 'দাওয়াহ',
    status: 'published',
    featured: false,
    readingTime: 6,
    jazakallahCount: 64,
    salawatCount: 42,
    publishedAt: { seconds: 1722700000 },
    createdAt: { seconds: 1722600000 },
    updatedAt: { seconds: 1722700000 },
    references: ['তাফসীর ইবনে কাসীর'],
  },
];

// Helper to get author by ID
export function getAuthorById(id) {
  return sampleAuthors.find((a) => a.id === id) || null;
}

// Helper to get articles by topic
export function getArticlesByTopic(topicSlug) {
  return sampleArticles.filter((a) => a.topicSlug === topicSlug);
}

// Helper to get topic by slug
export function getTopicBySlugLocal(slug) {
  return sampleTopics.find((t) => t.slug === slug) || null;
}

// Helper to search articles
export function searchArticlesLocal(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return sampleArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.authorName.toLowerCase().includes(q) ||
      a.topicName.toLowerCase().includes(q)
  );
}

// Sample Writer & Researcher Applications for Admin Review
export const sampleApplications = [
  {
    id: 'app-1',
    applicationId: 'SRT-APP-2026-84219',
    fullName: 'মুফতী মাহমুদুর রহমান কাসেমী',
    honorificTitle: 'মুফতী',
    email: 'mahmud.qasemi@gmail.com',
    phone: '+8801711223344',
    address: 'মিরপুর-১২, ঢাকা-১২১৬, বাংলাদেশ',
    bio: 'দারুল উলুম দেওবন্দ থেকে ইফতা ও ইসলামিক স্টাডিজে ডক্টরেট। বিগত ১২ বছর ধরে সিরাত ও হাদিস গবেষণায় যুক্ত।',
    qualification: 'তাখাসসুস ফিল হাদিস / ফিকহ (উচ্চতর গবেষণা সমমান)',
    institution: 'মারকাযুদ দাওয়াহ আল-ইসলামিয়া ঢাকা',
    department: 'সিরাত ও হাদিস গবেষণা বিভাগ',
    designation: 'সিনিয়র মুহাদ্দিস ও গবেষক',
    writingPurpose: 'রাসূলুল্লাহ ﷺ-এর অর্থনৈতিক বিপ্লব ও আধুনিক ব্যাংকিং ব্যবস্থার ইসলামী রূপরেখা বিশুদ্ধ দলিলের আলোকে তরুণ প্রজন্মের কাছে উপস্থাপন করা।',
    intendedTopics: 'মাদানী রাষ্ট্র ও অর্থনীতি, নববী কূটনীতি, শামায়েলে তিরমিযী তাহকিক',
    previousPublications: 'নবীজীর ﷺ অর্থনৈতিক দর্শন (২০২২), মদীনা সনদের সার্বজনীন শিক্ষা (২০২৪)',
    sampleTitle: 'নবীজী ﷺ-এর অর্থনৈতিক নীতি ও সমকালীন পুঁজিবাদী সংকটের বিকল্প সমাধান',
    sampleWriting: 'নবীজী ﷺ যখন মদীনায় হিজরত করলেন, তখন প্রথম যে কাজটি করেছিলেন তা হলো একটি স্বাধীন ইসলামী বাজার প্রতিষ্ঠা করা। যেখানে কোনো কর আরোপ করা হতো না এবং মধ্যস্বত্বভোগীদের দৌরাত্ম্য বন্ধ করা হয়েছিল। ইমাম ইবনে মাজাহ তাঁর সুনানে সহীহ সনদে এটি বর্ণনা করেছেন...',
    tahqiqPledge: true,
    status: 'pending',
    submittedAt: '২০২৬-০৮-২২T১০:৩০:০০Z',
  },
  {
    id: 'app-2',
    applicationId: 'SRT-APP-2026-61942',
    fullName: 'শায়খ ড. আহমাদুল্লাহ নাদভী',
    honorificTitle: 'শায়খ',
    email: 'nadwi.ahmad@aljami.org',
    phone: '+8801819887766',
    address: 'নাসিরাবাদ, চট্টগ্রাম, বাংলাদেশ',
    bio: 'দারুল উলুম নদওয়াতুল উলামা লখনউ ও আন্তর্জাতিক ইসলামিক বিশ্ববিদ্যালয় মালয়েশিয়া (IIUM) থেকে সিরাতশাস্ত্রে পিএইচডি।',
    qualification: 'পিএইচডি / ডক্টরেট (সিরাত ও তুলনামূলক ধর্মতত্ত্ব)',
    institution: 'চট্টগ্রাম বিশ্ববিদ্যালয় / জামিয়া দারুল মাআরিফ',
    department: 'ইসলামিক স্টাডিজ ও দাওয়াহ অনুষদ',
    designation: 'সহযোগী অধ্যাপক',
    writingPurpose: 'প্রাচ্যবিদদের (Orientalists) সিরাত সংক্রান্ত অপব্যাখ্যা ও বিভ্রান্তির প্রামাণ্য শাস্ত্রীয় তাহকিকভিত্তিক খণ্ডন রচনা।',
    intendedTopics: 'প্রাচ্যবিদদের বিভ্রান্তি নিরসন, নবুওয়াত প্রমাণের যৌক্তিক সনদ',
    previousPublications: 'সিরাত চর্চায় ওরিয়েন্টালিস্টদের দৃষ্টিভঙ্গি (২০২৩)',
    sampleTitle: 'রাসূলুল্লাহ ﷺ-এর বহুবিবাহ ও প্রাচ্যবিদদের অভিযোগের ঐতিহাসিক তাহকিক',
    sampleWriting: 'রাসূলুল্লাহ ﷺ-এর বিবাহসমূহ ব্যক্তিগত কামনা-বাসনার ফল ছিল না, বরং প্রতিটি বিবাহের পেছনে সুস্পষ্ট রাজনৈতিক, সামাজিক ও দাওয়াতি হিকমাহ কার্যকর ছিল। সমকালীন আরবের উপজাতীয় ঐক্যের ক্ষেত্রে এর ভূমিকা ছিল অপরিসীম...',
    tahqiqPledge: true,
    status: 'under_review',
    submittedAt: '২০২৬-০৮-২১T১৫:৪৫:০০Z',
  },
  {
    id: 'app-3',
    applicationId: 'SRT-APP-2026-30511',
    fullName: 'উস্তাযা সুমাইয়া বিনতে আনোয়ার',
    honorificTitle: 'মুহতারামা',
    email: 'sumaiya.anwar@gmail.com',
    phone: '+8801912345678',
    address: 'উত্তরা, ঢাকা, বাংলাদেশ',
    bio: 'মদিনা তাইয়্যিবাহ ও ঢাকা বিশ্ববিদ্যালয় থেকে উসুলুদ দ্বীন বিষয়ে মাস্টার্স। নারীদের সিরাত পাঠ ও নববী পারিবারিক জীবনের গবেষক।',
    qualification: 'মাস্টার্স / কামিল (হাদিস ও তাফসির)',
    institution: 'আয়েশা সিদ্দীকা (রা.) মহিলা কামিল মাদ্রাসা',
    department: 'হাদিস ও সিরাত বিভাগ',
    designation: 'উস্তাযা ও বিভাগীয় প্রধান',
    writingPurpose: 'উম্মাহাতুল মুমিনীন ও সাহাবিয়্যাতদের জীবনাদর্শকে আধুনিক মুসলিম নারীদের প্রাত্যহিক জীবনের পথপ্রদর্শক হিসেবে তুলে ধরা।',
    intendedTopics: 'নববী পরিবার ও দাম্পত্য জীবন, উম্মাহাতুল মুমিনীন',
    previousPublications: 'আম্মাজান আয়েশা (রা.)-এর ইলমী অবদান (২০২১)',
    sampleTitle: 'উম্মুল মুমিনীন খাদিজা (রা.)-এর ব্যবসায়িক সততা ও প্রথম ওহীর রাতে তাঁর ঐতিহাসিক ভূমিকা',
    sampleWriting: 'হেরা গুহায় যখন প্রথম ওহী নাযিল হলো এবং রাসূল ﷺ কাঁপতে কাঁপতে ঘরে ফিরে বললেন "যাম্মিলূনী" (আমাকে বস্ত্রাবৃত করো), তখন খাদিজা (রা.) তাঁকে যে অবিস্মরণীয় সান্ত্বনা ও সাহস জুগিয়েছিলেন, তা নারী চরিত্রের সর্বোচ্চ প্রজ্ঞা ও ঈমানের প্রতীক...',
    tahqiqPledge: true,
    status: 'approved',
    submittedAt: '২০২৬-০৮-২০T০৯:১৫:০০Z',
  },
];

// Sample Platform Users with Phone Numbers, Roles & Ban Status
export const sampleUsers = [
  {
    uid: 'usr-1',
    displayName: 'ড. আবদুর রহমান',
    email: 'dr.rahman@aljami.org',
    phone: '+8801711122334',
    role: 'scholar', // 'reader' | 'writer' | 'scholar' | 'admin'
    isWriter: true,
    isVerified: true,
    isBanned: false,
    banReason: '',
    institution: 'আন্তর্জাতিক ইসলামী বিশ্ববিদ্যালয়',
    designation: 'অধ্যাপক ও প্রধান মুহাদ্দিস',
    totalPosts: 8,
    totalViews: 14250,
    totalSalawat: 3420,
    joinedAt: '২০২৪-০১-১৫',
  },
  {
    uid: 'usr-2',
    displayName: 'শায়খ ড. আহমাদুল্লাহ নাদভী',
    email: 'nadwi.ahmad@aljami.org',
    phone: '+8801819887766',
    role: 'scholar',
    isWriter: true,
    isVerified: true,
    isBanned: false,
    banReason: '',
    institution: 'দারুল উলুম নদওয়াতুল উলামা',
    designation: 'সহযোগী অধ্যাপক',
    totalPosts: 5,
    totalViews: 9800,
    totalSalawat: 2150,
    joinedAt: '২০২৪-০৩-১০',
  },
  {
    uid: 'usr-3',
    displayName: 'মুফতী মাহমুদুর রহমান কাসেমী',
    email: 'mahmud.qasemi@gmail.com',
    phone: '+8801711223344',
    role: 'writer',
    isWriter: true,
    isVerified: true,
    isBanned: false,
    banReason: '',
    institution: 'মারকাযুদ দাওয়াহ আল-ইসলামিয়া ঢাকা',
    designation: 'সিনিয়র মুহাদ্দিস ও গবেষক',
    totalPosts: 3,
    totalViews: 4560,
    totalSalawat: 1240,
    joinedAt: '২০২৪-০৫-১৮',
  },
  {
    uid: 'usr-4',
    displayName: 'মুহাম্মাদ খালিদ হাসান',
    email: 'khalid.hasan@gmail.com',
    phone: '+8801912998877',
    role: 'reader',
    isWriter: false,
    isVerified: false,
    isBanned: false,
    banReason: '',
    institution: 'ঢাকা বিশ্ববিদ্যালয়',
    designation: 'শিক্ষার্থী ও নিয়মিত পাঠক',
    totalPosts: 0,
    totalViews: 0,
    totalSalawat: 540,
    joinedAt: '২০২৪-০৬-২০',
  },
  {
    uid: 'usr-5',
    displayName: 'আব্দুর রাকিব চৌধুরী',
    email: 'rakib.chowdhury@yahoo.com',
    phone: '+8801678112233',
    role: 'reader',
    isWriter: false,
    isVerified: false,
    isBanned: true,
    banReason: 'মন্তব্যে শিষ্টাচার ও আদব লঙ্ঘনের কারণে সাময়িক স্থগিত',
    institution: 'সাধারণ পাঠক',
    designation: 'পাঠক',
    totalPosts: 0,
    totalViews: 0,
    totalSalawat: 12,
    joinedAt: '২০২৪-০৭-০১',
  },
  {
    uid: 'usr-6',
    displayName: 'উস্তাযা সুমাইয়া বিনতে আনোয়ার',
    email: 'sumaiya.anwar@gmail.com',
    phone: '+8801912345678',
    role: 'writer',
    isWriter: true,
    isVerified: true,
    isBanned: false,
    banReason: '',
    institution: 'আয়েশা সিদ্দীকা মহিলা কামিল মাদ্রাসা',
    designation: 'উস্তাযা ও গবেষক',
    totalPosts: 4,
    totalViews: 6700,
    totalSalawat: 1890,
    joinedAt: '২০২৪-০৪-১২',
  },
];

// Sample Platform Customization & Settings
export const samplePlatformSettings = {
  siteName: 'সীরাত.ব্লগ',
  tagline: 'রাসূলুল্লাহ ﷺ-এর পুণ্যময় জীবনচরিত ও বিশুদ্ধ জ্ঞানভিত্তিক তাহকিক সংকলন',
  announcementActive: true,
  announcementText: '📢 মাশাআল্লাহ! পবিত্র রবিউল আউয়াল উপলক্ষে বিশেষ সিরাত রচনা প্রতিযোগিতা ও তাহকিক লেখক রেজিস্ট্রেশন চলছে।',
  announcementLink: '/apply',
  writerApplicationsOpen: true,
  strictHadithReferences: true,
  duroodDailyGoal: 25000,
  currentDuroodCount: 18450,
  dailyVisitorsCount: 4850,
  autoModerateComments: true,
  contactPhone: '+8801718763978',
  contactDisplayPhone: '০১৭১৮-৭৬৩৯৭৮',
  whatsappUrl: 'https://wa.me/8801718763978?text=আসসালামু%20আলাইকুম,%20সীরাত.ব্লগ%20সম্পর্কে%20আমার%20পরামর্শ:',
};

// Click & Engagement Analytics
export const sampleClickAnalytics = {
  totalClicks: 43520,
  jazakallahClicks: 12450,
  duroodClicks: 18450,
  bookmarkClicks: 4120,
  shareClicks: 2890,
  quizAttemptsClicks: 3670,
  commentRepliesClicks: 1940,
};

// Topic View & Interest Breakdown (কোন বিষয় পাঠকরা বেশি দেখতেছেন)
export const sampleTopicViewsAnalytics = [
  {
    topicName: 'মক্কী জীবন ও নবুওয়াত',
    topicSlug: 'makki-life',
    totalViews: 35400,
    percentage: 32,
    clicks: 8420,
    duroodCount: 5410,
    color: '#047857',
  },
  {
    topicName: 'মাদানী জীবন ও ইসলামী রাষ্ট্রনীতি',
    topicSlug: 'madani-life',
    totalViews: 28900,
    percentage: 26,
    clicks: 6300,
    duroodCount: 4230,
    color: '#059669',
  },
  {
    topicName: 'শামায়েল ও চারিত্রিক সৌন্দর্য',
    topicSlug: 'shamail',
    totalViews: 22100,
    percentage: 20,
    clicks: 5100,
    duroodCount: 4890,
    color: '#D97706',
  },
  {
    topicName: 'সিরাত কুইজ ও প্রতিযোগিতা',
    topicSlug: 'seerah-quiz',
    totalViews: 14300,
    percentage: 13,
    clicks: 3670,
    duroodCount: 2450,
    color: '#2563EB',
  },
  {
    topicName: 'সাহাবায়ে কেরাম ও ঐতিহাসিক সন্ধি',
    topicSlug: 'sahaba-history',
    totalViews: 10200,
    percentage: 9,
    clicks: 2400,
    duroodCount: 1470,
    color: '#7C3AED',
  },
];

// Feedback & Advice Store
export const sampleFeedbackList = [
  {
    id: 'fb-1',
    name: 'মুহাম্মাদ খালিদ',
    phone: '০১৯১২৯৯৮৮৭৭',
    subject: 'সিরাত কুইজের সংখ্যা বৃদ্ধি',
    message: 'মাশাআল্লাহ সাইটটি অনেক সুন্দর হয়েছে। প্রতি সপ্তাহে আরও নতুন নতুন কুইজ যুক্ত করলে যুবসমাজ বেশি উপকৃত হবে।',
    date: '২০২৬-০৮-২১',
  },
  {
    id: 'fb-2',
    name: 'মুফতী মাহমুদ',
    phone: '০১৭১১২২৩৩৪৪',
    subject: 'আরবি ইবারতের ফন্ট সাইজ',
    message: 'আরবি হাদিসের ইবারতগুলো আরও স্পষ্ট ও বড় করার অনুরোধ রইলো। তাহকিকগুলো মাশাআল্লাহ মানসম্মত।',
    date: '২০২৬-০৮-২২',
  },
];
