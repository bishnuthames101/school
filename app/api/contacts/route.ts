import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { sendContactNotification } from '@/lib/email';
import { logAction } from '@/lib/audit';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// 10 submissions per IP per hour
const rateLimiter = createRateLimiter(10, 60 * 60 * 1000);

// GET all contacts with pagination (requires auth)
export async function GET(request: NextRequest) {
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '10')), 100);
    const skip = (page - 1) * limit;

    const total = await db.contactForm.count();

    const contacts = await db.contactForm.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST new contact (public — from contact form)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = rateLimiter(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    const db = await scopedPrisma();
    const body = await request.json();

    // Destructure only known fields — unknown/injected fields are dropped entirely
    const { name, email, phone, subject, message } = body;

    // --- Required field validation ---
    const errors: string[] = [];

    if (!name?.trim())    errors.push('Name is required');
    if (!subject?.trim()) errors.push('Subject is required');
    if (!message?.trim()) errors.push('Message is required');

    if (!email?.trim()) {
      errors.push('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('Invalid email address format');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors[0] },
        { status: 400 }
      );
    }

    // Build data object with only known, validated fields.
    // status is intentionally excluded — it defaults to "unread" in the schema.
    // schoolId is injected automatically by scopedPrisma.
    const contact = await db.contactForm.create({
      data: {
        name:    name.trim(),
        email:   email.trim().toLowerCase(),
        phone:   phone?.trim() || '',
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // Fire-and-forget: email notification + audit log
    sendContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || undefined,
      subject: contact.subject,
      message: contact.message,
    });
    logAction('CREATE', 'Contact', contact.id, contact.subject);

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit message. Please try again.' },
      { status: 500 }
    );
  }
}

// PUT update contact status (requires auth)
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const contact = await db.contactForm.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: contact });
  } catch (error: any) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 400 }
    );
  }
}

// DELETE contact message (requires auth)
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await scopedPrisma();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    await db.contactForm.delete({ where: { id } });

    logAction('DELETE', 'Contact', id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 400 }
    );
  }
}
