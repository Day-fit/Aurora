import React from "react";
import { useFormContext } from "react-hook-form";
import Props from "@/lib/types/input";

export default React.memo(function InputInner({
                                                  label,
                                                  name,
                                                  options = {},
                                                  textArea = false,
                                                  ...props
                                              }: Props) {

    const {
        register,
        formState: { errors }
    } = useFormContext();

    const fieldError = errors?.[name]?.message as string | undefined;
    const reg = register(name, options);

    return (
        <div className="relative w-full flex flex-col">
            {label && (
                <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded">
                    {label}
                </label>
            )}

            {textArea ? (
                <textarea
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                    {...reg}
                    {...props}
                />
            ) : (
                <input
                    className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                    {...reg}
                    {...props}
                />
            )}

            {fieldError && (
                <p className="text-red-800 text-sm mt-1">{fieldError}</p>
            )}
        </div>
    );
});
