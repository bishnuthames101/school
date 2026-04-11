import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';
import { sendApplicationNotification } from '@/lib/email';
import { logAction } from '@/lib/audit';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// 5 submissions per IP per hour — prevents spam while allowing legitimate re-submissions
const rateLimiter = createRateLimiter(5, 60 * 60 * 1000);

// GET all applications with pagination (requires auth)
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

    const total = await db.applicationForm.count();

    const applications = await db.applicationForm.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST new application (public — from admission form)
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
    const {
      studentNameEn, studentNameNp,
      dobAD, dobBS,
      gender, nationality, gradeApplying, photo,
      fatherName, fatherPhone, fatherOccupation,
      motherName, motherPhone, motherOccupation,
      province, district, municipality, wardNo, tole,
      previousSchool, previousClass,
      email, phone, message,
    } = body;

    // --- Required field validation ---
    const errors: string[] = [];

    if (!studentNameEn?.trim())  errors.push('Student name (English) is required');
    if (!dobAD)                  errors.push('Date of birth is required');
    if (!gender?.trim())         errors.push('Gender is required');
    if (!gradeApplying?.trim())  errors.push('Grade applying for is required');
    if (!fatherName?.trim())     errors.push("Father's name is required");
    if (!fatherPhone?.trim())    errors.push("Father's phone number is required");
    if (!motherName?.trim())     errors.push("Mother's name is required");
    if (!province?.trim())       errors.push('Province is required');
    if (!district?.trim())       errors.push('District is required');
    if (!municipality?.trim())   errors.push('Municipality is required');
    if (!wardNo?.trim())         errors.push('Ward number is required');
    if (!phone?.trim())          errors.push('Phone number is required');

    if (!email?.trim()) {
      errors.push('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('Invalid email address format');
    }

    // Validate dobAD is a parseable date
    if (dobAD && isNaN(new Date(dobAD).getTime())) {
      errors.push('Invalid date of birth');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors[0] },
        { status: 400 }
      );
    }

    // Build the data object with only known, validated fields.
    // status is intentionally excluded — it defaults to "pending" in the schema.
    // schoolId is injected automatically by scopedPrisma.
    const application = await db.applicationForm.create({
      data: {
        studentNameEn:    studentNameEn.trim(),
        studentNameNp:    studentNameNp?.trim()    || null,
        dobAD:            new Date(dobAD),
        dobBS:            dobBS?.trim()            || null,
        gender:           gender.trim(),
        nationality:      nationality?.trim()      || 'Nepali',
        gradeApplying:    gradeApplying.trim(),
        photo:            photo?.trim()            || null,
        fatherName:       fatherName.trim(),
        fatherPhone:      fatherPhone.trim(),
        fatherOccupation: fatherOccupation?.trim() || null,
        motherName:       motherName.trim(),
        motherPhone:      motherPhone?.trim()      || null,
        motherOccupation: motherOccupation?.trim() || null,
        province:         province.trim(),
        district:         district.trim(),
        municipality:     municipality.trim(),
        wardNo:           wardNo.trim(),
        tole:             tole?.trim()             || null,
        previousSchool:   previousSchool?.trim()   || null,
        previousClass:    previousClass?.trim()    || null,
        email:            email.trim().toLowerCase(),
        phone:            phone.trim(),
        message:          message?.trim()          || null,
      },
    });

    // Fire-and-forget: email notification + audit log
    sendApplicationNotification({
      studentNameEn: application.studentNameEn,
      gradeApplying: application.gradeApplying,
      email: application.email,
      phone: application.phone,
      fatherName: application.fatherName,
      fatherPhone: application.fatherPhone,
    });
    logAction('CREATE', 'Application', application.id, `${application.studentNameEn} → ${application.gradeApplying}`);

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
