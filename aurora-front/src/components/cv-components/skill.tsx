"use client";

import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import { FiX } from "react-icons/fi";
import { useFormContext, Controller } from "react-hook-form";
import React from "react";
import { SkillLevel } from "@/lib/types/form";
import ArrayFieldSection from "@/components/cv-components/array-field-section";

const defaultValue = { name: "", level: SkillLevel.BEGINNER };

export default function Skills() {
  const { control, getFieldState, formState } = useFormContext();

  return (
    <ArrayFieldSection
      name="skills"
      emptyMessage="You haven&apos;t added any skills yet. Click the button below to add your first skill."
      addButtonText="Add your first skill"
      addNewButtonText="Add new skill"
      defaultValue={defaultValue}
      maxItems={5}
      itemClassName="group flex flex-wrap sm:flex-nowrap items-center gap-2 bg-main-dark/60 rounded-lg px-3 py-2 backdrop-blur-sm shadow-sm transition-colors hover:border-white/10 focus-within:border-white/20"
      customRemoveButton={true}
      renderItem={(index, remove) => (
        <>
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
                  {getFieldState(`skills.${index}.name`, formState).error?.message}
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
                      {level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()}
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
        </>
      )}
    />
  );
}
