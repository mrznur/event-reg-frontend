import { redirect } from "next/navigation";
import Link from "next/link";
import { getMe } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getMe();

    if (!user) redirect("/organizer/login");

    return (
        <div className="min-h-screen bg-paper">
            {/* Top bar */}
            <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-6 lg:px-8">
                    <Link href="/dashboard" className="text-lg font-bold uppercase tracking-tight">
                        {SITE_NAME} <span className="text-stone-text font-normal normal-case tracking-normal text-sm">Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-stone-text">
                        <span>{user.name}</span>
                        <Link href="/" className="label-caps hover:text-ink">← Public site</Link>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="mx-auto max-w-[1440px] px-4 py-10 md:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
