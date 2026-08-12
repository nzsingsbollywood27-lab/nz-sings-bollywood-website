import { ArrowDown } from "lucide-react";
import { partnersConfig, supportersConfig, charityConfig } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const FEATURED_CATEGORIES = new Set(["Founding Partner", "Prime Partner", "Technology Partner"]);

const categoryLabel = (category) => {
    if (category === "Powered By Partner") return "Powered by Partners";
    return category;
};

const partnerGridClass = (count, isFeatured) => {
    if (isFeatured && count === 1) return "grid grid-cols-1";
    if (count === 1) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count === 2) return "grid grid-cols-1 gap-5 sm:grid-cols-2";
    if (count === 4) return "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4";
    return "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";
};

const LogoOrName = ({ partner, isFeatured }) => {
    const nameClass = `${isFeatured ? "text-xl md:text-2xl" : "text-base md:text-lg"} font-display text-center font-semibold leading-snug text-white`;

    if (!partner.logo) {
        return <span className={nameClass}>{partner.name}</span>;
    }

    return (
        <>
            <span className="flex min-h-[72px] w-full items-center justify-center rounded-xl bg-[#f8f3e8] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.18),0_14px_36px_rgba(0,0,0,0.28)]">
                <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.closest("[data-logo-plaque]").style.display = "none";
                        const fallback = event.currentTarget.closest("[data-partner-card]").querySelector("[data-logo-fallback]");
                        if (fallback) fallback.style.display = "block";
                    }}
                    className={`${isFeatured ? "max-h-20" : "max-h-14"} w-auto max-w-full object-contain`}
                />
            </span>
            <span data-logo-fallback className={`${nameClass} hidden`}>
                {partner.name}
            </span>
        </>
    );
};

const PartnerCard = ({ partner, testId, isFeatured }) => (
    <a
        href={partner.url || "#"}
        data-testid={testId}
        data-partner-card
        aria-label={partner.name}
        title={partner.name}
        className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#d4af37]/15 bg-black/45 text-center shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/55 hover:bg-black/65 ${
            isFeatured ? "min-h-[180px] px-7 py-7" : "min-h-[146px] px-5 py-5"
        }`}
    >
        <span
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14),transparent_66%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
        />

        <span data-logo-plaque className="relative flex w-full items-center justify-center">
            <LogoOrName partner={partner} isFeatured={isFeatured} />
        </span>

        {partner.logo && (
            <span className="relative mt-4 block text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 transition-colors duration-300 group-hover:text-[#d4af37]">
                {partner.name}
            </span>
        )}
    </a>
);

const CategoryBlock = ({ category, partners, index }) => {
    const isFeatured = FEATURED_CATEGORIES.has(category);

    return (
        <Reveal delay={0.05 * index}>
            <section
                aria-label={category}
                className={`rounded-3xl border bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-7 ${
                    isFeatured ? "border-[#d4af37]/35" : "border-white/10"
                }`}
            >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p className="flex shrink-0 items-center gap-3 text-[11px] font-black uppercase tracking-[0.34em] text-[#d4af37]">
                        <span className="h-2 w-2 rounded-full bg-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.8)]" aria-hidden="true" />
                        {categoryLabel(category)}
                    </p>
                    <span className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/35 via-[#d4af37]/10 to-transparent" aria-hidden="true" />
                </div>

                <div className={partnerGridClass(partners.length, isFeatured)}>
                    {partners.map((partner, partnerIndex) => (
                        <PartnerCard
                            key={partner.name}
                            partner={partner}
                            isFeatured={isFeatured}
                            testId={`partner-logo-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${partnerIndex}`}
                        />
                    ))}
                </div>
            </section>
        </Reveal>
    );
};

export const PartnersSupporters = () => {
    const activeCategories = partnersConfig.filter((category) => category.partners.length > 0);

    return (
        <section id="partners" data-testid="partners-section" className="relative overflow-hidden border-t border-[#d4af37]/10 bg-[#080706] py-24 md:py-32">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_55%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute left-1/2 top-64 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#d4af37]/[0.035] blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto max-w-7xl px-5 md:px-8">
                <ChapterHeading
                    number="04"
                    overline="Partners & Supporters"
                    title={<>Made possible through <span className="gold-text italic">music, culture,<br className="hidden sm:block" /> diversity and community.</span></>}
                >
                    90s with 90 is made possible through the support of organisations that believe in the power of music, culture, diversity and
                    community. We thank our partners and supporters for helping bring New Zealand Sings Bollywood – 90s with 90 to the stage.
                </ChapterHeading>

                <div className="mt-4 rounded-[2rem] border border-[#d4af37]/15 bg-black/30 p-4 shadow-[0_35px_120px_rgba(0,0,0,0.45)] md:p-6 lg:p-8">
                    <div className="mb-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#d4af37]">
                            Partner Showcase
                        </p>
                        <h3 className="font-display mt-3 text-3xl font-semibold text-white md:text-5xl">
                            Proudly supported by our partners
                        </h3>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
                            A premium sponsor wall for the organisations helping bring this landmark cultural production to life.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {activeCategories.map((category, index) => (
                            <CategoryBlock
                                key={category.category}
                                category={category.category}
                                partners={category.partners}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                <Reveal delay={0.1} className="mt-20">
                    <p className="mb-5 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#c0c0c0]">
                        Supporters & Production Partners
                        <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {supportersConfig.map((supporter, index) => (
                            <a
                                key={supporter.name}
                                href={supporter.url}
                                data-testid={`supporter-logo-${index}`}
                                aria-label={supporter.name}
                                className="group flex min-h-[96px] items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#d4af37]/50"
                            >
                                {supporter.logo ? (
                                    <img src={supporter.logo} alt={supporter.name} loading="lazy" className="max-h-12 w-auto object-contain" />
                                ) : (
                                    <span className="font-display text-center text-base font-medium leading-snug text-zinc-200 transition-colors duration-300 group-hover:text-[#f3e5ab]">
                                        {supporter.name}
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>
                    <p data-testid="charity-support-line" className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37]/80">
                        {charityConfig.line}
                    </p>
                </Reveal>

                <Reveal delay={0.15} className="mt-20 text-center">
                    <p className="font-display text-2xl font-semibold text-white sm:text-3xl">Interested in partnering with us?</p>
                    <a
                        href="#contact"
                        data-testid="become-a-partner-btn"
                        className="group mt-7 inline-flex items-center gap-3 rounded-full border border-[#d4af37]/60 px-10 py-4 text-sm font-bold uppercase tracking-[0.22em] text-[#d4af37] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#d4af37] hover:text-black"
                    >
                        Become a Partner
                        <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                    </a>
                </Reveal>
            </div>
        </section>
    );
};
