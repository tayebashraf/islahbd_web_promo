import { NextResponse } from 'next/server';
import { getArticles, updateArticleStatus, deleteArticle } from '@/lib/sirat/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || null;
    const articles = await getArticles({ status, pageSize: 100 });
    return NextResponse.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('API /api/admin/articles GET error:', error);
    return NextResponse.json(
      { success: false, error: 'প্রবন্ধ লোড করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { articleId, status } = body;

    if (!articleId || !status) {
      return NextResponse.json(
        { success: false, error: 'articleId এবং status আবশ্যক' },
        { status: 400 }
      );
    }

    await updateArticleStatus(articleId, status);

    return NextResponse.json({
      success: true,
      message: `প্রবন্ধের স্ট্যাটাস '${status}' হিসেবে সফলভাবে আপডেট করা হয়েছে।`,
      articleId,
      status,
    });
  } catch (error) {
    console.error('API /api/admin/articles PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'প্রবন্ধ আপডেট করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('id');

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'articleId আবশ্যক' },
        { status: 400 }
      );
    }

    await deleteArticle(articleId);

    return NextResponse.json({
      success: true,
      message: 'প্রবন্ধ সফলভাবে মুছে ফেলা হয়েছে।',
      articleId,
    });
  } catch (error) {
    console.error('API /api/admin/articles DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'প্রবন্ধ মুছতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
