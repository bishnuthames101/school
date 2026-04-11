import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { formatNepalPhone } from '@/lib/formatPhone';

export const dynamic = 'force-dynamic';

// PUT update a parent (requires auth)
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
    const { studentName, parentName, phone, classId } = body;

    if (!studentName?.trim() || !parentName?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Student name, parent name, and phone are required' },
        { status: 400 }
      );
    }

    const db = await scopedPrisma();

    const parent = await db.parent.update({
      where: { id: params.id },
      data: {
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        phone: formatNepalPhone(phone.trim()),
        classId: classId || null,
      },
    });

    return NextResponse.json({ success: true, data: parent });
  } catch (error: any) {
    console.error('Error updating parent:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Parent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update parent' },
      { status: 400 }
    );
  }
}

// DELETE — soft delete: set isActive = false (requires auth)
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

    const db = await scopedPrisma();

    const parent = await db.parent.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, data: parent });
  } catch (error: any) {
    console.error('Error deactivating parent:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Parent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to deactivate parent' },
      { status: 500 }
    );
  }
}
