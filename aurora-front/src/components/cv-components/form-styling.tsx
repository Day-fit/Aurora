// aurora-front/src/components/cv-components/form-styling.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "@/components/input";
import { TemplateType } from "@/lib/types/form";
import { LANGUAGE_LABELS, COMMON_LANGUAGES } from "@/lib/types/language";

export default function FormStyling() {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <Input
          name="title"
          label="Title"
          type="text"
          placeholder="Your CV title"
        />
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded">
            Template
          </label>
          <Controller
            control={control}
            name="templateVersion"
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition cursor-pointer"
              >
                {Object.entries(TemplateType)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <option
                      key={key}
                      value={value}
                      className="bg-main-dark text-text-dark"
                    >
                      Template {value}
                    </option>
                  ))}
              </select>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded">
            Template Language
          </label>
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <select
                {...field}
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition cursor-pointer"
              >
                {COMMON_LANGUAGES.map((lang) => (
                  <option
                    key={lang}
                    value={lang}
                    className="bg-main-dark text-text-dark"
                  >
                    {LANGUAGE_LABELS[lang]}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
