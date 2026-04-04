import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { formatNepalPhone } from '@/lib/formatPhone';

export const dynamic = 'force-dynamic';

// GET all parents for this school (with class info) — requires auth (PII data)
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await scopedPrisma();

    const parents = await db.parent.findMany({
      include: { class: true },
      orderBy: [{ classId: 'asc' }, { studentName: 'asc' }],
    } as any);

    return NextResponse.json({ success: true, data: parents });
  } catch (error) {
    console.error('Error fetching parents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch parents' },
      { status: 500 }
    );
  }
}

// POST create a new parent (requires auth)
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
    const { studentName, parentName, phone, classId } = body;

    if (!studentName?.trim() || !parentName?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Student name, parent name, and phone are required' },
        { status: 400 }
      );
    }

    const db = await scopedPrisma();

    const parent = await db.parent.create({
      data: {
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        phone: formatNepalPhone(phone.trim()),
        classId: classId || null,
      },
    });

    return NextResponse.json({ success: true, data: parent }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating parent:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create parent' },
      { status: 400 }
    );
  }
}
