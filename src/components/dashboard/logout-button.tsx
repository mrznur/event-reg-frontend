"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout, ApiError } from "@/lib/api";

export function LogoutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleLogout() {
        setPending(true);
        try {
            await logout();
        } catch (err) {
            // Clear locally even if the server call fails
            if (!(err instanceof ApiError)) console.error(err);
        }
        router.push("/organizer/log-in");
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            className="label-caps cursor-pointer text-stone-text transition-colors hover:text-ink disabled:opacity-60"
        >
            {pending ? "Logging out…" : "Log out"}
        </button>
    );
}
