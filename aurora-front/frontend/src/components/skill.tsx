import Button from "@/components/button";
import { type } from "@/lib/types/button";
import { FiX } from "react-icons/fi";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";

export default function Skills() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills",
    });

    return (
        <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">

                    <Controller
                        control={control}
                        name={`skills.${index}.value`}
                        render={({ field }) => (
                            <input
                                {...field}
                                placeholder="Enter skill"
                                className="border p-2 rounded w-full bg-transparent"
                            />
                        )}
                    />

                    <Button
                        type={type.button}
                        className="text-red-600 font-bold px-2"
                        onClick={() => remove(index)}
                        icon={<FiX />}
                    />
                </div>
            ))}

            <Button
                type={type.button}
                onClick={() => append({ value: "" })}
                className="bg-blue-500 text-white px-3 py-1 rounded w-fit"
                text="Add new skill"
            />
        </div>
    );
}