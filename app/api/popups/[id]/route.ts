import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { deleteFile } from '@/lib/storage';

// PUT - Update popup (requires auth)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await scopedPrisma();
    const body = await request.json();
    const { title, imageUrl, linkUrl, startDate, endDate, isActive } = body;

    // If imageUrl is changing, clean up the old file
    const existing = await db.popup.findUnique({ where: { id: params.id } });
    if (existing && existing.imageUrl && existing.imageUrl !== imageUrl) {
      await deleteFile(existing.imageUrl);
    }

    const popup = await db.popup.update({
      where: { id: params.id },
      data: {
        title,
        imageUrl,
        linkUrl: linkUrl || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      },
    });

    return NextResponse.json(popup);
  } catch (error) {
    console.error('Error updating popup:', error);
    return NextResponse.json({ error: 'Failed to update popup' }, { status: 500 });
  }
}

// DELETE - Delete popup (requires auth)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await scopedPrisma();

    // Fetch popup first to get imageUrl for cleanup
    const popup = await db.popup.findUnique({ where: { id: params.id } });

    if (popup?.imageUrl) {
      await deleteFile(popup.imageUrl);
    }

    await db.popup.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Popup deleted successfully' });
  } catch (error) {
    console.error('Error deleting popup:', error);
    return NextResponse.json({ error: 'Failed to delete popup' }, { status: 500 });
  }
}
