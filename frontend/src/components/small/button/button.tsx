interface ButtonProps {
    text: string;
    w?: "full" | "fit"
}

export default function Button({
    text,
    w = "fit"
}: ButtonProps) {
    const fontStyles = "text-white font-normal text-[15px]"
    const baseStyles = "bg-ui-card p-2 pt-4 pb-4 border-ui-border border-1 rounded-[10px] opacity-100"
    const width = w === "full" ? "w-full" : "w-fit"
    return (
        <button className={`${width} ${baseStyles} ${fontStyles} `}>
            {text}
        </button>
    )
}