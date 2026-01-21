import Input from "@/components/input";
import React from "react";
import ArrayFieldSection from "@/components/cv-components/array-field-section";

const defaultValue = {
  name: "",
  description: "",
};

export default function PersonalPortfolio() {
  return (
    <ArrayFieldSection
      name="personalPortfolio"
      emptyMessage="You haven&apos;t added any personal portfolio yet. Click the button below to add your first role."
      addButtonText="Add your portfolio"
      addNewButtonText="Add new experience"
      defaultValue={defaultValue}
      renderItem={(index) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                name={`personalPortfolio.${index}.name`}
                label="Name"
                placeholder="e.g. Personal Portfolio"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Input
              textArea={true}
              label="Description"
              name={`personalPortfolio.${index}.description`}
              placeholder="Describe your personal portfolio..."
            />
          </div>
        </>
      )}
    />
  );
}
