"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/events", label: "Events" },
];

export function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
                const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`label-caps rounded px-3 py-2 transition-colors ${
                            isActive
                                ? "bg-ink text-paper"
                                : "text-stone-text hover:text-ink hover:bg-ink/5"
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
