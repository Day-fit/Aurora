import React from "react";
import { useFormContext } from "react-hook-form";
import Props from "@/lib/types/input";

export default React.memo(
    function InputInner({ label, errorMsg, name, options = {}, textArea = false, ...props }: Props) {
        const { register } = useFormContext();
        const reg = register(name, options);

        return (
            <div className="w-full flex flex-col">
                {label && <label className="text-left mb-1 font-bold">{label}</label>}
                {textArea ? <textarea {...reg} {...(props as any)} /> : <input {...reg} {...props} />}
                {errorMsg && <p className="text-red-800 text-sm">{errorMsg}</p>}
            </div>
        );
    }
);
