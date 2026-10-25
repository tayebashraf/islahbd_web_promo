import { NextResponse } from 'next/server';
import { incrementArticleJazakallah } from '@/lib/sirat/firestore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { articleId, reactionKey } = body;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'articleId আবশ্যক' },
        { status: 400 }
      );
    }

    await incrementArticleJazakallah(articleId);

    return NextResponse.json({
      success: true,
      message: 'প্রতিক্রিয়া সফলভাবে সংরক্ষিত হয়েছে',
      reactionKey: reactionKey || 'jazakallah',
    });
  } catch (err) {
    console.error('API /api/reactions POST error:', err);
    return NextResponse.json(
      { success: false, error: 'প্রতিক্রিয়া সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
