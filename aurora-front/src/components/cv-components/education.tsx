import { Controller, useFormContext } from "react-hook-form";
import React from "react";
import { EducationDegree } from "@/lib/types/form";
import Input from "@/components/input";
import ArrayFieldSection from "@/components/cv-components/array-field-section";

const defaultValue = {
  institution: "",
  major: "",
  degree: EducationDegree.LOWER_SECONDARY_SCHOOL,
  fromYear: null,
  toYear: null,
};

export default function Education() {
  const { control } = useFormContext();

  return (
    <ArrayFieldSection
      name="education"
      emptyMessage="You haven&apos;t added any education yet. Click the button below to add your first school."
      addButtonText="Add education"
      addNewButtonText="Add new education"
      defaultValue={defaultValue}
      maxItems={3}
      renderItem={(index) => (
        <>
          <div className="flex flex-col gap-1 pr-8">
            <Input
              placeholder="e.g. Harvard University, Technical College"
              label="Institution"
              name={`education.${index}.institution`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="e.g. Computer Science"
                label="Major"
                name={`education.${index}.major`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Controller
                control={control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition cursor-pointer  "
                  >
                    {Object.values(EducationDegree).map((degree) => (
                      <option
                        key={degree}
                        value={degree}
                        className="bg-main-dark text-text-dark"
                      >
                        {degree
                          .split("_")
                          .map(
                            (w) =>
                              w.charAt(0).toUpperCase() +
                              w.slice(1).toLowerCase(),
                          )
                          .join(" ")}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                type="number"
                placeholder="YYYY"
                label="From Year"
                name={`education.${index}.fromYear`}
                options={{ valueAsNumber: true }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                name={`education.${index}.toYear`}
                label="To Year"
                type="number"
                placeholder="YYYY"
                options={{ valueAsNumber: true }}
              />
            </div>
          </div>
        </>
      )}
    />
  );
}
