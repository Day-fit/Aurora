import {ButtonInterface} from "@/lib/types/button";

export default function Button({text, className, icon, onClick, type} : ButtonInterface)
{
    return (
        <button className={`flex flex-row rounded-xl ${className || ''}`} onClick={onClick} type={type}>
            {icon}
            {text}
        </button>
    )
}