"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { checkInBySearch, checkInByCode, ApiError, type Registration } from "@/lib/api";
import { CheckInResult } from "./check-in-result";

interface Props {
    eventId: string;
}

export function ManualSearch({ eventId }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Registration[] | null>(null);
    const [searching, setPending] = useState(false);
    const [checkInResult, setCheckInResult] = useState<{ registration: Registration; alreadyCheckedIn: boolean } | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch(e: FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;
        setPending(true);
        setError(null);
        setCheckInResult(null);
        try {
            const list = await checkInBySearch(eventId, query.trim());
            setResults(list);
        } catch (err) {
            setError(err instanceof ApiError ? err.messages[0] : "Search failed.");
        }
        setPending(false);
    }

    async function handleCheckIn(ticketCode: string) {
        setError(null);
        try {
            const result = await checkInByCode(eventId, ticketCode);
            const alreadyCheckedIn = !result.ok && result.registration.status === "CHECKED_IN";
            setCheckInResult({ registration: result.registration, alreadyCheckedIn });
            setResults(null);
        } catch (err) {
            setError(err instanceof ApiError ? err.messages[0] : "Check-in failed.");
        }
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name, email, or ticket code…"
                    className="w-full border border-ink/20 bg-paper px-4 py-3 text-ink placeholder:text-stone sm:flex-1"
                />
                <button
                    type="submit"
                    disabled={searching}
                    className="label-caps inline-flex cursor-pointer items-center justify-center gap-2 bg-lime px-5 py-3 text-ink hover:bg-lime-400 transition-colors disabled:opacity-60"
                >
                    <Search aria-hidden className="size-4" />
                    <span>{searching ? "Searching…" : "Search"}</span>
                </button>
            </form>

            {error && <p className="text-sm text-error">{error}</p>}

            {checkInResult && (
                <CheckInResult
                    registration={checkInResult.registration}
                    alreadyCheckedIn={checkInResult.alreadyCheckedIn}
                />
            )}

            {results !== null && results.length === 0 && (
                <p className="text-sm text-stone-text">No attendees found for &quot;{query}&quot;.</p>
            )}

            {results && results.length > 0 && (
                <ul className="divide-y divide-ink/5 border border-ink/10">
                    {results.map((r) => (
                        <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                            <div className="min-w-0">
                                <p className="font-medium truncate">{r.name}</p>
                                <p className="text-sm text-stone-text truncate">{r.email}</p>
                                <p className="font-mono text-xs text-stone-text">{r.ticketCode}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`label-caps rounded-sm px-2 py-1 text-xs ${
                                    r.status === "CHECKED_IN" ? "bg-lime text-ink" : "bg-ink/10 text-stone-text"
                                }`}>
                                    {r.status === "CHECKED_IN" ? "Checked in" : "Confirmed"}
                                </span>
                                {r.status !== "CHECKED_IN" && (
                                    <button
                                        onClick={() => handleCheckIn(r.ticketCode)}
                                        className="label-caps cursor-pointer bg-lime px-4 py-2 text-ink hover:bg-lime-400 transition-colors text-xs"
                                    >
                                        Check in
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
