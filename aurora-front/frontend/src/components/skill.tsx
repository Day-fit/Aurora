"use client";

import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import { FiX, FiPlus, FiHash } from "react-icons/fi";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import React from "react";

export default function Skills() {


    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills",
    });

    return (
        <div className="w-full">
            <label className="text-left mb-1 font-bold">Skills</label>
            <div className="flex flex-col gap-3">
                <div
                    className={
                        "flex flex-col gap-2 " +
                        "border border-white/10 rounded-xl p-6 " +
                        "focus-within:border-white/20 focus-within:ring-2 focus-within:ring-aurora-green-dark/75 " +
                        "focus-within:shadow-lg transition"
                    }
                >
                    {fields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center text-text-dark/70" role="status" aria-live="polite">
                            <FiHash className="text-2xl" />
                            <p className="max-w-xs">You haven't added any skills yet. Click the button below to add your first skill.</p>
                            <Button
                                type={ButtonType.button}
                                onClick={() => append({ value: "" })}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                                text="Add your first skill"
                                icon={<FiPlus />}
                            />
                        </div>
                    ) : (
                        <>
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-center gap-3 bg-main-dark/60 border border-white/6 rounded-lg px-3 py-2 backdrop-blur-sm shadow-sm"
                                >
                                    <Controller
                                        control={control}
                                        name={`skills.${index}.value`}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                placeholder="e.g. Java, Spring Boot, PHP"
                                                className="flex-1 bg-transparent placeholder:text-text-dark/60 px-3 py-2 rounded-md border border-transparent focus:outline-none focus:ring-0 focus:border-transparent"
                                            />
                                        )}
                                    />

                                    <Button
                                        type={ButtonType.button}
                                        aria-label={`Remove skill ${index + 1}`}
                                        onClick={() => remove(index)}
                                        className="flex items-center justify-center w-9 h-9 rounded-full text-text-dark/80 bg-white/3 hover:bg-red-600 hover:text-white transition"
                                        icon={<FiX />}
                                    />
                                </div>
                            ))}
                            <div className="pt-1">
                                <Button
                                    type={ButtonType.button}
                                    onClick={() => append({ value: "" })}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                                    text="Add new skill"
                                    icon={<FiPlus />}
                                />
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
