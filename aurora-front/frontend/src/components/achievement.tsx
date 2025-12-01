import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FiHash, FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import React from "react";
import { EducationDegree } from "@/lib/types/form";

export default function Achievement() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "achievements",
    });

    return (
        <div className="w-full">
            <label className="text-left mb-1 font-bold">Education</label>
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
                        <div
                            className="flex flex-col items-center justify-center gap-3 py-6 text-center text-text-dark/70"
                            role="status"
                            aria-live="polite"
                        >
                            <FiHash className="text-2xl" />
                            <p className="max-w-xs">You haven't added any education yet. Click the button below to add your first school.</p>
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
                                            aria-label={`Remove education ${index + 1}`}
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
                                            name={`education.${index}.company`}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Company"
                                                    className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-text-dark/50 uppercase font-bold tracking-wider ml-1">
                                                Position
                                            </label>
                                            <Controller
                                                control={control}
                                                name={`education.${index}.position`}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Position"
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
                                                name={`education.${index}.description`}
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        placeholder="Description"
                                                        className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors"
                                                    ></textarea>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-text-dark/50 uppercase font-bold tracking-wider ml-1">
                                                Start Date
                                            </label>
                                            <Controller
                                                control={control}
                                                name={`education.${index}.startDate`}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        type="datetime-local"
                                                        placeholder="Start Date"
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
                                                name={`education.${index}.endDate`}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        type="datetime-local"
                                                        placeholder="End Date"
                                                        className="w-full bg-transparent placeholder:text-text-dark/40 text-text-dark px-3 py-2 rounded-md border border-white/5 focus:border-white/20 focus:outline-none focus:ring-0 transition-colors"
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
                                    text="Add new education"
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
