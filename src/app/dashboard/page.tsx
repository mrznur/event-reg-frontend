import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getMyEvents } from "@/lib/api";
import { DashboardEventsTable } from "@/components/dashboard/events-table";

export const metadata: Metadata = {
    title: "My Events",
};

async function EventsContent() {
    const events = await getMyEvents();
    return <DashboardEventsTable events={events} />;
}

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="heading-3 mt-1">My Events</h1>
                </div>
                <Link
                    href="/dashboard/events/new"
                    className="group label-caps inline-flex cursor-pointer items-center gap-2 bg-lime px-5 py-3 text-ink transition duration-300 hover:bg-lime-400"
                >
                    <Plus aria-hidden className="size-4" />
                    New event
                </Link>
            </div>

            <Suspense
                fallback={
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 animate-pulse bg-ink/5" />
                        ))}
                    </div>
                }
            >
                <EventsContent />
            </Suspense>
        </div>
    );
}
