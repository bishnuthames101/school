import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { getSchoolSlug } from '@/lib/school';
import { uploadImage, deleteFile } from '@/lib/storage';

// GET all gallery images with pagination
export async function GET(request: NextRequest) {
  try {
    const db = await scopedPrisma();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const total = await db.galleryImage.count();

    const images = await db.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
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

    const db = await scopedPrisma();
    const schoolSlug = getSchoolSlug();
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

    // Upload to Supabase Storage
    const imageUrl = await uploadImage(schoolSlug, 'gallery', file, file.name);

    const image = await db.galleryImage.create({
      data: {
        imageUrl,
        caption,
        category,
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

    const db = await scopedPrisma();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Get image to delete the file from storage
    const image = await db.galleryImage.findUnique({ where: { id } });

    if (image?.imageUrl) {
      await deleteFile(image.imageUrl);
    }

    await db.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete image' },
      { status: 400 }
    );
  }
}
