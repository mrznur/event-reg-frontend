"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { createEvent, updateEvent, ApiError, type OrganizerEvent, type CreateEventInput } from "@/lib/api";
import { EVENT_CATEGORIES } from "@/lib/constants";

const schema = z.object({
    title: z.string().min(3, { error: "Title must be at least 3 characters." }),
    description: z.string().min(10, { error: "Description must be at least 10 characters." }),
    category: z.enum(["WORKSHOP", "HACKATHON", "TALK", "SOCIAL"], { error: "Select a category." }),
    coverImage: z.string().url({ error: "Enter a valid image URL." }),
    venue: z.string().min(3, { error: "Enter the venue." }),
    timezone: z.string().min(1, { error: "Select a timezone." }),
    startsAt: z.string().min(1, { error: "Enter a start date and time." }),
    endsAt: z.string().min(1, { error: "Enter an end date and time." }),
    capacity: z.coerce.number().int().min(1, { error: "Capacity must be at least 1." }),
});

type FieldErrors = Partial<Record<keyof CreateEventInput, string>>;

interface Props {
    event?: OrganizerEvent;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="label-caps mb-2 block text-ink">{label}</label>
            {children}
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
}

export function EventForm({ event }: Props) {
    const router = useRouter();
    const isEdit = !!event;

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const raw = {
            title: String(data.get("title") ?? "").trim(),
            description: String(data.get("description") ?? "").trim(),
            category: String(data.get("category") ?? ""),
            coverImage: String(data.get("coverImage") ?? "").trim(),
            venue: String(data.get("venue") ?? "").trim(),
            timezone: String(data.get("timezone") ?? "").trim(),
            startsAt: String(data.get("startsAt") ?? ""),
            endsAt: String(data.get("endsAt") ?? ""),
            capacity: String(data.get("capacity") ?? ""),
        };

        const result = schema.safeParse(raw);
        if (!result.success) {
            const flat = z.flattenError(result.error).fieldErrors;
            setFieldErrors(Object.fromEntries(
                Object.entries(flat).map(([k, v]) => [k, v?.[0]])
            ) as FieldErrors);
            setFormError(null);
            return;
        }

        setFieldErrors({});
        setFormError(null);
        setPending(true);

        // Convert local datetime to ISO
        const input: CreateEventInput = {
            ...result.data,
            startsAt: new Date(result.data.startsAt).toISOString(),
            endsAt: new Date(result.data.endsAt).toISOString(),
        };

        try {
            if (isEdit) {
                await updateEvent(event.id, input);
                router.push(`/dashboard/events/${event.id}`);
            } else {
                const created = await createEvent(input);
                router.push(`/dashboard/events/${created.id}`);
            }
        } catch (err) {
            setFormError(
                err instanceof ApiError ? err.messages[0] : "Something went wrong. Please try again."
            );
            setPending(false);
        }
    }

    const inputClass = (err?: string) =>
        `block w-full border bg-paper px-4 py-3 text-ink placeholder:text-stone ${err ? "border-error" : "border-ink/20"}`;

    // Format datetime for input[type=datetime-local]
    const toLocal = (iso?: string) => iso ? iso.slice(0, 16) : "";

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6 max-w-2xl">
            {formError && (
                <div role="alert" className="border border-error px-4 py-3 text-sm text-error">
                    {formError}
                </div>
            )}

            <Field label="Title" error={fieldErrors.title}>
                <input name="title" type="text" defaultValue={event?.title} placeholder="Intro to Git and GitHub" className={inputClass(fieldErrors.title)} />
            </Field>

            <Field label="Description" error={fieldErrors.description}>
                <textarea name="description" rows={4} defaultValue={event?.description} placeholder="What will attendees learn or experience?" className={`${inputClass(fieldErrors.description)} resize-none`} />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Category" error={fieldErrors.category}>
                    <select name="category" defaultValue={event?.category ?? ""} className={inputClass(fieldErrors.category)}>
                        <option value="" disabled>Select category</option>
                        {EVENT_CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Capacity" error={fieldErrors.capacity}>
                    <input name="capacity" type="number" min={1} defaultValue={event?.capacity} placeholder="50" className={inputClass(fieldErrors.capacity)} />
                </Field>
            </div>

            <Field label="Cover image URL" error={fieldErrors.coverImage}>
                <input name="coverImage" type="url" defaultValue={event?.coverImage} placeholder="https://example.com/image.jpg" className={inputClass(fieldErrors.coverImage)} />
            </Field>

            <Field label="Venue" error={fieldErrors.venue}>
                <input name="venue" type="text" defaultValue={event?.venue} placeholder="Computer Lab 2, Main Campus" className={inputClass(fieldErrors.venue)} />
            </Field>

            <Field label="Timezone" error={fieldErrors.timezone}>
                <input name="timezone" type="text" defaultValue={event?.timezone ?? "Asia/Dhaka"} placeholder="Asia/Dhaka" className={inputClass(fieldErrors.timezone)} />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Starts at" error={fieldErrors.startsAt}>
                    <input name="startsAt" type="datetime-local" defaultValue={toLocal(event?.startsAt)} className={inputClass(fieldErrors.startsAt)} />
                </Field>
                <Field label="Ends at" error={fieldErrors.endsAt}>
                    <input name="endsAt" type="datetime-local" defaultValue={toLocal(event?.endsAt)} className={inputClass(fieldErrors.endsAt)} />
                </Field>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={pending}
                    className="label-caps inline-flex cursor-pointer items-center gap-2 bg-lime px-6 py-3.5 text-ink transition duration-300 hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending ? "Saving…" : isEdit ? "Save changes" : "Create event"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="label-caps inline-flex cursor-pointer items-center px-6 py-3.5 text-stone-text hover:text-ink transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
