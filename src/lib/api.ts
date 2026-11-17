export type UserRole = "ORGANIZER" | "ADMIN";

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

async function request<T>(
    path: string,
    { method = "GET", body }: RequestOptions = {},
): Promise<T> {
    let res: Response;

    try {
        res = await fetch(path, {
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