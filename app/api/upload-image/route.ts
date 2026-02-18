import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSchoolSlug } from '@/lib/school';
import { uploadImage, type UploadFolder } from '@/lib/storage';

/**
 * Generic authenticated image upload endpoint.
 * Used by admin pages that need to upload images separately from form submission
 * (e.g., popups page where image URL is set before form submit).
 *
 * FormData: file (File), folder (string, optional - defaults to "popups")
 * Returns: { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schoolSlug = getSchoolSlug();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as UploadFolder) || 'popups';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const url = await uploadImage(schoolSlug, folder, file, file.name);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 400 }
    );
  }
}
