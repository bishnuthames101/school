/**
 * Scoped database layer — automatically injects schoolId into all queries.
 * This is the critical tenant isolation safety layer.
 *
 * Usage:
 *   const db = await scopedPrisma();
 *   const events = await db.event.findMany();           // auto-filtered by schoolId
 *   const event = await db.event.create({ data: {...} }); // auto-injects schoolId
 */

import prisma from "./db";
import { getSchoolId } from "./school";

function createScopedModel<T extends string>(model: T, schoolId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prismaModel = (prisma as any)[model];

  return {
    findMany: (args?: any) =>
      prismaModel.findMany({
        ...args,
        where: { ...args?.where, schoolId },
      }),

    findFirst: (args?: any) =>
      prismaModel.findFirst({
        ...args,
        where: { ...args?.where, schoolId },
      }),

    findUnique: (args: any) =>
      prismaModel.findUnique(args).then((result: any) => {
        if (result && result.schoolId !== schoolId) return null;
        return result;
      }),

    count: (args?: any) =>
      prismaModel.count({
        ...args,
        where: { ...args?.where, schoolId },
      }),

    create: (args: any) =>
      prismaModel.create({
        ...args,
        data: { ...args.data, schoolId },
      }),

    update: (args: any) =>
      // Verify ownership before update
      prismaModel.findUnique({ where: args.where }).then((existing: any) => {
        if (!existing || existing.schoolId !== schoolId) {
          throw new Error(`Record not found or access denied`);
        }
        return prismaModel.update(args);
      }),

    delete: (args: any) =>
      // Verify ownership before delete
      prismaModel.findUnique({ where: args.where }).then((existing: any) => {
        if (!existing || existing.schoolId !== schoolId) {
          throw new Error(`Record not found or access denied`);
        }
        return prismaModel.delete(args);
      }),

    deleteMany: (args?: any) =>
      prismaModel.deleteMany({
        ...args,
        where: { ...args?.where, schoolId },
      }),

    updateMany: (args: any) =>
      prismaModel.updateMany({
        ...args,
        where: { ...args?.where, schoolId },
      }),
  };
}

export async function scopedPrisma() {
  const schoolId = await getSchoolId();

  return {
    schoolId,

    event: createScopedModel("event", schoolId),
    notice: createScopedModel("notice", schoolId),
    galleryImage: createScopedModel("galleryImage", schoolId),
    popup: createScopedModel("popup", schoolId),
    applicationForm: createScopedModel("applicationForm", schoolId),
    contactForm: createScopedModel("contactForm", schoolId),
    admin: createScopedModel("admin", schoolId),
  };
}
