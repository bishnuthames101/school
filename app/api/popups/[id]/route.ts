import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { deleteUploadedFile } from '@/lib/fileUpload';

// PUT - Update popup
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, imageUrl, linkUrl, startDate, endDate, isActive } = body;

    // If imageUrl is changing, clean up the old file
    const existing = await prisma.popup.findUnique({ where: { id: params.id } });
    if (existing && existing.imageUrl !== imageUrl && existing.imageUrl.startsWith('/api/files/')) {
      await deleteUploadedFile(existing.imageUrl);
    }

    const popup = await prisma.popup.update({
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

// DELETE - Delete popup
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch popup first to get imageUrl for cleanup
    const popup = await prisma.popup.findUnique({ where: { id: params.id } });

    if (popup && popup.imageUrl.startsWith('/api/files/')) {
      await deleteUploadedFile(popup.imageUrl);
    }

    await prisma.popup.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Popup deleted successfully' });
  } catch (error) {
    console.error('Error deleting popup:', error);
    return NextResponse.json({ error: 'Failed to delete popup' }, { status: 500 });
  }
}
