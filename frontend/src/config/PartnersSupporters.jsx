import { ArrowDown } from "lucide-react";
import { partnersConfig, supportersConfig, charityConfig } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const partnerGridClass = (count) => {
    if (count === 1) return "mx-auto grid max-w-lg grid-cols-1";
    if (count === 2) return "grid grid-cols-1 gap-5 sm:grid-cols-2";
    return "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";
};

const PartnerCard = ({ partner, testId }) => (
    <a
        href={partner.url || "#"}
        data-testid={testId}
        aria-label={partner.name}
        title={partner.name}
        className="group relative flex min-h-[132px] items-center justify-center overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#f7f1e6] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/70 hover:shadow-[0_24px_70px_rgba(212,175,55,0.15)]"
    >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.13),transparent_68%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {partner.logo ? (
            <img
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                className="relative max-h-20 w-auto max-w-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-[1.04]"
            />
        ) : (
            <span className="font-display relative text-center text-lg font-semibold leading-snug text-zinc-900 transition-colors duration-300 group-hover:text-[#a8821f] md:text-xl">
                {partner.name}
            </span>
        )}
    </a>
);

export const PartnersSupporters = () => {
    const activeCategories = partnersConfig.filter((c) => c.partners.length > 0);

    return (
        <section id="partners" data-testid="partners-section" className="relative border-t border-[#d4af37]/10 bg-[#080706] py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
                <ChapterHeading
                    number="04"
                    overline="Partners & Supporters"
                    title={<>Made possible through <span className="gold-text italic">music, culture,<br className="hidden sm:block" /> diversity and community.</span></>}
                >
                    90s with 90 is made possible through the support of organisations that believe in the power of music, culture, diversity and
                    community. We thank our partners and supporters for helping bring New Zealand Sings Bollywood – 90s with 90 to the stage.
                </ChapterHeading>

                <div className="space-y-16">
                    {activeCategories.map((cat, ci) => (
                        <Reveal key={cat.category} delay={0.05 * ci}>
                            <div>
                                <p className="mb-6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#d4af37]">
                                    {cat.category}
                                    <span className="h-px flex-1 bg-[#d4af37]/15" aria-hidden="true" />
                                </p>
                                <div className={partnerGridClass(cat.partners.length)}>
                                    {cat.partners.map((p, pi) => (
                                        <PartnerCard
                                            key={p.name}
                                            partner={p}
                                            testId={`partner-logo-${cat.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${pi}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.1} className="mt-20">
                    <p className="mb-5 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#c0c0c0]">
                        Supporters & Production Partners
                        <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {supportersConfig.map((s, i) => (
                            <a
                                key={s.name}
                                href={s.url}
                                data-testid={`supporter-logo-${i}`}
                                aria-label={s.name}
                                className="group flex min-h-[96px] items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#d4af37]/50"
                            >
                                {s.logo ? (
                                    <img src={s.logo} alt={s.name} loading="lazy" className="max-h-12 w-auto object-contain" />
                                ) : (
                                    <span className="font-display text-center text-base font-medium leading-snug text-zinc-200 transition-colors duration-300 group-hover:text-[#f3e5ab]">
                                        {s.name}
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
