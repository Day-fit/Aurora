import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiHash, FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import React from "react";

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
                                    <label className="text-xs text-text-dark/50 uppercase font-bold tracking-wider ml-1">
                                        Company
                                    </label>
                                    <Controller
                                        control={control}
                                        name={`experience.${index}.company`}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                value={field.value ?? ""}
                                                type="text"
                                                placeholder="e.g. Google, Startup Inc."
                                                className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-text-dark/50 uppercase font-bold tracking-wider ml-1">
                                        Position
                                    </label>
                                    <Controller
                                        control={control}
                                        name={`experience.${index}.position`}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                value={field.value ?? ""}
                                                type="text"
                                                placeholder="e.g. Senior Frontend Engineer"
                                                className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-text-dark/50 uppercase font-bold tracking-wider ml-1">
                                            Start Date
                                        </label>
                                        <Controller
                                            control={control}
                                            name={`experience.${index}.startDate`}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    type="datetime-local"
                                                    className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-text-dark/50 uppercase font-bold tracking-wider ml-1">
                                            End Date
                                        </label>
                                        <Controller
                                            control={control}
                                            name={`experience.${index}.endDate`}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    type="datetime-local"
                                                    className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-text-dark/50 uppercase font-bold tracking-wider ml-1">
                                        Description
                                    </label>
                                    <Controller
                                        control={control}
                                        name={`experience.${index}.description`}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                placeholder="Summarize your main responsibilities and achievements..."
                                                className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors min-h-[100px]"
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