import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

// GET single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery image' },
      { status: 500 }
    );
  }
}

// PUT update gallery image (requires auth)
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

    const body = await request.json();
    const image = await prisma.galleryImage.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error: any) {
    console.error('Error updating gallery image:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update gallery image' },
      { status: 400 }
    );
  }
}

// DELETE gallery image (requires auth)
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

    const image = await prisma.galleryImage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery image' },
      { status: 500 }
    );
  }
}
