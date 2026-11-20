import { CheckCircle, XCircle } from "lucide-react";
import type { Registration } from "@/lib/api";

interface Props {
    registration: Registration;
    alreadyCheckedIn?: boolean;
}

export function CheckInResult({ registration, alreadyCheckedIn }: Props) {
    const isSuccess = registration.status === "CHECKED_IN" && !alreadyCheckedIn;

    return (
        <div className={`border p-6 ${isSuccess ? "border-lime bg-lime/5" : "border-error/40 bg-error/5"}`}>
            <div className="flex items-center gap-3">
                {isSuccess
                    ? <CheckCircle aria-hidden className="size-6 text-ink" />
                    : <XCircle aria-hidden className="size-6 text-error" />
                }
                <p className="font-semibold">
                    {isSuccess ? "Checked in!" : alreadyCheckedIn ? "Already checked in" : "Check-in failed"}
                </p>
            </div>
            <div className="mt-4 text-sm text-stone-text">
                <p><span className="font-medium text-ink">Name:</span> {registration.name}</p>
                <p><span className="font-medium text-ink">Email:</span> {registration.email}</p>
                <p><span className="font-medium text-ink">Ticket:</span> {registration.ticketCode}</p>
            </div>
        </div>
    );
}
