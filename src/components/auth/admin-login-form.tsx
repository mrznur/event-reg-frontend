"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { FormField } from "@/components/shared/form-field";

const schema = z.object({
    email: z.email({ error: "Enter a valid email address." }),
    password: z.string().min(1, { error: "Enter your password." }),
});

// The hidden backend path is injected at build time — never hardcoded here.
const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_ROUTE ?? "";

export function AdminLoginForm() {
    const router = useRouter();
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const input = {
            email: String(data.get("email") ?? "").trim(),
            password: String(data.get("password") ?? ""),
        };

        const result = schema.safeParse(input);
        if (!result.success) {
            const flat = z.flattenError(result.error).fieldErrors;
            setFieldErrors({ email: flat.email?.[0], password: flat.password?.[0] });
            return;
        }

        setFieldErrors({});
        setError(null);
        setPending(true);

        try {
            const res = await fetch(`/api/${ADMIN_PATH.replace(/^\//, "")}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
                credentials: "same-origin",
            });

            if (!res.ok) {
                // Return same generic error regardless — don't reveal if path exists
                setError("Invalid credentials.");
                setPending(false);
                return;
            }

            router.replace("/admin");
        } catch {
            setError("Could not reach the server.");
            setPending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="w-full space-y-6">
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

            <FormField
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                error={fieldErrors.password}
            />

            <button
                type="submit"
                disabled={pending}
                className="label-caps inline-flex w-full cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Logging in…" : "Log in"}
            </button>
        </form>
    );
}
