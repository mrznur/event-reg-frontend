import { CtaLink } from "@/components/shared/cta-link";
import { SlideIn } from "@/components/motion/reveal";
import { AsteroidBg } from "@/components/shared/asteroid-bg";
import { SectionHeading } from "@/components/shared/section-heading";

const VALUES = [
    { title: "Innovation", body: "Pushing boundaries and embracing new technologies to solve complex problems.", delay: 0 },
    { title: "Collaboration", body: "Great things are never built alone — we share knowledge and support each other.", delay: 100 },
    { title: "Excellence", body: "From code quality to event execution, we hold ourselves to the highest standards.", delay: 200 },
    { title: "Integrity", body: "Transparency, accountability, and respect for peers, university, and community.", delay: 300 },
] as const;

export function About() {
    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="relative isolate scroll-mt-16 overflow-hidden md:scroll-mt-20"
        >
            <AsteroidBg />

            <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-6 md:py-36 lg:px-8">
                <SlideIn><p className="label-caps text-stone-text">BUCC</p></SlideIn>
                <h2 id="about-heading" className="heading-2 relative mt-4 max-w-5xl">
                    <SlideIn>Empowering the</SlideIn>{" "}
                    <SlideIn delay={150}>Tech Leaders</SlideIn>{" "}
                    <SlideIn delay={300}>of Tomorrow.</SlideIn>
                </h2>

                <div className="mt-16 grid items-stretch gap-6 md:grid-cols-2">
                    <SlideIn delay={100} className="h-full">
                        <div className="flex h-full border border-ink/10 p-6">
                            <p className="text-lg leading-relaxed text-stone-text md:text-xl">
                                The BRAC University Computer Club (BUCC) is the premier student
                                organisation dedicated to fostering innovation, technical excellence,
                                and professional growth in a rapidly evolving digital landscape.
                            </p>
                        </div>
                    </SlideIn>
                    <SlideIn delay={200} className="h-full">
                        <div className="flex h-full flex-col gap-6 border border-ink/10 p-6">
                            <div>
                                <h3 className="label-caps mb-3 text-ink">Our Mission</h3>
                                <p className="text-base leading-relaxed text-stone-text">
                                    Bridge the gap between academic theory and industry practice —
                                    giving students a platform to build real skills, ship real
                                    projects, and grow a real professional network.
                                </p>
                            </div>
                            <div>
                                <h3 className="label-caps mb-3 text-ink">Our Vision</h3>
                                <p className="text-base leading-relaxed text-stone-text">
                                    To be the leading tech incubator and student community in the
                                    nation, nurturing engineers and creators who shape the future
                                    of technology.
                                </p>
                            </div>
                        </div>
                    </SlideIn>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {VALUES.map((v) => (
                        <SlideIn key={v.title} delay={v.delay}>
                            <div className="border border-ink/10 p-6">
                                <h3 className="label-caps mb-3 text-ink">{v.title}</h3>
                                <p className="text-base leading-relaxed text-stone-text">{v.body}</p>
                            </div>
                        </SlideIn>
                    ))}
                </div>

                <div className="mt-12">
                    <CtaLink href="/events">Explore Events</CtaLink>
                </div>
            </div>
        </section>
    );
}
