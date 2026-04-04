import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scopedPrisma } from '@/lib/db-scoped';

export const dynamic = 'force-dynamic';

interface FonnteResult {
  parentId: string;
  success: boolean;
}

// POST send WhatsApp notification to parents via Fonnte (requires auth)
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
    const { message, messageType, classId } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (!messageType) {
      return NextResponse.json(
        { success: false, error: 'Message type is required' },
        { status: 400 }
      );
    }

    const fonnteApiKey = process.env.FONNTE_API_KEY;
    if (!fonnteApiKey || fonnteApiKey === 'your_fonnte_api_key_here') {
      return NextResponse.json(
        { success: false, error: 'Fonnte API key is not configured' },
        { status: 500 }
      );
    }

    const db = await scopedPrisma();

    // Fetch active parents, filtered by class if provided
    const where: any = { isActive: true };
    if (classId) {
      where.classId = classId;
    }

    const parents = await db.parent.findMany({ where });

    if (parents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active parents found for the selected filter' },
        { status: 400 }
      );
    }

    // Send to all parents via Fonnte — use Promise.allSettled so one failure doesn't stop others
    const sendResults = await Promise.allSettled(
      parents.map(async (parent: any): Promise<FonnteResult> => {
        const formBody = new URLSearchParams();
        formBody.append('target', parent.phone);
        formBody.append('message', message.trim());

        console.log(`[Fonnte] Sending to phone: ${parent.phone}`);

        const res = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            Authorization: fonnteApiKey,
          },
          body: formBody,
        });

        const data = await res.json();
        console.log(`[Fonnte] Response for ${parent.phone}:`, JSON.stringify(data));

        // Fonnte returns { status: true } on success
        if (!res.ok || !data.status) {
          throw new Error(data.reason || data.message || 'Send failed');
        }

        return { parentId: parent.id, success: true };
      })
    );

    const totalSent = sendResults.filter((r) => r.status === 'fulfilled').length;
    const totalFailed = sendResults.filter((r) => r.status === 'rejected').length;

    // Log failed sends for debugging
    sendResults.forEach((result, i) => {
      if (result.status === 'rejected') {
        const p = parents[i];
        console.error(`Failed to send to parent ${p.id} (phone: ${p.phone}):`, result.reason);
      }
    });

    // Save notification log to DB
    await db.notificationMessage.create({
      data: {
        message: message.trim(),
        messageType,
        sentToClassId: classId || null,
        totalSent,
        totalDelivered: 0, // Fonnte delivery receipts handled separately
      },
    });

    return NextResponse.json({ success: true, totalSent, totalFailed });
  } catch (error: any) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
