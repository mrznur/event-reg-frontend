export function AsteroidBg() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-12 top-12 h-52 w-52 rounded-full bg-gradient-to-br from-lime/50 via-lime/20 to-transparent blur-[2px] md:right-24 md:top-16 md:h-72 md:w-72" />
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
            <div className="absolute bottom-16 left-[38%] h-12 w-12 rounded-full bg-gradient-to-br from-lime/50 to-green-900/50 blur-[1px] md:bottom-24 md:h-16 md:w-16" />
            <div className="absolute left-[45%] top-[18%] h-1.5 w-1.5 rounded-full bg-lime" />
            <div className="absolute right-[35%] top-[65%] h-1 w-1 rounded-full bg-lime/70" />
            <div className="absolute left-[8%] bottom-[20%] h-2 w-2 rounded-full bg-lime/60" />
            <div className="absolute right-[5%] top-[45%] h-1.5 w-1.5 rounded-full bg-lime" />
        </div>
    );
}
