import { Suspense } from "react";
import Link from "next/link";
import { Users, CalendarDays } from "lucide-react";
import { adminGetUsers, adminGetEvents } from "@/lib/api";

async function AdminStats() {
    const [users, events] = await Promise.all([
        adminGetUsers(),
        adminGetEvents(),
    ]);

    const stats = [
        {
            label: "Total Users",
            value: users.length,
            href: "/admin/users",
            icon: Users,
        },
        {
            label: "Total Events",
            value: events.length,
            href: "/admin/events",
            icon: CalendarDays,
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            {stats.map((s) => {
                const Icon = s.icon;
                return (
                    <Link
                        key={s.label}
                        href={s.href}
                        className="group flex items-center justify-between border border-ink/10 p-6 transition-shadow hover:shadow-md"
                    >
                        <div>
                            <p className="label-caps text-stone-text">{s.label}</p>
                            <p className="mt-1 text-4xl font-bold">{s.value}</p>
                        </div>
                        <Icon aria-hidden className="size-10 text-ink/10 transition-colors group-hover:text-lime" />
                    </Link>
                );
            })}
        </div>
    );
}

export default function AdminPage() {
    return (
        <div>
            <div className="mb-8">
                <p className="label-caps text-stone-text">Overview</p>
                <h1 className="heading-3 mt-1">Admin Dashboard</h1>
            </div>

            <Suspense
                fallback={
                    <div className="grid gap-6 sm:grid-cols-2">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-28 animate-pulse bg-ink/5 border border-ink/10" />
                        ))}
                    </div>
                }
            >
                <AdminStats />
            </Suspense>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Link
                    href="/admin/users"
                    className="label-caps border border-ink/20 px-5 py-4 text-ink hover:bg-ink/5 transition-colors"
                >
                    Manage Users →
                </Link>
                <Link
                    href="/admin/events"
                    className="label-caps border border-ink/20 px-5 py-4 text-ink hover:bg-ink/5 transition-colors"
                >
                    Manage Events →
                </Link>
            </div>
        </div>
    );
}
