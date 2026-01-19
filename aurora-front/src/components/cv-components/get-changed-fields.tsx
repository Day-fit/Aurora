import { fileToBase64 } from "@/lib/utils/image";

export async function getChangedFields(
  originalData: any,
  newData: any,
): Promise<any> {
  const changes: any = {};

  // Handle simple fields
  const simpleFields = [
    "name",
    "surname",
    "title",
    "email",
    "website",
    "linkedIn",
    "gitHub",
    "profileDescription",
    "templateVersion",
    "language",
  ];

  for (const field of simpleFields) {
    if (originalData?.[field] !== newData?.[field]) {
      changes[field] = newData[field];
    }
  }

  // Handle profileImage specially
  if (newData.profileImage instanceof File) {
    // Convert File to base64 for comparison and submission
    const newImageBase64 = await fileToBase64(newData.profileImage);
    if (originalData?.profileImage !== newImageBase64) {
      changes.profileImage = newImageBase64;
    }
  } else if (newData.profileImage === null && originalData?.profileImage) {
    changes.profileImage = null;
  }

  // Handle arrays (workExperience, achievements, skills, education, personalPortfolio)
  const arrayFields = [
    "workExperience",
    "achievements",
    "skills",
    "education",
    "personalPortfolio",
  ];

  for (const field of arrayFields) {
    const originalArray = originalData?.[field] || [];
    const newArray = newData?.[field] || [];

    if (JSON.stringify(originalArray) !== JSON.stringify(newArray)) {
      changes[field] = newArray;
    }
  }

  return changes;
}
