"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { ApiError } from "@/lib/api";
import { FormField } from "@/components/shared/form-field";

const emailSchema = z.object({
    email: z.email({ error: "Enter a valid email address." }),
});

const resetSchema = z.object({
    code: z.string().length(6, { error: "Enter the 6-digit code." }),
    newPassword: z.string().min(8, { error: "Password must be at least 8 characters." }),
});

export function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "reset">("email");
    const [email, setEmail] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    async function handleEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const input = { email: String(data.get("email") ?? "").trim() };

        const result = emailSchema.safeParse(input);
        if (!result.success) {
            setFieldErrors({ email: z.flattenError(result.error).fieldErrors.email?.[0] ?? "" });
            return;
        }

        setFieldErrors({});
        setError(null);
        setPending(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
                credentials: "same-origin",
            });
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                setError(d.message ?? "Something went wrong.");
            } else {
                setEmail(result.data.email);
                setStep("reset");
            }
        } catch {
            setError("Could not reach the server. Check your connection.");
        }

        setPending(false);
    }

    async function handleReset(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const input = {
            code: String(data.get("code") ?? "").trim(),
            newPassword: String(data.get("newPassword") ?? ""),
        };

        const result = resetSchema.safeParse(input);
        if (!result.success) {
            const flat = z.flattenError(result.error).fieldErrors;
            setFieldErrors({
                code: flat.code?.[0] ?? "",
                newPassword: flat.newPassword?.[0] ?? "",
            });
            return;
        }

        setFieldErrors({});
        setError(null);
        setPending(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, ...result.data }),
                credentials: "same-origin",
            });
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                setError(d.message ?? "Something went wrong.");
            } else {
                router.push("/organizer/log-in");
            }
        } catch {
            setError("Could not reach the server. Check your connection.");
        }

        setPending(false);
    }

    if (step === "reset") {
        return (
            <form onSubmit={handleReset} noValidate className="max-w-md space-y-6">
                <p className="text-sm text-stone-text">
                    Enter the 6-digit code sent to <span className="font-semibold text-ink">{email}</span>.
                </p>

                {error && (
                    <div role="alert" className="border border-error px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                )}

                <FormField
                    name="code"
                    label="Reset code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    error={fieldErrors.code}
                />

                <FormField
                    name="newPassword"
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    error={fieldErrors.newPassword}
                />

                <button
                    type="submit"
                    disabled={pending}
                    className="label-caps inline-flex cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending ? "Resetting…" : "Reset password"}
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={handleEmail} noValidate className="max-w-md space-y-6">
            {error && (
                <div role="alert" className="border border-error px-4 py-3 text-sm text-error">
                    {error}
                </div>
            )}

            <FormField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={fieldErrors.email}
            />

            <button
                type="submit"
                disabled={pending}
                className="label-caps inline-flex cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Sending…" : "Send reset code"}
            </button>

            <p className="text-stone-text">
                Remembered it?{" "}
                <Link href="/organizer/log-in" className="text-ink hover:bg-lime px-2 py-2 rounded-sm">
                    Log in
                </Link>
            </p>
        </form>
    );
}
