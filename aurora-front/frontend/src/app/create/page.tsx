"use client"

import CvForm from "@/components/cv-form";
import TemplatePreview from "@/components/template-preview";
import {FormProvider, useForm} from "react-hook-form";

export default function CreatePage() {
    const methods = useForm({
        defaultValues: {
            template: "1",
            name: "",
            surname: "",
            age: 0,
            experience: "",
            skills: ["", "", ""],
            education: "",
            photo: null,
            description: "",
        }
    });

    return (
        <FormProvider {...methods}>
            <CvForm />
            <TemplatePreview />
        </FormProvider>
    )
}