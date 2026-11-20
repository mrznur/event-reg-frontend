import { SlideIn } from "@/components/motion/reveal";
import { ActivityCard } from "./activity-card";

const ACTIVITIES = [
    {
        category: "Hackathons & Competitions",
        heading: "Build. Compete. Innovate.",
        description:
            "Programming competitions, hackathons, robotics contests, and innovation challenges where you push your limits and ship real work under pressure.",
        href: "/events?category=HACKATHON",
    },
    {
        category: "Technical Workshops",
        heading: "Learn Practical Skills.",
        description:
            "Hands-on sessions covering web development, AI, cybersecurity, electronics, and more — taught by seniors and industry professionals.",
        href: "/events?category=WORKSHOP",
    },
    {
        category: "Seminars & Talks",
        heading: "Learn From the Best.",
        description:
            "Industry experts, alumni, and academics share knowledge on technology, careers, and the future of computing.",
        href: "/events?category=TALK",
    },
    {
        category: "Projects & Research",
        heading: "Turn Ideas Into Reality.",
        description:
            "Collaborative software and hardware projects, research initiatives, and experimental technology work that goes beyond the classroom.",
        href: "/events",
    },
] as const;

export function Activities() {
    return (
        <section
            aria-labelledby="activities-heading"
            className="relative isolate scroll-mt-16 overflow-hidden border-t border-ink/10 md:scroll-mt-20"
        >
            {/* Asteroid bg */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="asteroid-field">
                    <span className="asteroid-fragment fragment-1" />
                    <span className="asteroid-fragment fragment-2" />
                    <span className="asteroid-fragment fragment-3" />
                    <span className="asteroid-fragment fragment-4" />
                    <span className="asteroid-fragment fragment-5" />
                    <span className="asteroid-fragment fragment-6" />
                    <span className="asteroid-fragment fragment-7" />
                    <span className="asteroid-fragment fragment-8" />
                </div>
            </div>

            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <div className="mb-12 grid gap-6 md:grid-cols-2">
                    <div>
                        <SlideIn><p className="label-caps text-stone-text">What we do</p></SlideIn>
                        <h2 id="activities-heading" className="heading-2 mt-2">
                            <SlideIn>Beyond Events.</SlideIn>{" "}
                            <SlideIn delay={150}><span className="text-stone-text">Building Experiences.</span></SlideIn>
                        </h2>
                    </div>
                    <SlideIn delay={200} className="self-end">
                        <p className="text-base leading-relaxed text-stone-text">
                            From competitive programming to technical workshops and collaborative research,
                            BUCC creates opportunities for students to explore, learn, and innovate.
                        </p>
                    </SlideIn>
                </div>

                <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
                    {ACTIVITIES.map((a) => (
                        <ActivityCard key={a.category} {...a} />
                    ))}
                </div>
            </div>
        </section>
    );
}
