export const SITE_NAME = "BUCC";

export const NAV_LINKS = [
    { href: "/events", label: "Events" },
    { href: "/#about", label: "About" },
    { href: "/#why-join", label: "Why Join" },
    { href: "/#contact", label: "Contact" },
] as const;

export const EVENT_CATEGORIES = [
    { value: "WORKSHOP", label: "Workshop" },
    { value: "HACKATHON", label: "Hackathon" },
    { value: "TALK", label: "Talk" },
    { value: "SOCIAL", label: "Social" },
] as const;
