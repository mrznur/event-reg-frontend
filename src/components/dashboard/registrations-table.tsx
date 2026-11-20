"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { Registration } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
    CONFIRMED: "bg-ink/10 text-stone-text",
    CHECKED_IN: "bg-lime text-ink",
    CANCELLED: "bg-error/10 text-error",
};

interface Props {
    registrations: Registration[];
    eventTitle: string;
}

export function RegistrationsTable({ registrations, eventTitle }: Props) {
    const [query, setQuery] = useState("");

    const filtered = query.trim()
        ? registrations.filter(
              (r) =>
                  r.name.toLowerCase().includes(query.toLowerCase()) ||
                  r.email.toLowerCase().includes(query.toLowerCase()) ||
                  r.ticketCode.toLowerCase().includes(query.toLowerCase()),
          )
        : registrations;

    function downloadCSV() {
        const headers = ["Name", "Email", "Phone", "Ticket Code", "Status", "Registered At"];
        const rows = registrations.map((r) => [
            r.name,
            r.email,
            r.phone,
            r.ticketCode,
            r.status,
            new Date(r.createdAt).toLocaleString("en-GB"),
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${eventTitle.replace(/\s+/g, "-").toLowerCase()}-registrations.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div>
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-stone-text">
                    <span className="font-semibold text-ink">{registrations.length}</span> registrations
                    {query && <span>· {filtered.length} shown</span>}
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, email, code…"
                        className="border border-ink/20 bg-paper px-4 py-2 text-sm text-ink placeholder:text-stone w-56"
                    />
                    <button
                        onClick={downloadCSV}
                        className="label-caps inline-flex cursor-pointer items-center gap-2 border border-ink/20 px-4 py-2 text-ink hover:bg-ink/5 transition-colors"
                    >
                        <Download aria-hidden className="size-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <p className="py-10 text-center text-stone-text">No registrations found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="label-caps pb-3 pr-4 font-normal text-stone-text">Name</th>
                                <th className="label-caps pb-3 pr-4 font-normal text-stone-text hidden sm:table-cell">Email</th>
                                <th className="label-caps pb-3 pr-4 font-normal text-stone-text hidden md:table-cell">Phone</th>
                                <th className="label-caps pb-3 pr-4 font-normal text-stone-text">Code</th>
                                <th className="label-caps pb-3 font-normal text-stone-text">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/5">
                            {filtered.map((r) => (
                                <tr key={r.id}>
                                    <td className="py-3 pr-4 font-medium">{r.name}</td>
                                    <td className="py-3 pr-4 text-stone-text hidden sm:table-cell">{r.email}</td>
                                    <td className="py-3 pr-4 text-stone-text hidden md:table-cell">{r.phone}</td>
                                    <td className="py-3 pr-4 font-mono text-xs text-stone-text">{r.ticketCode}</td>
                                    <td className="py-3">
                                        <span className={`label-caps rounded-sm px-2 py-1 ${STATUS_STYLES[r.status] ?? ""}`}>
                                            {r.status.charAt(0) + r.status.slice(1).toLowerCase().replace("_", " ")}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
