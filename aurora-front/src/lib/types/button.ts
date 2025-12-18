import React from "react";

export enum ButtonType {
  reset = "reset",
  submit = "submit",
  button = "button",
}

export default interface ButtonInterface {
  text?: string;
  className?: string;
  icon?: React.ReactNode | string;
  onClick?: () => void;
  type?: ButtonType;
  disabled?: boolean;
}
