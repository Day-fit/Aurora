import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiHash, FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import React from "react";
import { EducationDegree } from "@/lib/types/form";
import Input from "@/components/input";

export default function Education() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {fields.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 py-6 text-center text-text-dark/70"
            role="status"
            aria-live="polite"
          >
            <FiHash className="text-2xl" />
            <p className="max-w-xs">
              You haven&apos;t added any education yet. Click the button below to add
              your first school.
            </p>
            <Button
              type={ButtonType.button}
              onClick={() =>
                append({
                  institution: "",
                  major: "",
                  degree: EducationDegree.LOWER_SECONDARY_SCHOOL,
                  fromYear: null,
                  toYear: null,
                })
              }
              className="inline-flex items-center gap-2 bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
              text="Add education"
              icon={<FiPlus />}
            />
          </div>
        ) : (
          <>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative flex flex-col gap-3 bg-main-dark/60 border border-white/6 rounded-lg p-4 backdrop-blur-sm shadow-sm transition-colors hover:border-white/10 focus-within:border-white/20"
              >
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    type={ButtonType.button}
                    aria-label={`Remove education ${index + 1}`}
                    onClick={() => remove(index)}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-text-dark/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    icon={<FiX />}
                  />
                </div>

                <div className="flex flex-col gap-1 pr-8">
                  <Controller
                    control={control}
                    name={`education.${index}.institution`}
                    render={() => (
                      <Input
                        placeholder="e.g. Harvard University, Technical College"
                        label="Institution"
                        name={`education.${index}.institution`}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Controller
                      control={control}
                      name={`education.${index}.major`}
                      render={() => (
                        <Input
                          placeholder="e.g. Computer Science"
                          label="Major"
                          name={`education.${index}.major`}
                        />
                      )}
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
                    <Controller
                      control={control}
                      name={`education.${index}.fromYear`}
                      render={() => (
                        <Input
                          type="number"
                          placeholder="YYYY"
                          label="From Year"
                          name={`education.${index}.fromYear`}
                          options={{ valueAsNumber: true }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Controller
                      control={control}
                      name={`education.${index}.toYear`}
                      render={() => (
                        <Input
                          name={`education.${index}.toYear`}
                          label="To Year"
                          type="number"
                          placeholder="YYYY"
                          options={{ valueAsNumber: true }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-1">
              <Button
                type={ButtonType.button}
                onClick={() => {
                  if (fields.length >= 3) return;
                  {
                    /*later handle error*/
                  }

                  append({
                    institution: "",
                    major: "",
                    degree: EducationDegree.LOWER_SECONDARY_SCHOOL,
                    fromYear: null,
                    toYear: null,
                  });
                }}
                className="inline-flex items-center gap-2 bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                text="Add new education"
                icon={<FiPlus />}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
