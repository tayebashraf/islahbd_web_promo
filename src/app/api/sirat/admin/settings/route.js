import { NextResponse } from 'next/server';
import { getPlatformSettings, updatePlatformSettings } from '@/lib/sirat/firestore';

export async function GET() {
  try {
    const settings = await getPlatformSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('API /api/admin/settings GET error:', error);
    return NextResponse.json(
      { success: false, error: 'সেটিংস লোড করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await updatePlatformSettings(body);
    return NextResponse.json({
      success: true,
      message: 'প্ল্যাটফর্ম কাস্টমাইজেশন ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে।',
      settings: result.settings,
    });
  } catch (error) {
    console.error('API /api/admin/settings POST error:', error);
    return NextResponse.json(
      { success: false, error: 'সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
