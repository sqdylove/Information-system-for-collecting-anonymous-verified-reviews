import { ReactNode } from "react";

interface ButtonProps {
  text: string;
  w?: "full" | "fit";
  className?: string;
  onClick?: () => void;
  children?: ReactNode
}

export default function Button({
  text,
  w = "fit",
  className,
  onClick = () => { },
  children
}: ButtonProps) {
  const fontStyles = "text-white font-normal text-[15px]";
  const baseStyles =
    "bg-ui-card p-2 pt-3 pb-3 border-ui-border border-1 rounded-[10px] opacity-100 cursor-pointer";
  const hoverStyles = "hover:text-t-main/50 ";
  const width = w === "full" ? "w-full" : "w-fit";
  return (
    <button
      onClick={onClick}
      className={`${width} ${baseStyles} ${fontStyles} ${hoverStyles} hover:scale-99 ${className}`}
    >
      {text || children}
    </button>
  );
}
