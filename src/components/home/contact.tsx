"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import * as z from "zod";
import { SITE_CONFIG } from "@/lib/site-config";

const enquirySchema = z.object({
    name: z.string().min(2, { error: "Enter your name." }),
    email: z.email({ error: "Enter a valid email address." }),
    message: z.string().min(10, { error: "Message must be at least 10 characters." }),
});

type FieldErrors = { name?: string; email?: string; message?: string };

function EnquiryForm() {
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
            setFieldErrors({
                name: flat.name?.[0],
                email: flat.email?.[0],
                message: flat.message?.[0],
            });
            return;
        }

        setFieldErrors({});
        setPending(true);
        // Fire-and-forget — no backend endpoint yet, just show success
        await new Promise((r) => setTimeout(r, 600));
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
            <div>
                <label htmlFor="enquiry-name" className="label-caps mb-2 block text-ink">Name</label>
                <input
                    id="enquiry-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    aria-invalid={fieldErrors.name ? true : undefined}
                    className={`block w-full border bg-paper px-4 py-3 text-ink placeholder:text-stone ${fieldErrors.name ? "border-error" : "border-ink/20"}`}
                />
                {fieldErrors.name && <p className="mt-1 text-sm text-error">{fieldErrors.name}</p>}
            </div>

            <div>
                <label htmlFor="enquiry-email" className="label-caps mb-2 block text-ink">Email</label>
                <input
                    id="enquiry-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldErrors.email ? true : undefined}
                    className={`block w-full border bg-paper px-4 py-3 text-ink placeholder:text-stone ${fieldErrors.email ? "border-error" : "border-ink/20"}`}
                />
                {fieldErrors.email && <p className="mt-1 text-sm text-error">{fieldErrors.email}</p>}
            </div>

            <div>
                <label htmlFor="enquiry-message" className="label-caps mb-2 block text-ink">Message</label>
                <textarea
                    id="enquiry-message"
                    name="message"
                    rows={4}
                    placeholder="Tell us what's on your mind…"
                    aria-invalid={fieldErrors.message ? true : undefined}
                    className={`block w-full resize-none border bg-paper px-4 py-3 text-ink placeholder:text-stone ${fieldErrors.message ? "border-error" : "border-ink/20"}`}
                />
                {fieldErrors.message && <p className="mt-1 text-sm text-error">{fieldErrors.message}</p>}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={pending}
                    className="group label-caps inline-flex cursor-pointer items-center gap-3 bg-lime px-6 py-3.5 text-ink transition duration-300 hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending ? "Sending…" : "Send message"}
                    {!pending && <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
                </button>
            </div>
        </form>
    );
}

export function Contact() {
    const { email, location } = SITE_CONFIG;

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative isolate scroll-mt-16 overflow-hidden border-t border-ink/10 md:scroll-mt-20"
        >
            {/* Asteroid bg */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="asteroid-field">
                    <span className="asteroid-fragment fragment-3" />
                    <span className="asteroid-fragment fragment-5" />
                    <span className="asteroid-fragment fragment-8" />
                    <span className="asteroid-fragment fragment-10" />
                    <span className="asteroid-fragment fragment-12" />
                </div>
            </div>

            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2">
                    {/* Left — info */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <p className="slide-in label-caps text-stone-text">Get in touch</p>
                            <h2 id="contact-heading" className="heading-2 mt-2">
                                <span className="slide-in block">Let&apos;s Build Something</span>{" "}
                                <span className="slide-in block text-stone-text" style={{ animationDelay: "150ms" }}>Meaningful.</span>
                            </h2>
                            <p className="slide-in mt-4 max-w-md text-base leading-relaxed text-stone-text" style={{ animationDelay: "200ms" }}>
                                Have a question, collaboration idea, or interest in joining BUCC?
                                We&apos;d love to hear from you.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="border-l-2 border-lime pl-4">
                                <p className="label-caps text-stone-text">Email</p>
                                <a
                                    href={`mailto:${email}`}
                                    className="mt-1 block font-semibold hover:underline underline-offset-4"
                                >
                                    {email}
                                </a>
                            </div>
                            <div className="border-l-2 border-ink/15 pl-4">
                                <p className="label-caps text-stone-text">Location</p>
                                <p className="mt-1 font-semibold">{location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right — enquiry form */}
                    <div>
                        <p className="label-caps mb-6 text-stone-text">Send us a message</p>
                        <EnquiryForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
