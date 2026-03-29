/**
 * Audit logging — fire-and-forget, never throws.
 * Records admin actions scoped to the current school.
 */

import prisma from './db';
import { getSchoolId } from './school';

export async function logAction(
  action: string,
  entity: string,
  entityId?: string,
  details?: string
): Promise<void> {
  try {
    const schoolId = await getSchoolId();
    await (prisma as any).auditLog.create({
      data: {
        schoolId,
        action,
        entity,
        entityId: entityId ?? null,
        details: details ?? null,
      },
    });
  } catch (err) {
    // Never propagate — audit logging must never break the main flow
    console.error('Audit log failed:', err);
  }
}
