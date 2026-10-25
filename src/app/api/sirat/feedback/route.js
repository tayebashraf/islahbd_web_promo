import { NextResponse } from 'next/server';
import { submitPlatformFeedback, getFeedbackList } from '@/lib/sirat/firestore';

export async function GET() {
  try {
    const list = await getFeedbackList();
    return NextResponse.json({ success: true, feedback: list });
  } catch (error) {
    console.error('API /api/feedback GET error:', error);
    return NextResponse.json(
      { success: false, error: 'মতামত তালিকা লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { success: false, error: 'পরামর্শ বা মতামতের বিবরণ আবশ্যক' },
        { status: 400 }
      );
    }

    const result = await submitPlatformFeedback(body);
    return NextResponse.json({
      success: true,
      message: 'জাযাকাল্লাহু খাইরান! আপনার মূল্যবান পরামর্শ ও মতামত সফলভাবে গৃহীত হয়েছে।',
      feedback: result.feedback,
    });
  } catch (error) {
    console.error('API /api/feedback POST error:', error);
    return NextResponse.json(
      { success: false, error: 'পরামর্শ সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
