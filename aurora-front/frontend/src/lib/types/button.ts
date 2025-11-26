import React from "react";

export enum type {
    reset = "reset",
    submit = "submit",
    button = "button",
}

export default interface ButtonInterface {
    text?: string,
    className?: string,
    icon?: React.ReactNode | string,
    onClick?: () => void,
    type?: type
}
