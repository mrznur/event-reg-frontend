"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import * as z from "zod";
import { ApiError } from "@/lib/api";
import { useSession } from "@/components/auth/session-provider";
import { FormField } from "@/components/shared/form-field";

const signupSchema = z.object({
    name: z
        .string()
        .min(2, { error: "Enter your name (at least 2 characters)." })
        .max(80, { error: "Name must be 80 characters or fewer." }),
    email: z.email({ error: "Enter a valid email address." }),
    password: z
        .string()
        .min(8, { error: "Password must be at least 8 characters." })
        .max(72, { error: "Password must be 72 characters or fewer." }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const codeSchema = z.string().length(6, { error: "Enter the 6-digit code." });

type FieldErrors = { name?: string; email?: string; password?: string; confirmPassword?: string };

export function SignupForm() {
    const router = useRouter();
    const { signup, verifySignup, resendCode } = useSession();

    // Step state: "form" → "verify" → done
    const [step, setStep] = useState<"form" | "verify" | "expired">("form");
    const [email, setEmail] = useState("");

    // Form step state
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [pending, setPending] = useState(false);

    // Verify step state
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState<string | null>(null);
    const [verifyPending, setVerifyPending] = useState(false);
    const [resendPending, setResendPending] = useState(false);
    const [resendMsg, setResendMsg] = useState<string | null>(null);

    async function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const input = {
            name: String(data.get("name") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            password: String(data.get("password") ?? ""),
            confirmPassword: String(data.get("confirmPassword") ?? ""),
        };

        const result = signupSchema.safeParse(input);
        if (!result.success) {
            const flat = z.flattenError(result.error).fieldErrors;
            setFieldErrors({
                name: flat.name?.[0],
                email: flat.email?.[0],
                password: flat.password?.[0],
                confirmPassword: flat.confirmPassword?.[0],
            });
            setFormErrors([]);
            return;
        }

        setFieldErrors({});
        setFormErrors([]);
        setPending(true);

        // Strip confirmPassword before sending to the API
        const { confirmPassword: _, ...signupData } = result.data;

        try {
            await signup(signupData);
            setEmail(signupData.email);
            setStep("verify");
        } catch (error) {
            setFormErrors(
                error instanceof ApiError
                    ? error.messages
                    : ["Something went wrong. Please try again."],
            );
        }

        setPending(false);
    }

    async function handleVerify(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const codeResult = codeSchema.safeParse(code.trim());
        if (!codeResult.success) {
            setCodeError(codeResult.error.message);
            return;
        }

        setCodeError(null);
        setVerifyPending(true);

        try {
            await verifySignup({ email, code: code.trim() });
            router.push("/dashboard");
        } catch (error) {
            const msg =
                error instanceof ApiError
                    ? error.messages[0]
                    : "Something went wrong. Please try again.";

            // Expired code — user needs to start over
            if (msg.toLowerCase().includes("expired")) {
                setStep("expired");
            } else {
                setCodeError(msg);
            }
        }

        setVerifyPending(false);
    }

    async function handleResend() {
        setResendPending(true);
        setResendMsg(null);

        try {
            await resendCode({ email });
            setResendMsg("A new code has been sent to your email.");
        } catch (error) {
            setResendMsg(
                error instanceof ApiError
                    ? error.messages[0]
                    : "Could not resend code. Please try again.",
            );
        }

        setResendPending(false);
    }

    // ─── Expired code state ────────────────────────────────────────────────

    if (step === "expired") {
        return (
            <div className="max-w-md space-y-6">
                <div role="alert" className="border border-error px-4 py-3 text-error">
                    <p>Your verification code has expired.</p>
                </div>
                <p className="text-stone-text">
                    Please register again to receive a new code.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setStep("form");
                        setCode("");
                        setCodeError(null);
                    }}
                    className="label-caps rounded-sm inline-flex cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400"
                >
                    Register again
                </button>
            </div>
        );
    }

    // ─── Verification step ──────────────────────────────────────────────────

    if (step === "verify") {
        return (
            <div className="max-w-md space-y-6">
                <div className="flex items-center gap-3">
                    <Mail aria-hidden className="size-6 shrink-0 text-ink" />
                    <div>
                        <h3 className="label-caps text-ink">Verify your email</h3>
                        <p className="mt-1 text-sm text-stone-text">
                            Enter the 6-digit code we sent to{" "}
                            <span className="font-semibold">{email}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleVerify} noValidate className="space-y-5">
                    {codeError && (
                        <div role="alert" className="border border-error px-4 py-3 text-sm text-error">
                            {codeError}
                        </div>
                    )}

                    <FormField
                        name="code"
                        label="Verification code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="123456"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={verifyPending}
                        className="label-caps rounded-sm inline-flex w-full cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {verifyPending ? "Verifying…" : "Verify & continue"}
                    </button>
                </form>

                {resendMsg && (
                    <p className="text-sm text-stone-text">{resendMsg}</p>
                )}

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendPending}
                    className="label-caps text-stone-text underline underline-offset-4 hover:text-ink disabled:opacity-60"
                >
                    {resendPending ? "Sending…" : "Resend code"}
                </button>
            </div>
        );
    }

    // ─── Signup form step ───────────────────────────────────────────────────

    return (
        <form onSubmit={handleSignup} noValidate className="max-w-md space-y-6">
            {formErrors.length > 0 && (
                <div role="alert" className="border border-error px-4 py-3 text-error">
                    {formErrors.map((message) => (
                        <p key={message}>{message}</p>
                    ))}
                </div>
            )}

            <FormField
                name="name"
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                error={fieldErrors.name}
            />

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
                autoComplete="new-password"
                hint="8 to 72 characters."
                error={fieldErrors.password}
            />

            <FormField
                name="confirmPassword"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                error={fieldErrors.confirmPassword}
            />

            <button
                type="submit"
                disabled={pending}
                className="label-caps rounded-sm inline-flex cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Creating account…" : "Create account"}
            </button>

            <p className="text-stone-text">
                Already have an account?{" "}
                <Link href="/organizer/log-in" className="text-ink hover:bg-lime px-2 py-2 rounded-sm">
                    Log in
                </Link>
            </p>
        </form>
    );
}
