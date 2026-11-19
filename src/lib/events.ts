import type { Event } from "@/lib/api";

// ─── Category labels ─────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
    WORKSHOP: "Workshop",
    HACKATHON: "Hackathon",
    TALK: "Talk",
    SOCIAL: "Social",
};

export function categoryLabel(category: string): string {
    return CATEGORY_LABELS[category] ?? category;
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(iso: string, timezone: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        timeZone: timezone,
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatDateLong(iso: string, timezone: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        timeZone: timezone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ─── Image helpers ────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_HOSTS = ["picsum.photos", "fastly.picsum.photos"];

export function isAllowedImageHost(url: string): boolean {
    return ALLOWED_IMAGE_HOSTS.some((host) => url.includes(host));
}

// ─── Registration eligibility ─────────────────────────────────────────────────

export function canRegister(event: Event): boolean {
    const now = new Date();
    if (event.status === "CANCELLED" || new Date(event.endsAt) < now) return false;
    if (event.spotsLeft === 0) return false;
    return true;
}
