import React, {Dispatch, SetStateAction} from "react";

export enum AuthMode{
    register = 'register',
    login = "login"
}

export interface AuthModalProps{
    mode: AuthMode,
    children: React.ReactNode,
    setMode: Dispatch<SetStateAction<AuthMode>>
}