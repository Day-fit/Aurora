export interface ChangedFieldsResult {
  changes: any;
  profileImageChanged: boolean;
}

export async function getChangedFields(
  originalData: any,
  newData: any,
): Promise<ChangedFieldsResult> {
  const changes: any = {};
  let profileImageChanged = false;

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

  // Handle profileImage specially - check if it changed but don't include in changes
  // The File object will be passed separately as multipart
  if (newData.profileImage instanceof File) {
    // A new file was selected, so it's always considered changed
    profileImageChanged = true;
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

  return { changes, profileImageChanged };
}
