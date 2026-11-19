export type UserRole = "ORGANIZER" | "ADMIN";

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventCategory = "WORKSHOP" | "HACKATHON" | "TALK" | "SOCIAL";
export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export interface Event {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: EventCategory;
    coverImage: string;
    venue: string;
    timezone: string;
    startsAt: string; // ISO 8601
    endsAt: string;   // ISO 8601
    capacity: number;
    status: EventStatus;
    registeredCount: number;
    spotsLeft: number;
}

export async function getUpcomingEvents(category?: EventCategory): Promise<Event[]> {
    const params = new URLSearchParams({ upcoming: "true" });
    if (category) params.set("category", category);
    const data = await request<{ events: Event[] }>(`/api/events?${params}`);
    return data.events;
}

export async function getEventBySlug(slug: string): Promise<Event> {
    const data = await request<{ event: Event }>(`/api/events/${slug}`);
    return data.event;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface SiteStats {
    events: number;
    registrations: number;
    checkedIn: number;
}

export async function getStats(): Promise<SiteStats> {
    return request<SiteStats>("/api/stats");
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryImage {
    id: string;
    title: string;
    url: string;
    caption: string;
    eventId: string;
    createdAt: string;
}

export async function getGallery(): Promise<GalleryImage[]> {
    const data = await request<{ images: GalleryImage[] }>("/api/gallery");
    return data.images;
}

// ─── Registrations ───────────────────────────────────────────────────────────

export interface Ticket {
    code: string;
}

export async function registerForEvent(
    slug: string,
    input: { name: string; email: string; phone: string },
): Promise<Ticket> {
    const data = await request<{ ticket: Ticket }>(`/api/events/${slug}/register`, {
        method: "POST",
        body: input,
    });
    return data.ticket;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export class ApiError extends Error {
    status: number;
    messages: string[];

    constructor(status: number, messages: string[]) {
        super(messages[0] ?? "Something went wrong. Please try again.");
        this.name = "ApiError";
        this.status = status;
        this.messages = messages;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
};

function resolveUrl(path: string): string {
    // Server-side: Node.js has no origin, so prepend the backend URL directly.
    // Client-side: relative path works via the Next.js rewrite proxy.
    if (typeof window === "undefined") {
        const base = process.env.API_URL ?? "http://localhost:4000";
        return `${base}${path}`;
    }
    return path;
}

async function request<T>(
    path: string,
    { method = "GET", body }: RequestOptions = {},
): Promise<T> {
    let res: Response;

    try {
        res = await fetch(resolveUrl(path), {
            method,
            headers: body === undefined ? undefined : { "Content-Type": "application/json" },
            body: body === undefined ? undefined : JSON.stringify(body),
            credentials: "same-origin",
            cache: "no-store",
        });
    } catch {
        throw new ApiError(0, [
            "Could not reach the server. Check your connection and try again.",
        ]);
    }

    let data: unknown = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        const raw = (data as { message?: string | string[] } | null)?.message;
        const messages = Array.isArray(raw)
            ? raw
            : raw
                ? [raw]
                : ["Something went wrong. Please try again."];
        throw new ApiError(res.status, messages);
    }

    return data as T;
}

export async function signup(input: {
    name: string;
    email: string;
    password: string;
}): Promise<User> {
    const data = await request<{ user: User }>("/api/auth/signup", {
        method: "POST",
        body: input,
    });
    return data.user;
}

export async function login(input: {
    email: string;
    password: string;
}): Promise<User> {
    const data = await request<{ user: User }>("/api/auth/login", {
        method: "POST",
        body: input,
    });
    return data.user;
}

export async function logout(): Promise<void> {
    await request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

// A 401 here means "logged out", so it returns null instead of throwing.
export async function getMe(): Promise<User | null> {
    try {
        const data = await request<{ user: User }>("/api/auth/me");
        return data.user;
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }
        throw error;
    }
}