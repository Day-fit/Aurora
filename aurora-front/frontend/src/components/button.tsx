import {ButtonInterface} from "@/lib/types/button";

export default function Button({text, className, icon, onClick} : ButtonInterface)
{
    return (
        <button className={className + `flex flex-row rounded-xl`} onClick={onClick ? onClick : undefined}>
            {icon}
            {text}
        </button>
    )
}