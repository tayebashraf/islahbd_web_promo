import { NextResponse } from 'next/server';
import { getWriterApplications, updateWriterApplicationStatus } from '@/lib/sirat/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const applications = await getWriterApplications({ status });
    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error('API /api/admin/applications GET error:', error);
    return NextResponse.json(
      { success: false, error: 'আবেদন লোড করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { applicationId, status, reviewerNotes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'applicationId এবং status আবশ্যক' },
        { status: 400 }
      );
    }

    await updateWriterApplicationStatus(applicationId, status, reviewerNotes || '');

    return NextResponse.json({
      success: true,
      message: `আবেদন স্ট্যাটাস '${status}' হিসেবে সফলভাবে আপডেট করা হয়েছে।`,
      applicationId,
      status,
    });
  } catch (error) {
    console.error('API /api/admin/applications PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'আবেদন আপডেট করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
