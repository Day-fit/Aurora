import React from "react";
import Input from "@/components/input";
import ArrayFieldSection from "@/components/cv-components/array-field-section";

const defaultValue = {
  title: "",
  year: null,
  description: "",
};

export default function Achievement() {
  return (
    <ArrayFieldSection
      name="achievements"
      emptyMessage="You haven&apos;t added any achievements yet. Click the button below."
      addButtonText="Add achievement"
      addNewButtonText="Add new achievement"
      defaultValue={defaultValue}
      renderItem={(index) => (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 pr-8">
              <Input
                label="Title"
                name={`achievements.${index}.title`}
                placeholder="Achievement title"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                label="Year"
                name={`achievements.${index}.year`}
                options={{ valueAsNumber: true }}
                placeholder="Year"
                type="number"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Description"
                name={`achievements.${index}.description`}
                placeholder="Description"
                textArea={true}
              />
            </div>
          </div>
        </>
      )}
    />
  );
}
