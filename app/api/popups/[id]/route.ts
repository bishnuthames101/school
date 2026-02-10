import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update popup
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, imageUrl, linkUrl, startDate, endDate, isActive } = body;

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
    await prisma.popup.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Popup deleted successfully' });
  } catch (error) {
    console.error('Error deleting popup:', error);
    return NextResponse.json({ error: 'Failed to delete popup' }, { status: 500 });
  }
}
