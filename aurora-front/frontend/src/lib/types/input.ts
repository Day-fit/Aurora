import React from "react";
import { RegisterOptions } from "react-hook-form";

export default interface Props extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    name: string;
    options?: RegisterOptions;
    textArea?: boolean;
    errorMsg?: string;
    className?: string;
}
