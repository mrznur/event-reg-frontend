import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
    category: string;
    heading: string;
    description: string;
    href: string;
}

export function ActivityCard({ category, heading, description, href }: Props) {
    return (
        <Link
            href={href}
            className="fade-up group flex flex-col border border-ink/10 bg-paper p-6 transition-shadow duration-300 hover:shadow-md"
        >
            <p className="label-caps text-stone-text">{category}</p>
            <h3 className="heading-3 mt-3 text-[1.25rem] leading-tight">{heading}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-text">{description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink transition-transform duration-300 group-hover:translate-x-1">
                Explore
                <ArrowRight aria-hidden className="size-4" />
            </span>
        </Link>
    );
}
