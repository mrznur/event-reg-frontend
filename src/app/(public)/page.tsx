import { CtaLink } from "@/components/shared/cta-link";
import { SlideIn } from "@/components/motion/reveal";
import { BtnSecond, PlainButton } from "@/components/shared/btn-second";

export default function Home() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Space background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Large distant planet */}
        <div className="absolute -right-12 top-12 h-52 w-52 rounded-full bg-gradient-to-br from-lime/50 via-lime/20 to-transparent blur-[2px] md:right-24 md:top-16 md:h-72 md:w-72">
          <div className="absolute left-10 top-12 h-8 w-8 rounded-full bg-lime/20 blur-sm" />
          <div className="absolute bottom-16 right-12 h-12 w-12 rounded-full bg-lime/20 blur-md" />
        </div>

        {/* Floating asteroid fragments */}
        <div className="asteroid-field">
          <span className="asteroid-fragment fragment-1" />
          <span className="asteroid-fragment fragment-2" />
          <span className="asteroid-fragment fragment-3" />
          <span className="asteroid-fragment fragment-4" />
          <span className="asteroid-fragment fragment-5" />
          <span className="asteroid-fragment fragment-6" />
          <span className="asteroid-fragment fragment-7" />
          <span className="asteroid-fragment fragment-8" />
          <span className="asteroid-fragment fragment-9" />
          <span className="asteroid-fragment fragment-10" />
          <span className="asteroid-fragment fragment-11" />
          <span className="asteroid-fragment fragment-12" />
        </div>

        {/* Tiny distant planet */}
        <div className="absolute bottom-16 left-[38%] h-12 w-12 rounded-full bg-gradient-to-br from-lime/50 to-green-900/50 blur-[1px] md:bottom-24 md:h-16 md:w-16" />

        {/* Small stars */}
        <div className="absolute left-[45%] top-[18%] h-1.5 w-1.5 rounded-full bg-lime" />
        <div className="absolute right-[35%] top-[65%] h-1 w-1 rounded-full bg-lime/70" />
        <div className="absolute left-[8%] bottom-[20%] h-2 w-2 rounded-full bg-lime/60" />
        <div className="absolute right-[5%] top-[45%] h-1.5 w-1.5 rounded-full bg-lime" />
      </div>

      {/* Hero content */}
      <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-6 md:py-36 lg:px-8">

        <h1 className="display-xl relative mt-4 max-w-4xl">
          <SlideIn>Big ideas.</SlideIn>{" "}
          <SlideIn delay={150}>Real people.</SlideIn>
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CtaLink href="/signup">Register Now!</CtaLink>
          <BtnSecond href="/events">Explore Events</BtnSecond>
        </div>

      </div>
    </section>
  );
}
