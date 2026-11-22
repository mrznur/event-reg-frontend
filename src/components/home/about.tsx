import { SlideIn } from "@/components/motion/reveal";
import { AsteroidBg } from "@/components/shared/asteroid-bg";
import { CtaLink } from "@/components/shared/cta-link";
import { getAboutImages } from "@/lib/api";
import { AboutGrid } from "./about-grid";

export function AboutFallback() {
    return (
        <section
            aria-labelledby="about-heading"
            className="relative isolate scroll-mt-16 md:scroll-mt-20"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-6 md:py-36 lg:px-8">
                <div className="h-8 w-48 animate-pulse rounded bg-ink/10" />
                <div className="mt-8 grid animate-pulse gap-4">
                    <div className="h-64 rounded-lg bg-ink/10" />
                </div>
            </div>
        </section>
    );
}

export async function About() {
    const images = await getAboutImages();

    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="relative isolate scroll-mt-16 md:scroll-mt-20"
        >
            <AsteroidBg />

            <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-6 md:py-36 lg:px-8">

                {/* Section header */}
                <div className="grid gap-3 border-b border-ink/10 pb-4 sm:grid-cols-[auto_auto_1fr] sm:items-end sm:gap-8">
                    <SlideIn>
                        <p className="label-caps text-stone-text">BUCC</p>
                    </SlideIn>
                    <SlideIn delay={100}>
                        <p className="label-caps text-stone-text">About us</p>
                    </SlideIn>
                    <SlideIn delay={200}>
                        <h2 id="about-heading" className="heading-3 text-ink sm:text-right">
                            Empowering the Tech Leaders of Tomorrow.
                        </h2>
                    </SlideIn>
                </div>

                {/* Interactive grid */}
                <div className="mt-8">
                    <AboutGrid images={images} />
                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-end">
                    <SlideIn>
                        <CtaLink href="/events">Explore Events</CtaLink>
                    </SlideIn>
                </div>
            </div>
        </section>
    );
}
