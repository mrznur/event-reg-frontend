import { SlideIn } from "@/components/motion/reveal";

interface Props {
    eyebrow: string;
    headingId: string;
    line1: string;
    line2: string;
    eyebrowClassName?: string;
    line2ClassName?: string;
}

export function SectionHeading({ eyebrow, headingId, line1, line2, eyebrowClassName = "text-stone-text", line2ClassName = "text-stone-text" }: Props) {
    return (
        <div>
            <SlideIn>
                <p className={`label-caps ${eyebrowClassName}`}>{eyebrow}</p>
            </SlideIn>
            <h2 id={headingId} className="heading-2 mt-2">
                <SlideIn>{line1}</SlideIn>{" "}
                <SlideIn delay={150}>
                    <span className={line2ClassName}>{line2}</span>
                </SlideIn>
            </h2>
        </div>
    );
}
