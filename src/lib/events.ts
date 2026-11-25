import type { Event } from "@/lib/api";
import { EVENT_CATEGORIES } from "@/lib/constants";

// ─── Category labels ─────────────────────────────────────────────────────────

const CATEGORY_LABEL_MAP: Record<string, string> = Object.fromEntries(
    EVENT_CATEGORIES.map(({ value, label }) => [value, label]),
);

export function categoryLabel(category: string): string {
    return CATEGORY_LABEL_MAP[category] ?? category;
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

const ALLOWED_IMAGE_HOSTS = [
    "picsum.photos",
    "fastly.picsum.photos",
    "i.ibb.co.com",
    "res.cloudinary.com",
    "placehold.co",
];

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
