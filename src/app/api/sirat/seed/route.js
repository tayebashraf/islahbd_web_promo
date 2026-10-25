import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/sirat/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sampleArticles, sampleAuthors, sampleTopics } from '@/lib/sirat/sampleData';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') || (await request.json().catch(() => ({}))).secret;

    const expectedSecret = process.env.ADMIN_SECRET_KEY || 'sirat_tahqiq_admin_secret_2026';
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'অননুমোদিত অনুরোধ (Invalid Admin Secret)' },
        { status: 403 }
      );
    }

    if (!isFirebaseConfigured) {
      return NextResponse.json({
        success: true,
        message: 'ফায়ারবেস কী কনফিগার করা হয়নি। অ্যাপ্লিকেশনটি সরাসরি লোকাল হাইব্রিড মোডে সক্রিয় রয়েছে।',
        counts: {
          articles: sampleArticles.length,
          authors: sampleAuthors.length,
          topics: sampleTopics.length,
        },
      });
    }

    // 1. Seed Topics
    for (const topic of sampleTopics) {
      await setDoc(doc(db, 'topics', topic.slug), {
        ...topic,
        updatedAt: serverTimestamp(),
      });
    }

    // 2. Seed Authors
    for (const author of sampleAuthors) {
      await setDoc(doc(db, 'users', author.id), {
        ...author,
        joinedAt: serverTimestamp(),
      });
    }

    // 3. Seed Articles
    for (const article of sampleArticles) {
      await setDoc(doc(db, 'articles', article.id), {
        ...article,
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'ফায়ারস্টোর ডাটাবেসে সফলভাবে সকল সিরাত প্রবন্ধ, স্কলার ও বিষয়শ্রেণী সিড করা হয়েছে।',
      seeded: {
        articles: sampleArticles.length,
        authors: sampleAuthors.length,
        topics: sampleTopics.length,
      },
    });
  } catch (err) {
    console.error('API /api/seed error:', err);
    return NextResponse.json(
      { success: false, error: 'ডাটাবেস সিডিং করতে সমস্যা হয়েছে: ' + err.message },
      { status: 500 }
    );
  }
}
