"use client";

import Button from "@/components/button";
import { type } from "@/lib/types/button";
import Skills from "@/components/skill";
import Input from "@/components/input";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function CvForm() {
    //need to add validation, error handling, submit handling via request

    const { register, handleSubmit, reset } = useFormContext();

    const onSubmit = (data: any) => console.log(data);

    console.log("CvForm render");

    return (
        <section className="relative overflow-hidden rounded-xl p-6 lg:p-10 min-h-[60vh]">
            <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-6 md:p-12 flex flex-col md:flex-row gap-8 items-start text-text-dark shadow-2xl">
                {/* Left: form (takes left half on md+) */}
                <div className="w-full">
                    <header className="mb-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark">
                            Create your CV
                        </h2>
                        <p className="text-sm text-text-dark/70 mt-2 max-w-prose">
                            Fill the form on the left. AI tips and a live preview are on the right.
                        </p>
                    </header>

                    <form
                        className="w-full flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="relative">
                                <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded">
                                    Template
                                </label>
                                <select
                                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                                    {...register("template", { required: true })}
                                >
                                    <option value="1">Template 1</option>
                                    <option value="2">Template 2</option>
                                    <option value="3">Template 3</option>
                                    <option value="4">Template 4</option>
                                    <option value="5">Template 5</option>
                                </select>
                            </div>

                            <div className="relative">
                                <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded">
                                    Photo
                                </label>
                                <input
                                    type="file"
                                    {...register("photo")}
                                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-green-dark transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                label="Name"
                                type="text"
                                name="name"
                                placeholder="First name"
                                className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-green-dark transition"
                            />

                            <Input
                                label="Surname"
                                type="text"
                                name="surname"
                                placeholder="Last name"
                                className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                label="Age"
                                type="number"
                                name="age"
                                placeholder="Age"
                                className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                            />

                            <Input
                                label="Education"
                                type="text"
                                name="education"
                                placeholder="Degree / Institution"
                                className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-green-dark transition"
                            />
                        </div>

                        <Input
                            label="Experience"
                            textArea={true}
                            name="experience"
                            placeholder="Summarize your experience"
                            className="border border-white/10 rounded-xl px-4 py-3 bg-transparent min-h-[100px] focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                        />

                        <div className="pt-1">
                            <Skills />
                        </div>

                        <Input
                            label="Description"
                            textArea={true}
                            name="description"
                            placeholder="A short professional summary"
                            className="border border-white/10 rounded-xl px-4 py-3 bg-transparent min-h-[80px] focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                        />

                        <div className="mt-3 flex gap-3">
                            <Button
                                type={type.submit}
                                className="flex-1 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg shadow-xl hover:scale-102 transition-transform font-semibold"
                                text="Create CV"
                            />
                            <Button
                                className="bg-transparent border border-white/8 text-text-dark px-4 py-3 rounded-lg hover:bg-aurora-green-dark hover:text-white transition"
                                text="Reset"
                                onClick={() => reset()}
                            />
                        </div>
                    </form>
                </div>

                {/* Right: illustrative card (hidden on small screens) */}
            </div>
        </section>
    );
}
