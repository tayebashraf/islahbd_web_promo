import { NextResponse } from 'next/server';
import { getQuizAttempt, saveQuizAttempt } from '@/lib/sirat/firestore';

// GET: Check if user already answered a specific quiz
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const articleId = searchParams.get('articleId');

    if (!uid || !articleId) {
      return NextResponse.json({ error: 'Missing uid or articleId' }, { status: 400 });
    }

    const attempt = await getQuizAttempt(uid, articleId);

    if (attempt) {
      return NextResponse.json({ answered: true, attempt });
    }

    return NextResponse.json({ answered: false });
  } catch (error) {
    console.error('Quiz GET error:', error);
    return NextResponse.json({ error: 'Failed to check quiz attempt' }, { status: 500 });
  }
}

// POST: Save a quiz attempt (one-time only per user per quiz)
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, articleId, selectedOptionId, isCorrect } = body;

    if (!uid || !articleId || !selectedOptionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already answered (prevent duplicate)
    const existing = await getQuizAttempt(uid, articleId);
    if (existing) {
      return NextResponse.json(
        { error: 'Already answered', attempt: existing },
        { status: 409 }
      );
    }

    // Save the attempt
    const attemptData = {
      uid,
      articleId,
      selectedOptionId,
      isCorrect: !!isCorrect,
      answeredAt: new Date().toISOString(),
    };

    await saveQuizAttempt(uid, articleId, attemptData);

    return NextResponse.json({ success: true, attempt: attemptData });
  } catch (error) {
    console.error('Quiz POST error:', error);
    return NextResponse.json({ error: 'Failed to save quiz attempt' }, { status: 500 });
  }
}
