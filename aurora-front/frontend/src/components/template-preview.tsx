import {useFormContext} from "react-hook-form";

export default function TemplatePreview() {

    const {watch} = useFormContext();
    const template = watch("template");
    return (
        <>
            {template === "1" && <p>dziala</p>}
        </>
    );
}
