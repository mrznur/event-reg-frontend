import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
};

export function BtnSecond({
  href,
  children,
  size = "md",
  className = "",
  onClick,
}: Props) {
  const sizing = size === "lg" ? "h-14 px-8 text-base" : "h-12 px-6 text-sm";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group inline-flex items-center gap-3 rounded-sm
        bg-black font-semibold uppercase tracking-wider text-white
        transition duration-300
        active:translate-y-px hover:text-lime-400
        ${sizing} ${className}
      `}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
