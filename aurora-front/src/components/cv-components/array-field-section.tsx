"use client";

import { useFieldArray, useFormContext, FieldValues } from "react-hook-form";
import { FiHash, FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import React from "react";
import { hasArrayFieldEntryErrors } from "@/lib/utils/form-errors";

interface ArrayFieldSectionProps<T extends FieldValues> {
  name: string;
  emptyMessage: string;
  addButtonText: string;
  addNewButtonText: string;
  defaultValue: T;
  maxItems?: number;
  renderItem: (index: number, remove: (index: number) => void) => React.ReactNode;
  /** Custom class for each item container. Defaults to card style. */
  itemClassName?: string;
  /** If true, the remove button is not rendered by ArrayFieldSection (renderItem handles it). */
  customRemoveButton?: boolean;
}

export default function ArrayFieldSection<T extends FieldValues>({
  name,
  emptyMessage,
  addButtonText,
  addNewButtonText,
  defaultValue,
  maxItems,
  renderItem,
  itemClassName,
  customRemoveButton = false,
}: ArrayFieldSectionProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleAdd = () => {
    if (maxItems && fields.length >= maxItems) return;
    append(defaultValue);
  };

  const addButton = (
    <Button
      type={ButtonType.button}
      onClick={handleAdd}
      className="inline-flex items-center gap-2 bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
      text={fields.length === 0 ? addButtonText : addNewButtonText}
      icon={<FiPlus />}
    />
  );

  if (fields.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-3">
          <div
            className="flex flex-col items-center justify-center gap-3 py-6 text-center text-text-dark/70"
            role="status"
            aria-live="polite"
          >
            <FiHash className="text-2xl" />
            <p className="max-w-xs">{emptyMessage}</p>
            {addButton}
          </div>
        </div>
      </div>
    );
  }

  const defaultItemClass = `relative flex flex-col gap-3 bg-main-dark/60 rounded-lg p-4 backdrop-blur-sm shadow-sm transition-colors hover:border-white/10 focus-within:border-white/20`;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={`${itemClassName || defaultItemClass} ${
              hasArrayFieldEntryErrors(errors, name, index)
                ? "border-2 border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                : "border border-white/6"
            }`}
          >
            {!customRemoveButton && (
              <div className="absolute top-3 right-3 z-10">
                <Button
                  type={ButtonType.button}
                  aria-label={`Remove ${name} ${index + 1}`}
                  onClick={() => remove(index)}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-text-dark/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  icon={<FiX />}
                />
              </div>
            )}
            {renderItem(index, remove)}
          </div>
        ))}
        <div className="pt-1">{addButton}</div>
      </div>
    </div>
  );
}
