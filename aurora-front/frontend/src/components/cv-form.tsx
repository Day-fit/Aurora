"use client";

import Button from "@/components/button";
import {type} from "@/lib/types/button";
import Skills from "@/components/skill";
import Input from "@/components/input";
import React from "react";
import {useFormContext} from "react-hook-form";

export default function CvForm() {

    const {register, handleSubmit} = useFormContext();

    const onSubmit = (data: any) => console.log(data);

    return (
        <form className="flex flex-col gap-4 p-4 max-w-xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <select
                className="border p-2 rounded"
                {...register("template", { required: true })}
            >
                <option value="1">Template 1</option>
                <option value="2">Template 2</option>
                <option value="3">Template 3</option>
                <option value="4">Template 4</option>
                <option value="5">Template 5</option>
            </select>
            <Input
                label="Name"
                type="text"
                name="name"
                placeholder="Name"
                className="border p-2 rounded"
                register={register("name", { required: true })}
            />

            <Input
                label="Surname"
                type="text"
                name="surname"
                placeholder="Surname"
                className="border p-2 rounded"
                register={register("surname", { required: true })}
            />

            <Input
                label="Age"
                type="number"
                name="age"
                placeholder="Age"
                className="border p-2 rounded"
                register={register("surname", { required: true })}
            />

            <Input
                label="Experience"
                textArea={true}
                name="experience"
                placeholder="Experience"
                className="border p-2 rounded"
                register={register("surname", { required: true })}
            />

            <Skills />

            <Input
                label="Education"
                type="text"
                name="education"
                placeholder="Education"
                className="border p-2 rounded"
                register={register("surname", { required: true })}

            />
            <Input
                label=""
                type="file"
                name="photo"
                className="border p-2 rounded"

            />

            <Input
                label="Description"
                textArea={true}
                name="description"
                placeholder="Description"
                className="border p-2 rounded"
                register={register("surname", { required: true })}
            />

            <Button
                type={type.submit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                text="Create CV"
            />
        </form>
    );
}