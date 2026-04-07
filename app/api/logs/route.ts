import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSchoolId } from '@/lib/school';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET audit logs with pagination (requires auth)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const schoolId = await getSchoolId();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const skip = (page - 1) * limit;
    const entity = searchParams.get('entity');
    const action = searchParams.get('action');

    const where: any = { schoolId };
    if (entity) where.entity = entity;
    if (action) where.action = action;

    const [total, logs] = await Promise.all([
      (prisma as any).auditLog.count({ where }),
      (prisma as any).auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
