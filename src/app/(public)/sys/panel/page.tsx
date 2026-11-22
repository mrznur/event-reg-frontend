import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { AsteroidBg } from "@/components/shared/asteroid-bg";

export const metadata: Metadata = {
    title: "BUCC",
    robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLoginPage() {
    return (
        <div className="relative isolate overflow-hidden">
            <AsteroidBg />
            <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-4 py-16">
                <AdminLoginForm />
            </div>
        </div>
    );
}
