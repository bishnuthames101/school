import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { saveDocumentFile } from '@/lib/fileUpload';

// GET all notices with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    // Build filter conditions
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

    // Get total count for pagination metadata with filters applied
    const total = await prisma.notice.count({ where });

    const notices = await prisma.notice.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
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
      const uploadResult = await saveDocumentFile(attachmentFile);
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error || 'Failed to upload file' },
          { status: 400 }
        );
      }
      attachmentUrl = uploadResult.filePath;
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        date,
        category: category as any,
        description,
        priority: priority as any,
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
      const uploadResult = await saveDocumentFile(attachmentFile);
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error || 'Failed to upload file' },
          { status: 400 }
        );
      }
      attachmentUrl = uploadResult.filePath;
    }

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title,
        date,
        category: category as any,
        description,
        priority: priority as any,
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    await prisma.notice.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete notice' },
      { status: 400 }
    );
  }
}
