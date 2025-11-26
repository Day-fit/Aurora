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
            skills: [{value: ""}, {value: ""}, {value: ""}],
            education: "",
            photo: null,
            description: "",
        }
    });
    console.log("Parent render");

    return (
        <FormProvider {...methods}>
            <CvForm />
            <TemplatePreview />
        </FormProvider>
    )
}