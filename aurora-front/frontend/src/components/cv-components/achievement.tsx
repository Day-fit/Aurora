import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiHash, FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import React from "react";
import Input from "@/components/input";

export default function Achievement() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "achievements",
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
                        <p className="max-w-xs">You haven't added any achievements yet. Click the button below.</p>
                        <Button
                            type={ButtonType.button}
                            onClick={() =>
                                append({
                                    title: "",
                                    year: null,
                                    description: "",
                                })
                            }
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                            text="Add achievement"
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
                                        aria-label={`Remove achievement ${index + 1}`}
                                        onClick={() => remove(index)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full text-text-dark/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                        icon={<FiX />}
                                    />
                                </div>

                                {/* Title */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1 pr-8">
                                        <Controller
                                            control={control}
                                            name={`achievements.${index}.title`}
                                            render={() => (
                                                <Input
                                                    label="Title"
                                                    name={`achievements.${index}.title`}
                                                    placeholder="Achievement title"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Year + Description */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Controller
                                            control={control}
                                            name={`achievements.${index}.year`}
                                            render={() => (
                                                <Input
                                                    label="Year"
                                                    name={`achievements.${index}.year`}
                                                    options={{ valueAsNumber: true }}
                                                    placeholder="Year"
                                                    type="number"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Controller
                                            control={control}
                                            name={`achievements.${index}.description`}
                                            render={() => (
                                                <Input
                                                    label="Description"
                                                    name={`achievements.${index}.description`}
                                                    placeholder="Description"
                                                    textArea={true}
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
                                onClick={() =>
                                    append({
                                        title: "",
                                        year: null,
                                        description: "",
                                    })
                                }
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                                text="Add new achievement"
                                icon={<FiPlus />}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

