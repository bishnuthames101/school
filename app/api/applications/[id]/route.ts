import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];

// PATCH /api/applications/[id] — update application status (requires auth)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const db = await scopedPrisma();
    const application = await db.applicationForm.update({
      where: { id },
      data: { status },
    });

    logAction('UPDATE', 'Application', id, `status → ${status}`);

    return NextResponse.json({ success: true, data: application });
  } catch (error: any) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update status' },
      { status: 400 }
    );
  }
}
