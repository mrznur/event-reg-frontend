
"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, ArrowRight, Ticket } from "lucide-react";
import * as z from "zod";
import { registerForEvent, ApiError } from "@/lib/api";
import { FormField } from "@/components/shared/form-field";

const schema = z.object({
    name: z.string().min(2, { error: "Enter your full name." }),
    email: z.email({ error: "Enter a valid email address." }),
    phone: z.string().min(7, { error: "Enter a valid phone number." }),
});

type FieldErrors = { name?: string; email?: string; phone?: string };

interface Props {
    slug: string;
}

export function RegistrationForm({ slug }: Props) {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [pending, setPending] = useState(false);
    const [ticketCode, setTicketCode] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const input = {
            name: String(data.get("name") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            phone: String(data.get("phone") ?? "").trim(),
        };

        const result = schema.safeParse(input);

        if (!result.success) {
            const flat = z.flattenError(result.error).fieldErrors;
            setFieldErrors({
                name: flat.name?.[0],
                email: flat.email?.[0],
                phone: flat.phone?.[0],
            });
            setFormErrors([]);
            return;
        }

        setFieldErrors({});
        setFormErrors([]);
        setPending(true);

        try {
            const ticket = await registerForEvent(slug, result.data);
            setTicketCode(ticket.code);
        } catch (err) {
            setFormErrors(
                err instanceof ApiError
                    ? err.messages
                    : ["Something went wrong. Please try again."],
            );
            setPending(false);
        }
    }

    // Success state
    if (ticketCode) {
        return (
            <div className="overflow-hidden border border-ink/10 bg-paper">
                <div className="border-b border-ink/10 bg-lime/10 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center bg-lime text-ink">
                            <CheckCircle aria-hidden className="size-6" />
                        </div>
                        <div>
                            <p className="label-caps text-ink">Registration successful</p>
                            <h3 className="mt-1 text-xl font-bold text-ink">
                                You&apos;re registered!
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-sm leading-6 text-stone-text">
                        Your registration is confirmed. We&apos;ve sent a confirmation
                        to your email. Keep your ticket code safe.
                    </p>

                    <div className="mt-6 border border-ink/10 bg-ink px-5 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-paper/60">
                            <Ticket aria-hidden className="size-4" />
                            <p className="label-caps">Your ticket code</p>
                        </div>
                        <p className="mt-3 break-all font-mono text-2xl font-bold tracking-widest text-lime">
                            {ticketCode}
                        </p>
                    </div>

                    <a
                        href={`/tickets/${ticketCode}`}
                        className="group label-caps mt-5 inline-flex w-full items-center justify-center gap-3 bg-lime px-6 py-4 text-ink transition-colors hover:bg-lime-400"
                    >
                        View your ticket & QR code
                        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-ink/10 bg-paper">
            {/* Header */}
            <div className="border-b border-ink/10 px-6 py-6">
                <p className="label-caps text-stone-text">Secure your spot</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                    Register for this event
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-text">
                    Fill in your details below to complete your event registration.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6">
                {formErrors.length > 0 && (
                    <div
                        role="alert"
                        className="border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
                    >
                        {formErrors.map((msg) => (
                            <p key={msg}>{msg}</p>
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
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={fieldErrors.email}
                />

                <FormField
                    name="phone"
                    label="Phone number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+880 1700 000000"
                    error={fieldErrors.phone}
                />

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={pending}
                        className="group label-caps inline-flex w-full cursor-pointer items-center justify-center gap-3 bg-lime px-6 py-4 text-ink transition-colors hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending ? "Registering..." : "Complete registration"}
                        {!pending && (
                            <ArrowRight
                                aria-hidden
                                className="size-4 transition-transform group-hover:translate-x-1"
                            />
                        )}
                    </button>

                    <p className="mt-3 text-center text-xs leading-5 text-stone-text">
                        Your information will only be used for event registration.
                    </p>
                </div>
            </form>
        </div>
    );
}
