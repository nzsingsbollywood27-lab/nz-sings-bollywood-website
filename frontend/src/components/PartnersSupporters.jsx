import { ArrowDown } from "lucide-react";
import { partnersConfig, supportersConfig, charityConfig } from "../config";
import { useCms } from "../cms/CmsProvider";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const FEATURED_CATEGORIES = new Set(["Founding Partner", "Prime Partner", "Technology Partner"]);

const categoryLabel = (category) => (category === "Powered By Partner" ? "Powered by Partners" : category);

const partnerGridClass = (count, isFeatured) => {
    if (isFeatured && count === 1) return "grid grid-cols-1";
    if (count === 1) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count === 2) return "grid grid-cols-1 gap-5 sm:grid-cols-2";
    if (count === 4) return "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4";
    return "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";
};

const LogoOrName = ({ partner, isFeatured, type = "partner" }) => {
    const nameClass = `${isFeatured ? "text-xl md:text-2xl" : "text-base md:text-lg"} font-display text-center font-semibold leading-snug text-zinc-950`;

    if (!partner.logo) {
        return <span className={`${nameClass} px-4 py-5`}>{partner.name}</span>;
    }

    const imageClass = type === "supporter"
        ? "max-h-[76px] md:max-h-[92px] w-auto max-w-[94%] object-contain"
        : isFeatured
            ? "max-h-[150px] md:max-h-[176px] w-auto max-w-[96%] object-contain"
            : "max-h-[118px] md:max-h-[144px] w-auto max-w-[96%] object-contain";

    return (
        <>
            <span className={`flex w-full items-center justify-center rounded-xl bg-white px-3 py-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ${isFeatured ? "min-h-[178px] md:min-h-[206px]" : "min-h-[144px] md:min-h-[168px]"}`} data-logo-plaque>
                <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.closest("[data-logo-plaque]").style.display = "none";
                        const fallback = event.currentTarget.closest("[data-partner-card]")?.querySelector("[data-logo-fallback]");
                        if (fallback) fallback.style.display = "block";
                    }}
                    className={imageClass}
                />
            </span>
            <span data-logo-fallback className={`${nameClass} hidden px-4 py-5`}>
                {partner.name}
            </span>
        </>
    );
};

const PartnerCard = ({ partner, testId, isFeatured }) => {
    const isExternal = partner.url && partner.url !== "#";

    return (
        <a
            href={partner.url || "#"}
            data-testid={testId}
            data-partner-card
            aria-label={partner.name}
            title={partner.name}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-white text-center shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/70 hover:shadow-[0_22px_70px_rgba(212,175,55,0.16)] ${
                isFeatured ? "min-h-[250px] px-4 py-4 md:px-6 md:py-6" : "min-h-[210px] px-4 py-4 md:px-5 md:py-5"
            }`}
        >
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
            <span className="relative flex w-full items-center justify-center">
                <LogoOrName partner={partner} isFeatured={isFeatured} />
            </span>
            {partner.logo && (
                <span className="relative mt-4 block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600 transition-colors duration-300 group-hover:text-[#8a6a10]">
                    {partner.name}
                </span>
            )}
        </a>
    );
};

const CategoryBlock = ({ category, partners, index }) => {
    const isFeatured = FEATURED_CATEGORIES.has(category);

    return (
        <Reveal delay={0.05 * index}>
            <section aria-label={category} className={`rounded-3xl border bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-7 ${isFeatured ? "border-[#d4af37]/35" : "border-white/10"}`}>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p className="flex shrink-0 items-center gap-3 text-[11px] font-black uppercase tracking-[0.34em] text-[#d4af37]">
                        <span className="h-2 w-2 rounded-full bg-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.8)]" aria-hidden="true" />
                        {categoryLabel(category)}
                    </p>
                    <span className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/35 via-[#d4af37]/10 to-transparent" aria-hidden="true" />
                </div>
                <div className={partnerGridClass(partners.length, isFeatured)}>
                    {partners.map((partner, partnerIndex) => (
                        <PartnerCard key={`${category}-${partner.name}-${partnerIndex}`} partner={partner} isFeatured={isFeatured} testId={`partner-logo-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${partnerIndex}`} />
                    ))}
                </div>
            </section>
        </Reveal>
    );
};

export const PartnersSupporters = () => {
    const { content } = useCms();
    const sections = content.sections || {};
    const partners = content.partners || partnersConfig;
    const supporters = content.supporters || supportersConfig;
    const charity = content.charity || charityConfig;
    const activeCategories = partners.filter((category) => category.partners?.length > 0);
    const partnersSection = sections.partners || {};

    return (
        <section id="partners" data-testid="partners-section" className="relative overflow-hidden border-t border-[#d4af37]/10 bg-[#080706] py-24 md:py-32">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_55%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute left-1/2 top-64 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#d4af37]/[0.035] blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto max-w-7xl px-5 md:px-8">
                <ChapterHeading number="04" overline={partnersSection.overline || "Partners & Supporters"} title={<>Made possible through <span className="gold-text italic">music, culture,<br className="hidden sm:block" /> diversity and community.</span></>}>
                    {partnersSection.intro || "90s with 90 is made possible through the support of organisations that believe in the power of music, culture, diversity and community. We thank our partners and supporters for helping bring New Zealand Sings Bollywood – 90s with 90 to the stage."}
                </ChapterHeading>
                <div className="mt-4 rounded-[2rem] border border-[#d4af37]/15 bg-black/30 p-4 shadow-[0_35px_120px_rgba(0,0,0,0.45)] md:p-6 lg:p-8">
                    <div className="mb-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#d4af37]">Partner Showcase</p>
                        <h3 className="font-display mt-3 text-3xl font-semibold text-white md:text-5xl">Proudly supported by our partners</h3>
                    </div>
                    <div className="space-y-6">
                        {activeCategories.map((category, index) => <CategoryBlock key={`${category.category}-${index}`} category={category.category} partners={category.partners} index={index} />)}
                    </div>
                </div>
                <Reveal delay={0.1} className="mt-20">
                    <p className="mb-5 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#c0c0c0]">
                        Supporters
                        <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {supporters.map((supporter, index) => {
                            const isExternal = supporter.url && supporter.url !== "#";
                            return (
                                <a key={`${supporter.name}-${index}`} href={supporter.url || "#"} data-testid={`supporter-logo-${index}`} data-partner-card aria-label={supporter.name} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} className="group flex min-h-[150px] items-center justify-center rounded-xl border border-white/15 bg-white p-5 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#d4af37]/50">
                                    {supporter.logo ? <img src={supporter.logo} alt={supporter.name} loading="lazy" className="max-h-[108px] w-auto max-w-[94%] object-contain" /> : <span className="font-display text-center text-base font-medium leading-snug text-zinc-900 transition-colors duration-300 group-hover:text-[#8a6a10]">{supporter.name}</span>}
                                </a>
                            );
                        })}
                    </div>
                    <p data-testid="charity-support-line" className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37]/80">{charity.line}</p>
                </Reveal>
                <Reveal delay={0.15} className="mt-20 text-center">
                    <p className="font-display text-2xl font-semibold text-white sm:text-3xl">{partnersSection.ctaTitle || "Interested in partnering with us?"}</p>
                    <a href="#contact" data-testid="become-a-partner-btn" className="group mt-7 inline-flex items-center gap-3 rounded-full border border-[#d4af37]/60 px-10 py-4 text-sm font-bold uppercase tracking-[0.22em] text-[#d4af37] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#d4af37] hover:text-black">
                        {partnersSection.ctaLabel || "Become a Partner"}
                        <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                    </a>
                </Reveal>
            </div>
        </section>
    );
};
