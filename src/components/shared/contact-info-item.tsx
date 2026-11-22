interface Props {
    label: string;
    accent?: boolean;
    children: React.ReactNode;
}

export function ContactInfoItem({ label, accent = false, children }: Props) {
    return (
        <div className={`border-l-2 pl-4 ${accent ? "border-lime" : "border-ink/15"}`}>
            <p className="label-caps text-stone-text">{label}</p>
            <div className="mt-1 font-semibold">{children}</div>
        </div>
    );
}
