import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { deleteFile } from '@/lib/storage';

// GET single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await scopedPrisma();
    const event = await db.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT update event (requires auth)
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
    const event = await db.event.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Error updating event:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update event' },
      { status: 400 }
    );
  }
}

// DELETE event (requires auth)
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

    // Get event to clean up files
    const existing = await db.event.findUnique({ where: { id: params.id } });
    if (existing?.image) {
      await deleteFile(existing.image);
    }

    const event = await db.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Error deleting event:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
