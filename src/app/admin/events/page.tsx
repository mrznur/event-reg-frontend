import { Suspense } from "react";
import { adminGetEvents } from "@/lib/api";
import { AdminEventsTable } from "@/components/admin/events-table";

async function EventsContent() {
    const events = await adminGetEvents();
    return <AdminEventsTable events={events} />;
}

export default function AdminEventsPage() {
    return (
        <div>
            <h1 className="heading-3 mb-8">All Events</h1>
            <Suspense fallback={<div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 animate-pulse bg-ink/5"/>)}</div>}>
                <EventsContent />
            </Suspense>
        </div>
    );
}
