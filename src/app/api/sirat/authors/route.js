import { NextResponse } from 'next/server';
import { sampleAuthors } from '@/lib/sirat/sampleData';

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/sirat/authors/`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, authors: data.results || data });
    }
    return NextResponse.json({ success: true, authors: sampleAuthors });
  } catch (err) {
    return NextResponse.json({ success: true, authors: sampleAuthors });
  }
}
