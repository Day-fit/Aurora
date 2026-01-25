import React from "react";
import Input from "@/components/input";
import ArrayFieldSection from "@/components/cv-components/array-field-section";

const defaultValue = {
  company: "",
  position: "",
  startDate: "",
  endDate: null,
  description: "",
};

export default function WorkExperience() {
  return (
    <ArrayFieldSection
      name="workExperience"
      emptyMessage="You haven&apos;t added any experience yet. Click the button below to add your first role."
      addButtonText="Add experience"
      addNewButtonText="Add new experience"
      defaultValue={defaultValue}
      renderItem={(index) => (
        <>
          <div className="flex flex-col gap-1 pr-8">
            <Input
              placeholder="e.g. Google, Startup Inc."
              name={`workExperience.${index}.company`}
              label="Company"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="Position"
              name={`workExperience.${index}.position`}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              name={`workExperience.${index}.startDate`}
              label="Start Date"
              type="date"
            />
            <Input
              name={`workExperience.${index}.endDate`}
              label="End Date"
              type="date"
            />
          </div>

          <Input
            name={`workExperience.${index}.description`}
            label="Description"
            placeholder="Summarize your main responsibilities and achievements..."
            textArea={true}
          />
        </>
      )}
    />
  );
}
