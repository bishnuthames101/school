import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - Fetch popups (use ?all=true for admin to get all popups)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    if (all === 'true') {
      // Admin: return all popups
      const popups = await prisma.popup.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return NextResponse.json(popups);
    }

    // Public: return only active popups within date range
    const now = new Date();

    const popups = await prisma.popup.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(popups);
  } catch (error) {
    console.error('Error fetching popups:', error);
    return NextResponse.json({ error: 'Failed to fetch popups' }, { status: 500 });
  }
}

// POST - Create new popup
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, imageUrl, linkUrl, startDate, endDate, isActive } = body;

    const popup = await prisma.popup.create({
      data: {
        title,
        imageUrl,
        linkUrl: linkUrl || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(popup, { status: 201 });
  } catch (error) {
    console.error('Error creating popup:', error);
    return NextResponse.json({ error: 'Failed to create popup' }, { status: 500 });
  }
}
