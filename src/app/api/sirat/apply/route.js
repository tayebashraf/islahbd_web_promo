import { NextResponse } from 'next/server';
import { submitWriterApplication } from '@/lib/sirat/firestore';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      honorificTitle,
      email,
      phone,
      address,
      bio,
      qualification,
      institution,
      department,
      designation,
      writingPurpose,
      intendedTopics,
      previousPublications,
      sampleTitle,
      sampleWriting,
      tahqiqPledge,
    } = body;

    if (!fullName || !institution || !sampleWriting) {
      return NextResponse.json(
        { success: false, error: 'দয়া করে আপনার নাম, শিক্ষাপ্রতিষ্ঠান ও লেখার নমুনা পূরণ করুন' },
        { status: 400 }
      );
    }

    const appId = `SRT-APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const applicationData = {
      applicationId: appId,
      fullName,
      honorificTitle: honorificTitle || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
      bio: bio || '',
      qualification: qualification || 'দাওরায়ে হাদিস (মাস্টার্স সমমান)',
      institution,
      department: department || '',
      designation: designation || 'গবেষক ও লেখক',
      writingPurpose: writingPurpose || '',
      intendedTopics: intendedTopics || '',
      previousPublications: previousPublications || '',
      sampleTitle: sampleTitle || 'সিরাত গবেষণা প্রবন্ধ',
      sampleWriting,
      tahqiqPledge: Boolean(tahqiqPledge),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const result = await submitWriterApplication(applicationData);

    return NextResponse.json({
      success: true,
      message: 'আপনার সিরাত গবেষক ও লেখক আবেদনটি সফলভাবে গৃহীত হয়েছে। অ্যাডমিন ও সম্পাদনা পরিষদ যাচাই করে আপনার সাথে যোগাযোগ করবে।',
      applicationId: appId,
      data: applicationData,
    }, { status: 201 });
  } catch (err) {
    console.error('API /api/apply POST error:', err);
    return NextResponse.json(
      { success: false, error: 'আবেদন জমা দিতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
