import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AsteroidBg } from "@/components/shared/asteroid-bg";

export const metadata: Metadata = {
    title: "Forgot Password",
};

export default function ForgotPasswordPage() {
    return (
        <div className="relative isolate overflow-hidden">
            <AsteroidBg />
            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                    <div>
                        <p className="label-caps text-stone-text">BUCC</p>
                        <h1 className="display-l mt-4">Forgot Password</h1>
                        <p className="mt-6 max-w-md text-base text-stone-text">
                            Enter your email and we&apos;ll send you a 6-digit reset code.
                        </p>
                    </div>
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
}
