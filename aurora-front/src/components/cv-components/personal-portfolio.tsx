import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiHash, FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import Input from "@/components/input";
import React from "react";

export default function PersonalPortfolio() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "personalPortfolio",
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
              You haven't added any personal portfolio yet. Click the button
              below to add your first role.
            </p>
            <Button
              type={ButtonType.button}
              onClick={() =>
                append({
                  name: "",
                  description: "",
                })
              }
              className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
              text="Add your portfolio"
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
                    aria-label={`Remove experience ${index + 1}`}
                    onClick={() => remove(index)}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-text-dark/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    icon={<FiX />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Controller
                      control={control}
                      name={`personalPortfolio.${index}.name`}
                      render={() => (
                        <Input
                          name={`personalPortfolio.${index}.name`}
                          label="Name"
                          placeholder="e.g. Personal Portfolio"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Controller
                    control={control}
                    name={`personalPortfolio.${index}.description`}
                    render={() => (
                      <Input
                        textArea={true}
                        label="Description"
                        name={`personalPortfolio.${index}.description`}
                        placeholder="Describe your personal portfolio..."
                      />
                    )}
                  />
                </div>
              </div>
            ))}
            <div className="pt-1">
              <Button
                type={ButtonType.button}
                onClick={() =>
                  append({
                    name: "",
                    description: "",
                  })
                }
                className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                text="Add new experience"
                icon={<FiPlus />}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
