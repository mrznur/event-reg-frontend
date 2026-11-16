import { CtaLink } from "@/components/shared/cta-link";
import { SlideIn } from "@/components/motion/reveal";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-6 lg:px-8">
      <p className="label-caps text-stone-text text-lg">BUCC</p>
      <h1 className="display-xl mt-4">
        <SlideIn>Big ideas.</SlideIn>{" "}
        <SlideIn delay={150}>Real people.</SlideIn>
      </h1>
      <CtaLink href="/events" size="lg" className="mt-10">
        Explore events
      </CtaLink>
    </div>
  );
}
