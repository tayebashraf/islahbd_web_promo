import { NextResponse } from 'next/server';

const mockNotifications = [
  {
    id: 'n1',
    type: 'adab_reply',
    title: 'শায়খ আহমাদ আলী আপনার আরজের উত্তর দিয়েছেন',
    snippet: '“মাশাআল্লাহ, আল্লাহ আপনার ইলমে বরকত দান করুন। বিশেষ করে তায়েফের ঘটনায় নববী ধৈর্যের শিক্ষাটি অনবদ্য।”',
    time: '৫ মিনিট আগে',
    read: false,
    authorName: 'শায়খ আহমাদ আলী',
    link: '/articles/dawah-er-potho-nobiji-er-hikmat',
    icon: '✨',
  },
  {
    id: 'n2',
    type: 'reaction',
    title: 'ড. আবদুর রহমান আপনার মন্তব্যে جَزَاكَ ٱللَّٰهُ জানিয়েছেন',
    snippet: '“হিজরতের ঐতিহাসিক প্রেক্ষাপট ও সওর গুহার শিক্ষণীয় দিক নিয়ে আপনার আলোচনায়”',
    time: '২৫ মিনিট আগে',
    read: false,
    authorName: 'ড. আবদুর রহমান',
    link: '/articles/makkar-poth-theke-madinay',
    icon: '🤲',
  },
  {
    id: 'n3',
    type: 'new_article',
    title: 'উস্তাযা ফাতিমা খান নতুন প্রবন্ধ প্রকাশ করেছেন',
    snippet: 'নবীজী ﷺ-এর দয়ার দৃষ্টান্ত: রাহমাতুল লিল আলামীন — শামায়েল ও আখলাক পর্ব',
    time: '২ ঘন্টা আগে',
    read: false,
    authorName: 'উস্তাযা ফাতিমা খান',
    link: '/articles/nobiji-er-dayar-drishtanto',
    icon: '📖',
  },
  {
    id: 'n4',
    type: 'application_status',
    title: 'আপনার লেখক আবেদনটি পর্যালোচনাধীন রয়েছে',
    snippet: 'সম্পাদনা পরিষদ আপনার সনদ ও নমুনা লেখা যাচাই-বাছাই করছে।',
    time: '১ দিন আগে',
    read: true,
    authorName: 'সম্পাদনা পরিষদ',
    link: '/apply',
    icon: '⏳',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter((n) => !n.read).length,
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, id } = body;

    if (action === 'mark_all_read') {
      return NextResponse.json({
        success: true,
        message: 'সকল নোটিফিকেশন পঠিত হিসেবে চিহ্নিত করা হয়েছে',
      });
    }

    return NextResponse.json({
      success: true,
      message: `নোটিফিকেশন ${id} পঠিত হয়েছে`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'নোটিফিকেশন আপডেট ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
