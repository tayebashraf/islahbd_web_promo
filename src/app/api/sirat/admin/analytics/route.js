import { NextResponse } from 'next/server';
import { getAuthorPerformanceStats, getAdminMetrics, getPlatformAnalytics, getFeedbackList } from '@/lib/sirat/firestore';

export async function GET() {
  try {
    const authors = await getAuthorPerformanceStats();
    const metrics = await getAdminMetrics();
    const platformAnalytics = await getPlatformAnalytics();
    const feedbackList = await getFeedbackList();

    return NextResponse.json({
      success: true,
      authors,
      metrics,
      userStats: platformAnalytics.userStats,
      clickAnalytics: platformAnalytics.clickAnalytics,
      topicInterestAnalytics: platformAnalytics.topicInterestAnalytics,
      feedbackList,
    });
  } catch (error) {
    console.error('API /api/admin/analytics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'এনালিটিক্স লোড করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
