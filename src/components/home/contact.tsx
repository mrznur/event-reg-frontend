import { SITE_CONFIG } from "@/lib/site-config";
import { AsteroidBg } from "@/components/shared/asteroid-bg";
import { ContactInfoItem } from "@/components/shared/contact-info-item";
import { EnquiryForm } from "./enquiry-form";

export function Contact() {
    const { email, location } = SITE_CONFIG;

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative isolate scroll-mt-16 overflow-hidden border-t border-ink/10 md:scroll-mt-20"
        >
            <AsteroidBg />

            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2">
                    {/* Left — info */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <p className="slide-in label-caps text-stone-text">Get in touch</p>
                            <h2 id="contact-heading" className="heading-2 mt-2">
                                <span className="slide-in block">Let&apos;s Build Something</span>{" "}
                                <span className="slide-in block text-stone-text" style={{ animationDelay: "150ms" }}>Meaningful.</span>
                            </h2>
                            <p className="slide-in mt-4 max-w-md text-base leading-relaxed text-stone-text" style={{ animationDelay: "200ms" }}>
                                Have a question, collaboration idea, or interest in joining BUCC?
                                We&apos;d love to hear from you.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <ContactInfoItem label="Email" accent>
                                <a href={`mailto:${email}`} className="hover:underline underline-offset-4">
                                    {email}
                                </a>
                            </ContactInfoItem>
                            <ContactInfoItem label="Location">
                                <span>{location}</span>
                            </ContactInfoItem>
                        </div>
                    </div>

                    {/* Right — enquiry form */}
                    <div>
                        <p className="label-caps mb-6 text-stone-text">Send us a message</p>
                        <EnquiryForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
