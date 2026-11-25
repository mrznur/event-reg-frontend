"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session-provider";

export function LogoutButton() {
    const router = useRouter();
    const { logout } = useSession();
    const [pending, setPending] = useState(false);

    async function handleLogout() {
        setPending(true);
        await logout();
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
