import React from "react";

export default interface Props extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    name: string;
    options?: any;
    textArea?: boolean;
    errorMsg?: string;
}
