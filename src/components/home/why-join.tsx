import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SlideIn } from "@/components/motion/reveal";
import { MEMBER_PHOTOS } from "@/lib/members";
import { BenefitsAccordion } from "./benefits-accordion";
import { MemberPhotoCarousel } from "./member-photo-carousel";

const BENEFITS = [
    { title: "Build Real-World Experience", body: "Apply technical knowledge through practical projects, competitions, and hands-on experiences that go beyond the classroom." },
    { title: "Connect With Like-Minded People", body: "Meet students who share an interest in technology, innovation, and problem-solving. Build meaningful connections and collaborate with people who share your passion." },
    { title: "Participate in Competitions", body: "Challenge yourself through hackathons, programming contests, and other technical competitions. Put your skills to the test and learn from every experience." },
    { title: "Develop Leadership Skills", body: "Take responsibility, collaborate with teams, organize initiatives, and develop communication and leadership skills through real experiences." },
    { title: "Explore New Technologies", body: "Discover emerging technologies and develop knowledge beyond the traditional academic curriculum. Stay curious and explore what's next in technology." },
] as const;

export function WhyJoin() {
    return (
        <section
            aria-labelledby="why-join-heading"
            id="why-join"
            className="scroll-mt-16 border-t border-ink/10 bg-ink text-paper on-ink md:scroll-mt-20"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-6 md:py-20 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">

                    {/* LEFT — intro + accordion */}
                    <div className="flex flex-col">
                        <div>
                            <SlideIn>
                                <p className="label-caps text-paper/60">Why Join BUCC</p>
                            </SlideIn>
                            <h2 id="why-join-heading" className="heading-2 mt-2">
                                <SlideIn>More Than a Club.</SlideIn>{" "}
                                <SlideIn delay={150}>
                                    <span className="text-paper/50">A Community to Grow With.</span>
                                </SlideIn>
                            </h2>
                        </div>
                        <SlideIn delay={200}>
                            <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/65 md:text-base">
                                BUCC brings together curious minds who want to explore technology,
                                develop their skills, collaborate on meaningful projects, and grow
                                beyond the classroom.
                            </p>
                        </SlideIn>
                        <div className="mt-8">
                            <BenefitsAccordion benefits={BENEFITS} />
                        </div>
                    </div>

                    {/* RIGHT — carousel + CTA */}
                    <div className="flex flex-col">
                        <MemberPhotoCarousel photos={MEMBER_PHOTOS} />

                        <div className="mt-7 flex items-center justify-between gap-4 border-t border-paper/15 pt-5">
                            <div>
                                <p className="text-sm font-semibold text-paper">Ready to be part of something bigger?</p>
                                <p className="mt-1 text-xs text-paper/50">Start your journey with BUCC.</p>
                            </div>
                            <Link
                                href="/register"
                                className="group inline-flex shrink-0 rounded-sm items-center gap-3 bg-lime px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition duration-300 hover:bg-lime-400"
                            >
                                Become a Member
                                <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
