"use client"

import CvForm from "@/components/cv-form";
import TemplatePreview from "@/components/template-preview";
import {FormProvider, useForm} from "react-hook-form";
import {TemplateType} from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/lib/types/form";

export default function CreatePage() {

    {/*remember to change all undefined to null in the formSchema*/}

    const methods = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            template: TemplateType.template1,
            title: "",
            name: "",
            surname: "",
            age: undefined,
            email: "",
            website: "",
            linkedIn: "",
            gitHub: "",
            profileDescription: "",
            profileImage: null,
            experience: [],
            achievements: [],
            skills: [],
            education: [],
            personalPortfolio: []
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
