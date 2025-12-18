import ButtonInterface from "@/lib/types/button";

export default function Button({
  text,
  className,
  icon,
  onClick,
  type,
  disabled,
}: ButtonInterface) {
  return (
    <button
      className={`flex flex-row items-center justify-center rounded-xl ${className || ""}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon}
      {text}
    </button>
  );
}
