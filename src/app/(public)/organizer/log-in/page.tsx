import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Organizer Login | BUCC",
};

export default function OrganizerLoginPage() {
    return (
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                <div>
                    <p className="label-caps text-stone-text">BUCC</p>
                    <h1 className="display-l mt-4">Organizer Login</h1>
                    <p className="mt-6 max-w-md text-base text-stone-text">
                        Log in to create events, manage registrations, and check in attendees.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
