interface Props {
    id?: string;
    ariaLabelledBy?: string;
    className?: string;
    innerClassName?: string;
    children: React.ReactNode;
}

export function SectionContainer({ id, ariaLabelledBy, className = "", innerClassName = "", children }: Props) {
    return (
        <section
            id={id}
            aria-labelledby={ariaLabelledBy}
            className={`scroll-mt-16 md:scroll-mt-20 ${className}`}
        >
            <div className={`mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8 ${innerClassName}`}>
                {children}
            </div>
        </section>
    );
}
