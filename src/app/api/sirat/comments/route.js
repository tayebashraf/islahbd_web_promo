import { NextResponse } from 'next/server';
import { getCommentsByArticle, addCommentToArticle } from '@/lib/sirat/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'articleId আবশ্যক' },
        { status: 400 }
      );
    }

    const comments = await getCommentsByArticle(articleId);
    return NextResponse.json({ success: true, comments });
  } catch (err) {
    console.error('API /api/comments GET error:', err);
    return NextResponse.json(
      { success: false, error: 'মন্তব্যসমূহ লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { articleId, text, authorName, isDurood, parentCommentId, seniorityRank } = body;

    if (!articleId || !text) {
      return NextResponse.json(
        { success: false, error: 'আর্টিকেল আইডি ও মন্তব্যের টেক্সট আবশ্যক' },
        { status: 400 }
      );
    }

    const comment = await addCommentToArticle(articleId, {
      text,
      authorName: authorName || 'মুফতী আব্দুল্লাহ',
      isDurood: Boolean(isDurood),
      parentCommentId: parentCommentId || null,
      seniorityRank: seniorityRank || 2,
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (err) {
    console.error('API /api/comments POST error:', err);
    return NextResponse.json(
      { success: false, error: 'মন্তব্য সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
