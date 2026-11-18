import { getStats, type SiteStats } from "@/lib/api";

const STAT_ITEMS: { key: keyof SiteStats; label: string }[] = [
  { key: "events", label: "Events hosted" },
  { key: "registrations", label: "Registrations" },
  { key: "checkedIn", label: "Check-ins" },
];

export function ImpactStatsFallback() {
  return (
    <section
      id="impact"
      aria-hidden="true"
      className="scroll-mt-20 bg-ink md:scroll-mt-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="h-10 w-48 animate-pulse rounded-sm bg-paper/10" />
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
  let stats: SiteStats | null = null;

  try {
    stats = await getStats();
  } catch {
    stats = null;
  }

  return (
    <section
      id="impact"
      aria-labelledby="impact-heading"
      className="on-ink scroll-mt-20 bg-ink text-paper md:scroll-mt-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <h2 id="impact-heading" className="heading-2">
          Our impact
        </h2>

        {stats ? (
          <dl className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STAT_ITEMS.map((item) => (
              <div key={item.key}>
                <dt className="label-caps text-paper/70">{item.label}</dt>
                <dd className="stat-number mt-2">
                  {stats[item.key].toLocaleString("en-US")}
                </dd>
              </div>
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
