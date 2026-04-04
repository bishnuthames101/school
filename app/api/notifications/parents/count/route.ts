import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';

export const dynamic = 'force-dynamic';

// GET count of active parents, optionally filtered by classId — requires auth
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await scopedPrisma();
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    const where: any = { isActive: true };
    if (classId) {
      where.classId = classId;
    }

    const count = await db.parent.count({ where });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error counting parents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to count parents' },
      { status: 500 }
    );
  }
}
