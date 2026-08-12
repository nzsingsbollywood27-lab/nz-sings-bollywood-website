import { organisersConfig } from "../config";
import { Reveal } from "./Reveal";

export const InitiativeBy = () => (
    <section
        id="initiative"
        data-testid="initiative-section"
        aria-label="An initiative by"
        className="relative overflow-hidden bg-[#f6f1e8] py-14 md:py-18"
    >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/45 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" aria-hidden="true" />

        <div className="mx-auto max-w-6xl px-5 md:px-8">
            <Reveal>
                <p className="text-center text-[11px] font-bold uppercase tracking-[0.35em] text-zinc-700">
                    An initiative by
                </p>

                <div className="mt-8 grid grid-cols-1 items-center gap-5 sm:grid-cols-3">
                    {organisersConfig.map((org, i) => (
                        <a
                            key={org.name}
                            href={org.url}
                            data-testid={`organiser-logo-${i}`}
                            aria-label={org.name}
                            title={org.name}
                            className="group relative flex min-h-[128px] items-center justify-center overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-white px-8 py-6 shadow-[0_18px_55px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/75 hover:shadow-[0_26px_70px_rgba(0,0,0,0.18)]"
                        >
                            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_68%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            {org.logo ? (
                                <img
                                    src={org.logo}
                                    alt={org.name}
                                    className={`relative max-h-24 w-auto max-w-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition-transform duration-300 group-hover:scale-[1.04] ${org.logoClassName || ""}`}
                                />
                            ) : (
                                <span className="font-display relative max-w-[220px] text-center text-base font-semibold leading-snug text-zinc-800 transition-colors duration-300 group-hover:text-[#a8821f] md:text-lg">
                                    {org.name}
                                </span>
                            )}
                        </a>
                    ))}
                </div>
            </Reveal>
        </div>
    </section>
);
