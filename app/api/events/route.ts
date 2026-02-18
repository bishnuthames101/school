import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { getSchoolSlug } from '@/lib/school';
import { uploadImage, deleteFile } from '@/lib/storage';

// GET all events with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const db = await scopedPrisma();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build filter conditions
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await db.event.count({ where });

    const events = await db.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST new event (requires auth)
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
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!title || !date || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const imageUrl = await uploadImage(schoolSlug, 'events', file, file.name);

    const event = await db.event.create({
      data: {
        title,
        date,
        category,
        image: imageUrl,
        description,
      },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 400 }
    );
  }
}

// PUT update event (requires auth)
export async function PUT(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const existingImage = formData.get('existingImage') as string | null;
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!title || !date || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    let imageUrl = existingImage;

    // If new file is uploaded, save it and delete old one
    if (file) {
      imageUrl = await uploadImage(schoolSlug, 'events', file, file.name);

      // Delete old image from storage
      if (existingImage) {
        await deleteFile(existingImage);
      }
    }

    const event = await db.event.update({
      where: { id },
      data: {
        title,
        date,
        category,
        image: imageUrl!,
        description,
      },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update event' },
      { status: 400 }
    );
  }
}

// DELETE event (requires auth)
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
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Get the event to delete the file
    const event = await db.event.findUnique({ where: { id } });

    if (event?.image) {
      await deleteFile(event.image);
    }

    await db.event.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete event' },
      { status: 400 }
    );
  }
}
