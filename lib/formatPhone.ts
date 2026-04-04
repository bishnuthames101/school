/**
 * Format a Nepal phone number into the 977XXXXXXXXXX format required by Fonnte API.
 *
 * Handles all real-world input variations:
 *   "9810323270"       → "9779810323270"
 *   "981-032-3270"     → "9779810323270"
 *   "+9779810323270"   → "9779810323270"
 *   "09810323270"      → "9779810323270"
 *   "977-981-0323270"  → "9779810323270"
 *   "9779810323270"    → "9779810323270"  (already correct, no change)
 */
export function formatNepalPhone(phone: string): string {
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-()]/g, '');

  // Strip leading +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }

  // Strip leading 0
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  // Prepend 977 if not already present
  if (!cleaned.startsWith('977')) {
    cleaned = '977' + cleaned;
  }

  return cleaned;
}
