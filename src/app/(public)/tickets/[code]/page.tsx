import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";
import { getTicket, ApiError } from "@/lib/api";
import { categoryLabel, formatDateLong, isAllowedImageHost } from "@/lib/events";
import { QRCode } from "@/components/tickets/qr-code";

export const metadata: Metadata = {
    title: "Your Ticket",
};

interface Props {
    params: Promise<{ code: string }>;
}

const STATUS_CONFIG = {
    CONFIRMED: {
        icon: Clock,
        label: "Registration confirmed",
        description: "Show this QR code at the venue to check in.",
        color: "text-ink",
        bg: "bg-ink/5 border-ink/10",
    },
    CHECKED_IN: {
        icon: CheckCircle,
        label: "Checked in",
        description: "You have been checked in. Welcome!",
        color: "text-ink",
        bg: "bg-lime/20 border-lime/30",
    },
    CANCELLED: {
        icon: XCircle,
        label: "Registration cancelled",
        description: "This registration has been cancelled.",
        color: "text-error",
        bg: "bg-error/5 border-error/20",
    },
} as const;

async function TicketContent({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    let ticket;
    try {
        ticket = await getTicket(code);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) notFound();
        throw err;
    }

    const config = STATUS_CONFIG[ticket.status];
    const StatusIcon = config.icon;
    const isPicsum = isAllowedImageHost(ticket.event.coverImage);

    return (
        <div className="mx-auto max-w-lg">
            {/* Status banner */}
            <div className={`mb-6 flex items-center gap-3 border p-4 ${config.bg}`}>
                <StatusIcon aria-hidden className={`size-5 shrink-0 ${config.color}`} />
                <div>
                    <p className={`label-caps ${config.color}`}>{config.label}</p>
                    <p className="mt-0.5 text-sm text-stone-text">{config.description}</p>
                </div>
            </div>

            {/* Ticket card */}
            <div className="border border-ink/10 bg-paper">
                {/* Event cover */}
                <div className="relative aspect-[3/1] overflow-hidden bg-stone/10">
                    {isPicsum ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={ticket.event.coverImage}
                            alt={ticket.event.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={ticket.event.coverImage}
                            alt={ticket.event.title}
                            className="h-full w-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                        <p className="label-caps text-lime">{categoryLabel(ticket.event.category)}</p>
                        <p className="mt-1 text-lg font-bold text-paper">{ticket.event.title}</p>
                    </div>
                </div>

                {/* Event details */}
                <div className="flex flex-col gap-3 p-5 text-sm text-stone-text">
                    <span className="flex items-center gap-2">
                        <Calendar aria-hidden className="size-4 shrink-0" />
                        <time dateTime={ticket.event.startsAt}>
                            {formatDateLong(ticket.event.startsAt, ticket.event.timezone)}
                        </time>
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin aria-hidden className="size-4 shrink-0" />
                        {ticket.event.venue}
                    </span>
                </div>

                {/* Divider */}
                <div className="mx-5 border-t border-dashed border-ink/15" />

                {/* Attendee + QR */}
                <div className="p-5">
                    <div className="mb-5 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="label-caps text-stone-text">Name</p>
                            <p className="mt-1 font-semibold">{ticket.name}</p>
                        </div>
                        <div>
                            <p className="label-caps text-stone-text">Ticket code</p>
                            <p className="mt-1 font-mono font-semibold tracking-wider">{ticket.code}</p>
                        </div>
                    </div>

                    {/* QR code — only show when not cancelled */}
                    {ticket.status !== "CANCELLED" && (
                        <div className="flex justify-center py-4">
                            <QRCode value={ticket.code} size={180} />
                        </div>
                    )}
                </div>
            </div>

            {/* Back to event */}
            <div className="mt-6 text-center">
                <Link
                    href={`/events/${ticket.event.slug}`}
                    className="label-caps text-stone-text underline underline-offset-4 hover:text-ink"
                >
                    View event details
                </Link>
            </div>
        </div>
    );
}

export default function TicketPage({ params }: Props) {
    return (
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
            <div className="mb-8 text-center">
                <p className="label-caps text-stone-text">BUCC</p>
                <h1 className="heading-3 mt-2">Your Ticket</h1>
            </div>
            <Suspense
                fallback={
                    <div className="mx-auto max-w-lg animate-pulse space-y-4">
                        <div className="h-16 bg-ink/5" />
                        <div className="h-80 bg-ink/5" />
                    </div>
                }
            >
                <TicketContent params={params} />
            </Suspense>
        </div>
    );
}
