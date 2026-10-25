import { NextResponse } from 'next/server';
import { getAllUsers, updateUserBanStatus, updateUserRole, updateUserPhone } from '@/lib/sirat/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'all';
    const isBannedParam = searchParams.get('isBanned');
    const isBanned = isBannedParam === 'true' ? true : isBannedParam === 'false' ? false : null;
    const searchQuery = searchParams.get('q') || '';

    const users = await getAllUsers({ role, isBanned, searchQuery });

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('API /api/admin/users GET error:', error);
    return NextResponse.json(
      { success: false, error: 'ইউজার তালিকা লোড করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { uid, action, isBanned, banReason, role, phone } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'User UID আবশ্যক' },
        { status: 400 }
      );
    }

    if (action === 'ban') {
      await updateUserBanStatus(uid, isBanned, banReason || '');
      return NextResponse.json({
        success: true,
        message: isBanned ? 'ইউজারকে সফলভাবে ব্যান করা হয়েছে।' : 'ইউজারের ব্যান তুলে নেওয়া হয়েছে।',
        uid,
        isBanned,
      });
    }

    if (action === 'update_role') {
      await updateUserRole(uid, role);
      return NextResponse.json({
        success: true,
        message: `ইউজারের রোল সফলভাবে '${role}' করা হয়েছে।`,
        uid,
        role,
      });
    }

    if (action === 'update_phone') {
      await updateUserPhone(uid, phone);
      return NextResponse.json({
        success: true,
        message: 'মোবাইল নম্বর সফলভাবে আপডেট করা হয়েছে।',
        uid,
        phone,
      });
    }

    return NextResponse.json(
      { success: false, error: 'সঠিক অ্যাকশন প্রদান করুন' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API /api/admin/users PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'ইউজার আপডেট করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
