import { getStats } from "@/lib/api";
import { SlideIn } from "@/components/motion/reveal";
import { StatCounter } from "./stat-counter";

// activeMembers is a static number until the backend exposes it
const ACTIVE_MEMBERS = 2500;

export function ImpactStatsFallback() {
    return (
        <section
            id="impact"
            aria-hidden="true"
            className="scroll-mt-20 bg-ink md:scroll-mt-24"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <div className="h-10 w-48 animate-pulse rounded-sm bg-paper/10" />
                <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-10">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                            <div className="h-4 w-28 animate-pulse rounded-sm bg-paper/10" />
                            <div className="mt-2 h-24 w-40 animate-pulse rounded-sm bg-paper/10" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export async function ImpactStats() {
    let stats = null;

    try {
        stats = await getStats();
    } catch {
        stats = null;
    }

    const items = stats
        ? [
              { value: stats.events, label: "Events hosted" },
              { value: stats.registrations, label: "Student registrations" },
              { value: stats.checkedIn, label: "Total check-ins" },
              { value: ACTIVE_MEMBERS, label: "Active members" },
          ]
        : null;

    return (
        <section
            id="impact"
            aria-labelledby="impact-heading"
            className="on-ink scroll-mt-20 bg-ink text-paper md:scroll-mt-24"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <SlideIn><p className="label-caps text-paper/60">Our impact</p></SlideIn>
                <h2 id="impact-heading" className="heading-2 mt-2 text-paper">
                    <SlideIn>Numbers That{" "}</SlideIn>
                    <SlideIn delay={150}><span className="text-paper/50">Speak for Themselves.</span></SlideIn>
                </h2>

                {items ? (
                    <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-10">
                        {items.map((item) => (
                            <StatCounter
                                key={item.label}
                                value={item.value}
                                label={item.label}
                            />
                        ))}
                    </dl>
                ) : (
                    <p className="mt-10 text-paper/70">
                        Impact numbers are unavailable right now.
                    </p>
                )}
            </div>
        </section>
    );
}
