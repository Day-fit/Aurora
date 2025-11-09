import {ButtonInterface} from "@/lib/types/button";

export default function Button({text, className, icon, onClick} : ButtonInterface)
{
    return (
        <button className={`flex flex-row rounded-xl ${className || ''}`} onClick={onClick ? onClick : undefined}>
            {icon}
            {text}
        </button>
    )
}