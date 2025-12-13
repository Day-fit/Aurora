import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiHash, FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import React from "react";
import Input from "@/components/input";

export default function Experience() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience",
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
                        <p className="max-w-xs">You haven't added any experience yet. Click the button below to add your first role.</p>
                        <Button
                            type={ButtonType.button}
                            onClick={() =>
                                append({
                                    company: "",
                                    position: "",
                                    startDate: "",
                                    endDate: "",
                                    description: "",
                                })
                            }
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                            text="Add experience"
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

                                <div className="flex flex-col gap-1 pr-8">
                                    <Controller
                                        control={control}
                                        name={`experience.${index}.company`}
                                        render={() => (
                                            <Input
                                                placeholder="e.g. Google, Startup Inc."
                                                name={`experience.${index}.company`}
                                                label="Company"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Controller
                                        control={control}
                                        name={`experience.${index}.position`}
                                        render={() => (
                                            <Input
                                                label="Position"
                                                name={`experience.${index}.position`}
                                                placeholder="e.g. Senior Frontend Engineer"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Controller
                                            control={control}
                                            name={`experience.${index}.startDate`}
                                            render={() => (
                                                <Input
                                                    name={`experience.${index}.startDate`}
                                                    label="Start Date"
                                                    placeholder="e.g. 2021-01-01"
                                                    type="datetime-local"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Controller
                                            control={control}
                                            name={`experience.${index}.endDate`}
                                            render={() => (
                                                <Input
                                                    name={`experience.${index}.endDate`}
                                                    label="End Date"
                                                    placeholder="e.g. 2023-01-01"
                                                    type="datetime-local"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Controller
                                        control={control}
                                        name={`experience.${index}.description`}
                                        render={() => (
                                            <Input
                                                name={`experience.${index}.description`}
                                                label="Description"
                                                placeholder="Summarize your main responsibilities and achievements..."
                                                textArea={true}
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
                                        company: "",
                                        position: "",
                                        startDate: "",
                                        endDate: "",
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