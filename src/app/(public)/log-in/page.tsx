import type { Metadata } from "next";
import { AsteroidBg } from "@/components/shared/asteroid-bg";

export const metadata: Metadata = {
    title: "Log In",
};

export default function LoginPage() {
    return (
        <div className="relative isolate overflow-hidden">
            <AsteroidBg />
            <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-4 py-16 text-center md:px-6 md:py-24 lg:px-8">
                <p className="label-caps text-stone-text">BUCC</p>
                <h1 className="heading-2 mt-4">Log In</h1>
                <p className="mt-6 max-w-md text-base text-stone-text">
                    User accounts are coming soon. Stay tuned.
                </p>
            </div>
        </div>
    );
}
