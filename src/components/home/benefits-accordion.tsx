"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface Benefit {
    title: string;
    body: string;
}

interface Props {
    benefits: readonly Benefit[];
}

export function BenefitsAccordion({ benefits }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    function toggle(i: number) {
        setOpenIndex((prev) => (prev === i ? null : i));
    }

    return (
        <div>
            <p className="label-caps mb-3 text-paper/40">What you gain</p>
            <ul className="flex flex-col divide-y divide-paper/10">
                {benefits.map((benefit, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <li key={benefit.title}>
                            <button
                                type="button"
                                onClick={() => toggle(i)}
                                aria-expanded={isOpen}
                                className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <span className="label-caps shrink-0 text-lime/70">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm font-medium text-paper md:text-base">
                                        {benefit.title}
                                    </span>
                                </div>
                                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-paper/20 text-paper/60 transition-all duration-300 ${
                                    isOpen ? "rotate-45 border-lime bg-lime text-ink" : "hover:border-lime hover:bg-lime hover:text-ink"
                                }`}>
                                    <Plus aria-hidden className="size-3.5" />
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-40 pb-4" : "max-h-0"}`}>
                                <p className="pl-10 text-sm leading-relaxed text-paper/60">
                                    {benefit.body}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
