import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
    title: "Organizer Sign Up | BUCC",
    robots: { index: false, follow: false },
};

export default function OrganizerSignupPage() {
    return (
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                <div>
                    <p className="label-caps text-stone-text">BUCC</p>
                    <h1 className="display-l mt-4">Organizer Register</h1>
                    <p className="mt-6 max-w-md text-base text-stone-text">
                        Create an organizer account to publish events, manage registrations,
                        and check in attendees.
                    </p>
                </div>
                <SignupForm />
            </div>
        </div>
    );
}
