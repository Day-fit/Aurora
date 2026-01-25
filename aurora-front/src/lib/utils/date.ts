/**
 * Date utility functions for handling date conversions between
 * ISO 8601 format and HTML date input format.
 */

/**
 * Convert ISO 8601 date (e.g., "2024-01-15T00:00:00Z") to date input format (YYYY-MM-DD)
 * @param isoDate - The ISO 8601 date string or null/undefined
 * @returns The date in YYYY-MM-DD format or empty string
 */
export function isoToDateInput(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  try {
    // Extract just the date part from ISO format
    const match = isoDate.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}
