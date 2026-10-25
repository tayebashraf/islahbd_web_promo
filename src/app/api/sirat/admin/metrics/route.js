import { NextResponse } from 'next/server';
import { getAdminMetrics } from '@/lib/sirat/firestore';

export async function GET() {
  try {
    const metrics = await getAdminMetrics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('API /api/admin/metrics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'মেট্রিক্স লোড করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
