"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publishEvent, unpublishEvent, cancelEvent, ApiError, type OrganizerEvent } from "@/lib/api";

interface Props {
    event: OrganizerEvent;
}

export function EventStatusActions({ event }: Props) {
    const router = useRouter();
    const [pending, setPending] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function act(action: "publish" | "unpublish" | "cancel") {
        setPending(action);
        setError(null);
        try {
            if (action === "publish") await publishEvent(event.id);
            if (action === "unpublish") await unpublishEvent(event.id);
            if (action === "cancel") await cancelEvent(event.id);
            router.refresh();
        } catch (err) {
            setError(err instanceof ApiError ? err.messages[0] : "Something went wrong.");
        }
        setPending(null);
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2">
                {event.status === "DRAFT" && (
                    <button
                        onClick={() => act("publish")}
                        disabled={pending !== null}
                        className="label-caps cursor-pointer bg-lime px-4 py-2.5 text-ink hover:bg-lime-400 transition-colors disabled:opacity-60"
                    >
                        {pending === "publish" ? "Publishing…" : "Publish"}
                    </button>
                )}
                {event.status === "PUBLISHED" && (
                    <button
                        onClick={() => act("unpublish")}
                        disabled={pending !== null}
                        className="label-caps cursor-pointer border border-ink/20 px-4 py-2.5 text-ink hover:bg-ink/5 transition-colors disabled:opacity-60"
                    >
                        {pending === "unpublish" ? "Unpublishing…" : "Unpublish"}
                    </button>
                )}
                {event.status !== "CANCELLED" && (
                    <button
                        onClick={() => act("cancel")}
                        disabled={pending !== null}
                        className="label-caps cursor-pointer border border-error/40 px-4 py-2.5 text-error hover:bg-error/5 transition-colors disabled:opacity-60"
                    >
                        {pending === "cancel" ? "Cancelling…" : "Cancel event"}
                    </button>
                )}
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
        </div>
    );
}
