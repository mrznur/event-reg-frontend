import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "inverse" | "ghost";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center gap-3 font-semibold uppercase tracking-wider active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink",
  secondary: "bg-ink text-paper",
  inverse: "bg-paper text-ink",
  ghost:
    "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 hover:bg-[length:100%_2px]",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = true,
  className = "",
  onClick,
}: Props) {
  const sizing = variant === "ghost" ? "" : sizes[size];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizing} ${className}`}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}
