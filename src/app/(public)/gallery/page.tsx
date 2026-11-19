import { Suspense } from "react";
import { getGallery, ApiError, type GalleryImage } from "@/lib/api";

export const metadata = {
    title: "Gallery | BUCC",
    description: "Photos and highlights from BUCC events.",
};

async function GalleryGrid() {
    let images: GalleryImage[] = [];
    let failed = false;

    try {
        images = await getGallery();
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
            images = [];
        } else {
            failed = true;
        }
    }

    if (failed) {
        return (
            <p className="text-stone-text">
                Gallery could not be loaded right now. Please try again shortly.
            </p>
        );
    }

    if (images.length === 0) {
        return (
            <p className="text-stone-text">
                No photos yet. Check back after our next event.
            </p>
        );
    }

    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
                <li key={img.id} className="group overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.url}
                        alt={img.caption || img.title}
                        className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {(img.title || img.caption) && (
                        <div className="mt-2 px-1">
                            {img.title && (
                                <p className="text-sm font-semibold">{img.title}</p>
                            )}
                            {img.caption && (
                                <p className="text-sm text-stone-text">{img.caption}</p>
                            )}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function GalleryPage() {
    return (
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
            <header className="mb-10">
                <p className="label-caps text-stone-text">BUCC</p>
                <h1 className="heading-2 mt-2">Gallery</h1>
                <p className="mt-4 max-w-xl text-base text-stone-text">
                    Highlights from our workshops, hackathons, talks, and social events.
                </p>
            </header>

            <Suspense
                fallback={
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <li key={i} className="aspect-[3/2] animate-pulse bg-stone/10" />
                        ))}
                    </ul>
                }
            >
                <GalleryGrid />
            </Suspense>
        </div>
    );
}
