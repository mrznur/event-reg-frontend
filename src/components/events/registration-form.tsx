"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle } from "lucide-react";
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
            <div className="border border-ink/10 bg-paper p-6">
                <div className="flex items-center gap-3 text-ink">
                    <CheckCircle aria-hidden className="size-6 shrink-0" />
                    <h3 className="label-caps">You're registered!</h3>
                </div>
                <p className="mt-4 text-sm text-stone-text">
                    Your ticket code is below. Save it — you'll need it at the door.
                </p>
                <div className="mt-4 border border-ink/15 bg-ink px-5 py-4 text-center">
                    <p className="label-caps text-paper/60">Ticket code</p>
                    <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-lime">
                        {ticketCode}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <h3 className="label-caps text-stone-text">Register for this event</h3>

            {formErrors.length > 0 && (
                <div role="alert" className="border border-error px-4 py-3 text-sm text-error">
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
                error={fieldErrors.name}
            />

            <FormField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                error={fieldErrors.email}
            />

            <FormField
                name="phone"
                label="Phone number"
                type="tel"
                autoComplete="tel"
                error={fieldErrors.phone}
            />

            <button
                type="submit"
                disabled={pending}
                className="label-caps inline-flex w-full cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Registering…" : "Register now"}
            </button>
        </form>
    );
}
