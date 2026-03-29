/**
 * Email notifications via Resend.
 * FROM domain: tomorrowstech.com.np (verified in Resend)
 * TO: ADMIN_NOTIFICATION_EMAIL env var (per-school in each Vercel deployment)
 *
 * All functions are fire-and-forget — they never throw.
 */

import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@tomorrowstech.com.np';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) return;

  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `New Contact Message: ${contact.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;">From</td><td style="padding: 8px 0; font-weight: 600;">${contact.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${contact.email}" style="color: #2563eb;">${contact.email}</a></td></tr>
            ${contact.phone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;">${contact.phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #6b7280;">Subject</td><td style="padding: 8px 0; font-weight: 600;">${contact.subject}</td></tr>
          </table>
          <div style="background: #f9fafb; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap; color: #374151;">${contact.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">
            Reply directly to the sender: <a href="mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}" style="color: #2563eb;">Reply via email</a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send contact notification:', err);
  }
}

export async function sendApplicationNotification(app: {
  studentNameEn: string;
  gradeApplying: string;
  email: string;
  phone: string;
  fatherName: string;
  fatherPhone: string;
}): Promise<void> {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) return;

  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `New Admission Application: ${app.studentNameEn} (${app.gradeApplying})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Admission Application</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 160px;">Student Name</td><td style="padding: 8px 0; font-weight: 600;">${app.studentNameEn}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Grade Applying</td><td style="padding: 8px 0;">${app.gradeApplying}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Contact Email</td><td style="padding: 8px 0;"><a href="mailto:${app.email}" style="color: #2563eb;">${app.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Contact Phone</td><td style="padding: 8px 0;">${app.phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Father's Name</td><td style="padding: 8px 0;">${app.fatherName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Father's Phone</td><td style="padding: 8px 0;">${app.fatherPhone}</td></tr>
          </table>
          <a href="/admin/dashboard/applications" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            View in Admin Panel
          </a>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send application notification:', err);
  }
}
