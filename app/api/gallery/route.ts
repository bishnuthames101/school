import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { saveUploadedFile, deleteUploadedFile } from '@/lib/fileUpload';

// GET all gallery images with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await prisma.galleryImage.count();

    const images = await prisma.galleryImage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: images,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

// POST new gallery image (requires auth)
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const caption = formData.get('caption') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!caption || !category) {
      return NextResponse.json(
        { success: false, error: 'Caption and category are required' },
        { status: 400 }
      );
    }

    // Save the uploaded file
    const uploadResult = await saveUploadedFile(file);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'Failed to upload file' },
        { status: 400 }
      );
    }

    // Create database record
    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: uploadResult.filePath!,
        caption,
        category: category as any,
      },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create gallery image' },
      { status: 400 }
    );
  }
}

// DELETE gallery image (requires auth)
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Get the image to delete the file
    const image = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (image) {
      // Delete the physical file
      await deleteUploadedFile(image.imageUrl);
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete image' },
      { status: 400 }
    );
  }
}
