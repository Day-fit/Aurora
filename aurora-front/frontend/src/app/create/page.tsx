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
            skills: [],
            education: "",
            photo: null,
            description: "",
        }
    });
    console.log("Parent render");

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2 min-w-0">
                    <CvForm />
                </div>

                <div className="w-full md:w-1/2 min-w-0">
                    <TemplatePreview />
                </div>
            </div>
        </FormProvider>
    )
}
