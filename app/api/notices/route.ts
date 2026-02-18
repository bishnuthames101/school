import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { getSchoolSlug } from '@/lib/school';
import { uploadDocument, deleteFile } from '@/lib/storage';

// GET all notices with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const db = await scopedPrisma();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await db.notice.count({ where });

    const notices = await db.notice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: notices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

// POST new notice (requires auth)
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
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const attachmentFile = formData.get('attachment') as File | null;

    let attachmentUrl: string | undefined = undefined;

    // Handle file upload if present
    if (attachmentFile && attachmentFile.size > 0) {
      attachmentUrl = await uploadDocument(schoolSlug, 'notices', attachmentFile, attachmentFile.name);
    }

    const notice = await db.notice.create({
      data: {
        title,
        date,
        category,
        description,
        priority,
        attachment: attachmentUrl,
      },
    });
    return NextResponse.json({ success: true, data: notice }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create notice' },
      { status: 400 }
    );
  }
}

// PUT update notice (requires auth)
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
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const attachmentFile = formData.get('attachment') as File | null;
    const existingAttachment = formData.get('existingAttachment') as string | null;

    let attachmentUrl: string | undefined = existingAttachment || undefined;

    // Handle file upload if present
    if (attachmentFile && attachmentFile.size > 0) {
      attachmentUrl = await uploadDocument(schoolSlug, 'notices', attachmentFile, attachmentFile.name);

      // Delete old attachment from storage
      if (existingAttachment) {
        await deleteFile(existingAttachment);
      }
    }

    const notice = await db.notice.update({
      where: { id },
      data: {
        title,
        date,
        category,
        description,
        priority,
        attachment: attachmentUrl,
      },
    });

    return NextResponse.json({ success: true, data: notice });
  } catch (error: any) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notice' },
      { status: 400 }
    );
  }
}

// DELETE notice (requires auth)
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
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    // Get notice to clean up attachment
    const notice = await db.notice.findUnique({ where: { id } });
    if (notice?.attachment) {
      await deleteFile(notice.attachment);
    }

    await db.notice.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete notice' },
      { status: 400 }
    );
  }
}
