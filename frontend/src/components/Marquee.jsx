const ITEMS = [
    "90 PERFORMERS",
    "ONE STAGE",
    "75 YEARS OF CONNECTION",
    "A WORLD-FIRST MUSICAL CELEBRATION",
    "NEW ZEALAND PAYS TRIBUTE TO BOLLYWOOD",
];

export const Marquee = ({ inverted = false }) => {
    const row = [...ITEMS, ...ITEMS, ...ITEMS];
    return (
        <div
            data-testid="editorial-marquee"
            aria-hidden="true"
            className={`relative overflow-hidden border-y py-5 ${
                inverted ? "border-black/10 bg-[#d4af37]" : "border-[#d4af37]/15 bg-[#0a0906]"
            }`}
        >
            <div className="marquee-track flex w-max items-center">
                {[0, 1].map((half) => (
                    <div key={half} className="flex items-center">
                        {row.map((item, i) => (
                            <span key={`${half}-${i}`} className="flex items-center">
                                <span className={`font-accent px-8 text-lg italic tracking-wide sm:text-xl ${inverted ? "text-black" : "text-[#d4af37]/80"}`}>
                                    {item}
                                </span>
                                <span className={`text-[10px] ${inverted ? "text-black/50" : "text-[#d4af37]/40"}`}>&#10022;</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
