"use client";

import { useEffect, useRef, useState } from "react";
import { checkInByCode, ApiError, type Registration } from "@/lib/api";
import { CheckInResult } from "./check-in-result";

interface Props {
    eventId: string;
}

export function Scanner({ eventId }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [result, setResult] = useState<{ registration: Registration; alreadyCheckedIn: boolean } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(true);
    const processing = useRef(false);

    useEffect(() => {
        if (!scanning) return;

        let QrScanner: typeof import("qr-scanner").default;
        let scanner: import("qr-scanner").default;

        import("qr-scanner").then((mod) => {
            QrScanner = mod.default;
            if (!videoRef.current) return;

            // willReadFrequently suppresses the Canvas2D getImageData warning
            const canvas = document.createElement("canvas");
            canvas.getContext("2d", { willReadFrequently: true });

            scanner = new QrScanner(
                videoRef.current,
                async (scanResult) => {
                    if (processing.current) return;
                    processing.current = true;
                    setScanning(false);
                    setError(null);

                    // QR encodes the ticket page URL — extract the code from the path
                    // e.g. https://domain.com/tickets/BUCC-A1B2C3D4 → BUCC-A1B2C3D4
                    let ticketCode = scanResult.data.trim();
                    try {
                        const url = new URL(ticketCode);
                        const parts = url.pathname.split("/").filter(Boolean);
                        // pathname is /tickets/<code>
                        if (parts.length >= 2 && parts[0] === "tickets") {
                            ticketCode = parts[1];
                        }
                    } catch {
                        // Not a URL — use the raw value as-is (plain code)
                    }

                    try {
                        const res = await checkInByCode(eventId, ticketCode);
                        const alreadyCheckedIn = !res.ok && res.registration.status === "CHECKED_IN";
                        setResult({ registration: res.registration, alreadyCheckedIn });
                    } catch (err) {
                        setError(err instanceof ApiError ? err.messages[0] : "Check-in failed.");
                        setScanning(true);
                    }

                    processing.current = false;
                },
                { highlightScanRegion: true, highlightCodeOutline: true },
            );

            scanner.start().catch(() => {
                setError("Could not access the camera. Please allow camera permission.");
            });
        });

        return () => {
            scanner?.stop();
        };
    }, [eventId, scanning]);

    function reset() {
        setResult(null);
        setError(null);
        setScanning(true);
        processing.current = false;
    }

    return (
        <div className="space-y-4">
            {scanning && (
                <div className="relative overflow-hidden border border-ink/10 bg-ink">
                    <video ref={videoRef} className="w-full" />
                    <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-paper/70">
                        Point camera at the QR code
                    </p>
                </div>
            )}

            {error && (
                <div className="border border-error/40 p-4 text-sm text-error">{error}</div>
            )}

            {result && (
                <div className="space-y-4">
                    <CheckInResult
                        registration={result.registration}
                        alreadyCheckedIn={result.alreadyCheckedIn}
                    />
                    <button
                        onClick={reset}
                        className="label-caps cursor-pointer bg-lime px-5 py-3 text-ink hover:bg-lime-400 transition-colors"
                    >
                        Scan next
                    </button>
                </div>
            )}
        </div>
    );
}
