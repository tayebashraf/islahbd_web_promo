import { NextResponse } from 'next/server';
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/lib/sirat/firestore';
import { sampleArticles } from '@/lib/sirat/sampleData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicSlug = searchParams.get('topicSlug') || undefined;
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const status = searchParams.get('status') || 'published';

    const articles = await getArticles({ topicSlug, status, pageSize });
    return NextResponse.json({ success: true, articles });
  } catch (err) {
    console.error('API /api/articles GET error:', err);
    return NextResponse.json(
      { success: false, error: 'সিরাত প্রবন্ধ লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'শিরোনাম ও মূল বক্তব্য আবশ্যক' },
        { status: 400 }
      );
    }

    const created = await createArticle(body);
    return NextResponse.json({ success: true, article: created }, { status: 201 });
  } catch (err) {
    console.error('API /api/articles POST error:', err);
    return NextResponse.json(
      { success: false, error: 'প্রবন্ধ সংরক্ষণ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID আবশ্যক' }, { status: 400 });
    }
    const result = await updateArticle(id, data);
    return NextResponse.json({ success: true, message: 'পোস্ট সফলভাবে আপডেট করা হয়েছে।', ...result });
  } catch (err) {
    console.error('API /api/articles PATCH error:', err);
    return NextResponse.json({ success: false, error: 'পোস্ট আপডেট করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID আবশ্যক' }, { status: 400 });
    }
    await deleteArticle(id);
    return NextResponse.json({ success: true, message: 'পোস্ট সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (err) {
    console.error('API /api/articles DELETE error:', err);
    return NextResponse.json({ success: false, error: 'পোস্ট মুছতে সমস্যা হয়েছে' }, { status: 500 });
  }
}
