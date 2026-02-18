import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { deleteFile } from '@/lib/storage';

// GET single notice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await scopedPrisma();
    const notice = await db.notice.findUnique({
      where: { id: params.id },
    });

    if (!notice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    console.error('Error fetching notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notice' },
      { status: 500 }
    );
  }
}

// PUT update notice (requires auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await scopedPrisma();
    const body = await request.json();
    const notice = await db.notice.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, data: notice });
  } catch (error: any) {
    console.error('Error updating notice:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notice' },
      { status: 400 }
    );
  }
}

// DELETE notice (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await scopedPrisma();

    // Get notice to clean up attachment
    const existing = await db.notice.findUnique({ where: { id: params.id } });
    if (existing?.attachment) {
      await deleteFile(existing.attachment);
    }

    const notice = await db.notice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, data: notice });
  } catch (error: any) {
    console.error('Error deleting notice:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete notice' },
      { status: 500 }
    );
  }
}
