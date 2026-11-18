"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { EVENT_CATEGORIES } from "@/lib/constants";
import type { EventCategory } from "@/lib/api";

const ALL_OPTION = { value: "", label: "All" } as const;
const OPTIONS = [ALL_OPTION, ...EVENT_CATEGORIES];

export function CategoryFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current = searchParams.get("category") ?? "";

    function select(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("category", value);
        } else {
            params.delete("category");
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <div
            role="group"
            aria-label="Filter by category"
            className="flex flex-wrap gap-2"
        >
            {OPTIONS.map((opt) => {
                const active = opt.value === current;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => select(opt.value)}
                        aria-pressed={active}
                        className={`label-caps rounded-sm px-4 py-2 transition-colors duration-200 ${
                            active
                                ? "bg-ink text-paper"
                                : "border border-ink/20 bg-paper text-ink hover:bg-ink/5"
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
