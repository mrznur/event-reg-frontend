"use client";

import type { Event } from "@/lib/api";

type AvailabilityStatus = "closed" | "full" | "almost-full" | "open";

export function getAvailability(event: Event): AvailabilityStatus {
    const now = new Date();

    // 1. Closed: cancelled or already ended
    if (event.status === "CANCELLED" || new Date(event.endsAt) < now) {
        return "closed";
    }

    // 2. Full: no spots left
    if (event.spotsLeft === 0) {
        return "full";
    }

    // 3. Almost full: at or below 20% of capacity
    if (event.spotsLeft <= event.capacity * 0.2) {
        return "almost-full";
    }

    // 4. Open
    return "open";
}

const CONFIG: Record<
    AvailabilityStatus,
    { label: string; className: string }
> = {
    closed: {
        label: "Closed",
        className: "bg-stone/20 text-stone-text",
    },
    full: {
        label: "Full",
        className: "bg-error/10 text-error",
    },
    "almost-full": {
        label: "Almost full",
        className: "bg-lime/60 text-ink",
    },
    open: {
        label: "Open",
        className: "bg-lime text-ink",
    },
};

interface Props {
    event: Event;
    /** Show spotsLeft alongside the label for open/almost-full states */
    showSpots?: boolean;
}

export function AvailabilityChip({ event, showSpots = false }: Props) {
    const status = getAvailability(event);
    const { label, className } = CONFIG[status];

    const spotsLabel =
        showSpots && (status === "open" || status === "almost-full")
            ? ` · ${event.spotsLeft} spot${event.spotsLeft === 1 ? "" : "s"} left`
            : "";

    return (
        <span
            className={`label-caps inline-block rounded-sm px-2.5 py-1 ${className}`}
        >
            {label}
            {spotsLabel}
        </span>
    );
}
