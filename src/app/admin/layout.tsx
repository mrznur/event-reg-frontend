import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMe } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await connection();

    const user = await getMe();

    if (!user) redirect("/organizer/log-in");
    if (user.role !== "ADMIN") redirect("/dashboard");

    return (
        <div className="min-h-screen bg-paper">
            <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-sm">
                <div className="mx-auto flex min-h-16 max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 md:h-16 md:flex-nowrap md:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-lg font-bold uppercase tracking-tight">
                            {SITE_NAME} <span className="text-stone-text font-normal normal-case tracking-normal text-sm">Admin</span>
                        </Link>
                        <AdminNav />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-text">
                        <span className="hidden max-w-[120px] truncate sm:inline">{user.name}</span>
                        <Link href="/" className="label-caps hidden text-stone-text transition-colors hover:text-ink sm:inline">← Public site</Link>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
