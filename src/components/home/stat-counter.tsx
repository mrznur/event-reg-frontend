"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
    value: number;
    label: string;
}

function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export function StatCounter({ value, label }: Props) {
    const [displayed, setDisplayed] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const animated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || animated.current) return;
                animated.current = true;

                const duration = 1800;
                const start = performance.now();

                const tick = (now: number) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    setDisplayed(Math.round(easeOut(progress) * value));
                    if (progress < 1) requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
            },
            { threshold: 0.3 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [value]);

    return (
        <div ref={ref}>
            <dd
                className="stat-number mt-2"
                aria-label={value.toLocaleString("en-US")}
            >
                {displayed.toLocaleString("en-US")}
            </dd>
            <dt className="label-caps mt-3 text-paper/70">{label}</dt>
        </div>
    );
}
