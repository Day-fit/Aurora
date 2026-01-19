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
      className={`flex flex-row items-center justify-center rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark/50 focus:ring-offset-2 focus:ring-offset-main-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${className || ""}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon}
      {text}
    </button>
  );
}
