"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import * as z from "zod";

const enquirySchema = z.object({
    name: z.string().min(2, { error: "Enter your name." }),
    email: z.email({ error: "Enter a valid email address." }),
    message: z.string().min(10, { error: "Message must be at least 10 characters." }),
});

type FieldErrors = { name?: string; email?: string; message?: string };

export function EnquiryForm() {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const input = {
            name: String(data.get("name") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            message: String(data.get("message") ?? "").trim(),
        };

        const result = enquirySchema.safeParse(input);
        if (!result.success) {
            const flat = z.flattenError(result.error).fieldErrors;
            setFieldErrors({ name: flat.name?.[0], email: flat.email?.[0], message: flat.message?.[0] });
            return;
        }

        setFieldErrors({});
        setPending(true);
        try {
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
                credentials: "same-origin",
            });
        } catch {
            // fail silently — message still shows sent
        }
        setPending(false);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="border border-ink/10 p-6">
                <p className="label-caps text-ink">Message sent!</p>
                <p className="mt-2 text-sm text-stone-text">
                    Thanks for reaching out. We&apos;ll get back to you shortly.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {(["name", "email", "message"] as const).map((field) => {
                const isTextarea = field === "message";
                const configs = {
                    name:    { label: "Name",    type: "text",  autoComplete: "name",  placeholder: "Your full name" },
                    email:   { label: "Email",   type: "email", autoComplete: "email", placeholder: "you@example.com" },
                    message: { label: "Message", type: "text",  autoComplete: "off",   placeholder: "Tell us what's on your mind…" },
                } as const;
                const { label, type, autoComplete, placeholder } = configs[field];
                const error = fieldErrors[field];
                const id = `enquiry-${field}`;

                return (
                    <div key={field}>
                        <label htmlFor={id} className="label-caps mb-2 block text-ink">{label}</label>
                        {isTextarea ? (
                            <textarea
                                id={id}
                                name={field}
                                rows={4}
                                placeholder={placeholder}
                                aria-invalid={error ? true : undefined}
                                className={`block w-full resize-none border bg-paper px-4 py-3 text-ink placeholder:text-stone ${error ? "border-error" : "border-ink/20"}`}
                            />
                        ) : (
                            <input
                                id={id}
                                name={field}
                                type={type}
                                autoComplete={autoComplete}
                                placeholder={placeholder}
                                aria-invalid={error ? true : undefined}
                                className={`block w-full border bg-paper px-4 py-3 text-ink placeholder:text-stone ${error ? "border-error" : "border-ink/20"}`}
                            />
                        )}
                        {error && <p className="mt-1 text-sm text-error">{error}</p>}
                    </div>
                );
            })}

            <div>
                <button
                    type="submit"
                    disabled={pending}
                    className="group label-caps inline-flex cursor-pointer items-center gap-3 rounded-sm bg-lime px-6 py-3.5 text-ink transition duration-300 hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending ? "Sending…" : "Send message"}
                    {!pending && <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
                </button>
            </div>
        </form>
    );
}
