import type { Metadata } from "next";
import { EventForm } from "@/components/dashboard/event-form";

export const metadata: Metadata = {
    title: "New Event",
};

export default function NewEventPage() {
    return (
        <div>
            <h1 className="heading-3 mb-8">Create new event</h1>
            <EventForm />
        </div>
    );
}
