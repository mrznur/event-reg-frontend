"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminDeleteUser, ApiError, type AdminUser } from "@/lib/api";

const ROLE_STYLES: Record<string, string> = {
    ORGANIZER: "bg-ink/10 text-stone-text",
    ADMIN: "bg-lime text-ink",
};

interface Props {
    users: AdminUser[];
}

export function AdminUsersTable({ users }: Props) {
    const router = useRouter();
    const [deleting, setDeleting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        setDeleting(id);
        setError(null);
        try {
            await adminDeleteUser(id);
            router.refresh();
        } catch (err) {
            setError(err instanceof ApiError ? err.messages[0] : "Failed to delete user.");
        }
        setDeleting(null);
    }

    if (users.length === 0) {
        return <p className="text-stone-text">No users found.</p>;
    }

    return (
        <div>
            {error && <p className="mb-4 text-sm text-error">{error}</p>}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-ink/10 text-left">
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text">Name</th>
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text hidden sm:table-cell">Email</th>
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text">Role</th>
                            <th className="label-caps pb-3 font-normal text-stone-text hidden md:table-cell">Joined</th>
                            <th className="label-caps pb-3 font-normal text-stone-text">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="py-3 pr-4 font-medium">{u.name}</td>
                                <td className="py-3 pr-4 text-stone-text hidden sm:table-cell">{u.email}</td>
                                <td className="py-3 pr-4">
                                    <span className={`label-caps rounded-sm px-2 py-1 ${ROLE_STYLES[u.role] ?? "bg-ink/10 text-stone-text"}`}>
                                        {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                                    </span>
                                </td>
                                <td className="py-3 pr-4 text-stone-text hidden md:table-cell">
                                    {new Date(u.createdAt).toLocaleDateString("en-GB")}
                                </td>
                                <td className="py-3">
                                    {u.role !== "ADMIN" && (
                                        <button
                                            onClick={() => handleDelete(u.id, u.name)}
                                            disabled={deleting === u.id}
                                            className="label-caps cursor-pointer text-error hover:underline underline-offset-4 disabled:opacity-60"
                                        >
                                            {deleting === u.id ? "Deleting…" : "Delete"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
