/**
 * Converts a base64 string to a data URL that can be used in img src or Next.js Image component
 * @param base64String - The base64 encoded image string (with or without data URL prefix)
 * @param mimeType - The MIME type of the image (default: image/png)
 * @returns A complete data URL string, or null if input is invalid
 */
export function base64ToDataUrl(
  base64String: string | undefined | null,
  mimeType: string = "image/png",
): string | null {
  if (!base64String) {
    return null;
  }

  // If already a data URL, return as is
  if (base64String.startsWith("data:")) {
    return base64String;
  }

  // If it's a blob URL, return as is
  if (base64String.startsWith("blob:")) {
    return base64String;
  }

  // If it's a regular URL, return as is
  if (base64String.startsWith("http") || base64String.startsWith("/")) {
    return base64String;
  }

  // Otherwise, assume it's a raw base64 string and prepend the data URL prefix
  return `data:${mimeType};base64,${base64String}`;
}

/**
 * Converts a base64 string to a Blob object
 * @param base64String - The base64 encoded image string
 * @param mimeType - The MIME type of the image (default: image/png)
 * @returns A Blob object, or null if conversion fails
 */
export function base64ToBlob(
  base64String: string,
  mimeType: string = "image/png",
): Blob | null {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Decode base64
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  } catch (error) {
    console.error("Failed to convert base64 to blob:", error);
    return null;
  }
}

/**
 * Converts a File object to a base64 string without the Data URL prefix
 * @param file - The File object to convert
 * @returns A Promise that resolves to the raw base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Split the string at the comma and take the second part (the raw base64)
      const base64Data = result.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
}
