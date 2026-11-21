"use client";

import { useEffect, useRef } from "react";
import QRCodeLib from "qrcode";

interface Props {
    value: string;
    size?: number;
}

export function QRCode({ value, size = 200 }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        QRCodeLib.toCanvas(canvasRef.current, value, {
            width: size,
            margin: 2,
            color: { dark: "#111111", light: "#f5f3ee" },
        });
    }, [value, size]);

    return <canvas ref={canvasRef} className="max-w-full h-auto" aria-label={`QR code for ticket ${value}`} />;
}
