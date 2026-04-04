import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';

export const dynamic = 'force-dynamic';

// GET last 50 notification messages for this school (requires auth)
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await scopedPrisma();

    const messages = await db.notificationMessage.findMany({
      include: { sentToClass: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    } as any);

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching notification history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification history' },
      { status: 500 }
    );
  }
}
