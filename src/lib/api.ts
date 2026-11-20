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
    startsAt: string;
    endsAt: string;
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

// ─── Registrations (public) ──────────────────────────────────────────────────

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

// ─── Dashboard — organizer events ────────────────────────────────────────────

export interface OrganizerEvent extends Event {
    organizerId: string;
}

export type CreateEventInput = {
    title: string;
    description: string;
    category: EventCategory;
    coverImage: string;
    venue: string;
    timezone: string;
    startsAt: string;
    endsAt: string;
    capacity: number;
};

export async function getMyEvents(): Promise<OrganizerEvent[]> {
    const data = await request<{ events: OrganizerEvent[] }>("/api/organizer/events");
    return data.events;
}

export async function getMyEventById(id: string): Promise<OrganizerEvent> {
    const data = await request<{ event: OrganizerEvent }>(`/api/organizer/events/${id}`);
    return data.event;
}

export async function createEvent(input: CreateEventInput): Promise<OrganizerEvent> {
    const data = await request<{ event: OrganizerEvent }>("/api/organizer/events", {
        method: "POST",
        body: input,
    });
    return data.event;
}

export async function updateEvent(id: string, input: Partial<CreateEventInput>): Promise<OrganizerEvent> {
    const data = await request<{ event: OrganizerEvent }>(`/api/organizer/events/${id}`, {
        method: "PATCH",
        body: input,
    });
    return data.event;
}

export async function publishEvent(id: string): Promise<OrganizerEvent> {
    const data = await request<{ event: OrganizerEvent }>(`/api/organizer/events/${id}/publish`, {
        method: "PATCH",
    });
    return data.event;
}

export async function unpublishEvent(id: string): Promise<OrganizerEvent> {
    const data = await request<{ event: OrganizerEvent }>(`/api/organizer/events/${id}/unpublish`, {
        method: "PATCH",
    });
    return data.event;
}

export async function cancelEvent(id: string): Promise<OrganizerEvent> {
    const data = await request<{ event: OrganizerEvent }>(`/api/organizer/events/${id}/cancel`, {
        method: "PATCH",
    });
    return data.event;
}

// ─── Dashboard — registrations ───────────────────────────────────────────────

export interface Registration {
    id: string;
    eventId: string;
    name: string;
    email: string;
    phone: string;
    ticketCode: string;
    status: "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
    checkedInAt: string | null;
    createdAt: string;
}

export async function getRegistrations(eventId: string): Promise<Registration[]> {
    const data = await request<{ registrations: Registration[] }>(
        `/api/organizer/events/${eventId}/registrations`,
    );
    return data.registrations;
}

// ─── Dashboard — check-in ────────────────────────────────────────────────────

export interface CheckInResult {
    ok: boolean;
    registration: Registration;
}

export async function checkInByCode(eventId: string, ticketCode: string): Promise<CheckInResult> {
    const data = await request<CheckInResult>(`/api/organizer/events/${eventId}/check-in`, {
        method: "POST",
        body: { ticketCode },
    });
    return data;
}

export async function checkInBySearch(eventId: string, query: string): Promise<Registration[]> {
    const params = new URLSearchParams({ q: query });
    const data = await request<{ registrations: Registration[] }>(
        `/api/organizer/events/${eventId}/registrations?${params}`,
    );
    return data.registrations;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

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
}): Promise<void> {
    await request<{ ok: boolean }>("/api/auth/signup", {
        method: "POST",
        body: input,
    });
}

export async function verifySignup(input: {
    email: string;
    code: string;
}): Promise<User> {
    const data = await request<{ user: User }>("/api/auth/verify", {
        method: "POST",
        body: input,
    });
    return data.user;
}

export async function resendCode(input: {
    email: string;
}): Promise<void> {
    await request<{ ok: boolean }>("/api/auth/resend", {
        method: "POST",
        body: input,
    });
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
