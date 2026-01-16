"use client";

import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import { FiX, FiPlus, FiHash } from "react-icons/fi";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import React from "react";
import { SkillLevel } from "@/lib/types/form";

export default function Skills() {
  const { control, getFieldState, formState } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
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
              You haven&apos;t added any skills yet. Click the button below to add
              your first skill.
            </p>
            <Button
              type={ButtonType.button}
              onClick={() => append({ name: "", level: SkillLevel.BEGINNER })}
              className="inline-flex items-center gap-2 bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
              text="Add your first skill"
              icon={<FiPlus />}
            />
          </div>
        ) : (
          <>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group flex flex-wrap sm:flex-nowrap items-center gap-2 bg-main-dark/60 border border-white/6 rounded-lg px-3 py-2 backdrop-blur-sm shadow-sm transition-colors hover:border-white/10 focus-within:border-white/20"
              >
                <Controller
                  control={control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        placeholder="e.g. Java, Spring Boot, PHP"
                        className="grow min-w-[120px] bg-transparent placeholder:text-text-dark/40 text-text-dark px-2 py-1 rounded-md border-none focus:outline-none focus:ring-0"
                      />
                      <p className="text-red-800 text-sm mt-1">
                        {
                          getFieldState(`skills.${index}.name`, formState).error
                            ?.message
                        }
                      </p>
                    </>
                  )}
                />

                <div className="flex items-center gap-2 w-full sm:w-auto sm:border-l sm:border-white/10 sm:pl-2">
                  <Controller
                    control={control}
                    name={`skills.${index}.level`}
                    render={({ field: { value, onChange, ...rest } }) => (
                      <select
                        {...rest}
                        value={String(value).toUpperCase()}
                        onChange={(e) => onChange(e.target.value)}
                        className="grow sm:grow-0 bg-transparent border-none text-sm text-text-dark/70 focus:ring-0 cursor-pointer py-1 px-2 hover:text-aurora-green-dark transition-colors"
                      >
                        {Object.values(SkillLevel).map((level) => (
                          <option
                            key={level}
                            value={level}
                            className="bg-main-dark text-text-dark"
                          >
                            {level.charAt(0).toUpperCase() +
                              level.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    )}
                  />

                  <Button
                    type={ButtonType.button}
                    aria-label={`Remove skill ${index + 1}`}
                    onClick={() => remove(index)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-text-dark/50 hover:bg-red-500/10 hover:text-red-500 transition-colors ml-auto sm:ml-0"
                    icon={<FiX />}
                  />
                </div>
              </div>
            ))}
            <div className="pt-1">
              <Button
                type={ButtonType.button}
                onClick={() => {
                  if (fields.length >= 5) return;
                  append({ name: "", level: SkillLevel.BEGINNER });
                }}
                className="inline-flex items-center gap-2 bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                text="Add new skill"
                icon={<FiPlus />}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
