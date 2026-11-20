import { SlideIn } from "@/components/motion/reveal";
import { ArrowRight } from "lucide-react";

const BENEFITS = [
    {
        title: "Build Real-World Experience",
        body: "Apply technical knowledge through practical projects, competitions, and hands-on experiences that go beyond the classroom.",
    },
    {
        title: "Connect With Like-Minded People",
        body: "Meet students who share an interest in technology, innovation, and problem-solving.",
    },
    {
        title: "Participate in Competitions",
        body: "Challenge yourself through hackathons, programming contests, and other technical competitions.",
    },
    {
        title: "Develop Leadership Skills",
        body: "Take responsibility, collaborate with teams, organize initiatives, and develop communication skills.",
    },
    {
        title: "Explore New Technologies",
        body: "Discover emerging technologies and develop knowledge beyond the traditional academic curriculum.",
    },
] as const;

export function WhyJoin() {
    return (
        <section
            aria-labelledby="why-join-heading"
            id="why-join"
            className="scroll-mt-16 border-t border-ink/10 bg-ink text-paper on-ink md:scroll-mt-20"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                    {/* Left */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <SlideIn><p className="label-caps text-paper/60">Why BUCC</p></SlideIn>
                            <h2 id="why-join-heading" className="heading-2 mt-2">
                                <SlideIn>More Than a Club.</SlideIn>{" "}
                                <SlideIn delay={150}><span className="text-paper/50">A Community to Grow With.</span></SlideIn>
                            </h2>
                        </div>
                        <SlideIn delay={200}>
                            <p className="max-w-md text-base leading-relaxed text-paper/70">
                                BUCC brings together curious minds who want to explore technology,
                                develop their skills, collaborate on meaningful projects, and grow
                                beyond the classroom.
                            </p>
                        </SlideIn>
                        <div className="mt-auto">
                            <a
                                href="/signup"
                                className="group label-caps inline-flex cursor-pointer items-center gap-3 bg-lime px-6 py-3.5 text-ink transition duration-300 hover:bg-lime-400"
                            >
                                Become a Member
                                <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>

                    {/* Right — benefits */}
                    <ul className="flex flex-col divide-y divide-paper/10">
                        {BENEFITS.map((b, i) => (
                            <li key={b.title} className="flex gap-4 py-5">
                                <span className="label-caps mt-1 w-6 shrink-0 text-lime/70">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <p className="font-semibold text-paper">{b.title}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-paper/60">{b.body}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
