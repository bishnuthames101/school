import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';

// GET all classes for this school
export async function GET() {
  try {
    const db = await scopedPrisma();

    const classes = await db.schoolClass.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

// POST create a new class (requires auth)
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, section } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Class name is required' },
        { status: 400 }
      );
    }

    const db = await scopedPrisma();

    const schoolClass = await db.schoolClass.create({
      data: {
        name: name.trim(),
        section: section?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, data: schoolClass }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create class' },
      { status: 400 }
    );
  }
}
