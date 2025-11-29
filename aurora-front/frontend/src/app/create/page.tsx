"use client"

import CvForm from "@/components/cv-form";
import TemplatePreview from "@/components/template-preview";
import {FormProvider, useForm} from "react-hook-form";
import {TemplateType} from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/types/form";

export default function CreatePage() {

    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            template: TemplateType.template1,
            title: "",
            email: "",
            website: "",
            linkedIn: "",
            gitHub: "",
            name: "",
            surname: "",
            description: "",
            age: 0,
            experience: [],
            achievements: [],
            skills: [],
            education: [],
            photo: null,
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
