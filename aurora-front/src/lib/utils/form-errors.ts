import { FieldErrors } from "react-hook-form";

/**
 * Check if a specific array field entry has validation errors.
 * Used by form array components (workExperience, education, skills, etc.)
 * to determine if a specific row should be highlighted with error styling.
 *
 * @param errors - The errors object from useFormContext
 * @param fieldName - The name of the array field (e.g., "workExperience", "education")
 * @param index - The index of the entry to check
 * @returns true if the entry has validation errors, false otherwise
 */
export function hasArrayFieldEntryErrors(
  errors: FieldErrors,
  fieldName: string,
  index: number,
): boolean {
  const fieldErrors = errors[fieldName] as
    | Array<Record<string, unknown>>
    | undefined;
  return !!(fieldErrors && fieldErrors[index]);
}
