import { useFormContext, useWatch } from "react-hook-form";

export default function TemplatePreview() {

    const { control } = useFormContext();

    const name = useWatch({ control, name: "name" });
    const description = useWatch({ control, name: "description" });


    return <div>{name} - {description}</div>;
}
