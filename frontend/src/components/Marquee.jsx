const ITEMS = [
    "90 PERFORMERS",
    "ONE STAGE",
    "75 YEARS OF CONNECTION",
    "A WORLD-FIRST MUSICAL CELEBRATION",
    "NEW ZEALAND SINGS FOR INDIA",
];

export const Marquee = () => {
    const sequence = [...ITEMS, ...ITEMS];

    return (
        <div
            data-testid="editorial-marquee"
            aria-hidden="true"
            className="relative overflow-hidden border-y border-black/10 bg-[#d4af37] py-5 shadow-[0_0_35px_rgba(212,175,55,0.22)]"
        >
            <div className="marquee-track flex w-max min-w-full items-center whitespace-nowrap">
                {[0, 1].map((group) => (
                    <div key={group} className="flex shrink-0 items-center">
                        {sequence.map((item, index) => (
                            <span key={`${group}-${index}`} className="flex shrink-0 items-center">
                                <span className="font-accent px-8 text-lg font-semibold italic tracking-wide text-black sm:text-xl md:text-2xl">
                                    {item}
                                </span>
                                <span className="text-[11px] text-black/45">&#10022;</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
