import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | BUCC",
};

export default function LoginPage() {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-4 py-16 text-center md:px-6 md:py-24 lg:px-8">
            <p className="label-caps text-stone-text">BUCC</p>
            <h1 className="heading-2 mt-4">Sign In</h1>
            <p className="mt-6 max-w-md text-base text-stone-text">
                This page is under development. User sign-in will be available soon.
            </p>
        </div>
    );
}
