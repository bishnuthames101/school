import prisma from '@/lib/db';

export interface UploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function saveUploadedFile(
  file: File,
  directory: string = 'uploads/gallery'
): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size exceeds 5MB limit' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await prisma.uploadedFile.create({
      data: {
        data: buffer,
        mimeType: file.type,
        fileName: file.name,
        size: file.size,
      },
    });

    return { success: true, filePath: `/api/files/${uploaded.id}` };
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

export async function saveDocumentFile(
  file: File,
  directory: string = 'uploads/notices'
): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG'
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size exceeds 10MB limit' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await prisma.uploadedFile.create({
      data: {
        data: buffer,
        mimeType: file.type,
        fileName: file.name,
        size: file.size,
      },
    });

    return { success: true, filePath: `/api/files/${uploaded.id}` };
  } catch (error) {
    console.error('Document upload error:', error);
    return { success: false, error: 'Failed to upload document' };
  }
}

export async function deleteUploadedFile(filePath: string): Promise<boolean> {
  try {
    // Handle new DB-backed paths: /api/files/{id}
    const match = filePath.match(/^\/api\/files\/(.+)$/);
    if (match) {
      const id = match[1];
      await prisma.uploadedFile.delete({ where: { id } });
      return true;
    }

    // Old filesystem paths (/uploads/...) - can't delete, already broken on Vercel
    return false;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
}
