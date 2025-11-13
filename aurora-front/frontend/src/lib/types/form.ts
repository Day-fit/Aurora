import React from "react";

export enum templateType{
    template1 = 1,
    template2 = 2,
    template3 = 3,
    template4 = 4,
    template5 = 5
}

export interface FormValues {
    template: templateType,
    name: string,
    surname: string,
    age: number,
    experience: string,
    skills: string[],
    education: string,
    photo: File | null,
    description: string
}

export interface FormProps {
    formData: FormValues,
    setFormData: React.Dispatch<React.SetStateAction<FormValues>>
}