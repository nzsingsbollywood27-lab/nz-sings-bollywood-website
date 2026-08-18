import { organisersConfig } from "../config";
import { useCms } from "../cms/CmsProvider";
import { Reveal } from "./Reveal";

export const InitiativeBy = () => {
    const { content } = useCms();
    const organisers = content.organisers || organisersConfig;

    return (
        <section
            id="initiative"
            data-testid="initiative-section"
            aria-label="An initiative by"
            className="relative overflow-hidden bg-white py-14 md:py-18"
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/45 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" aria-hidden="true" />

            <div className="mx-auto max-w-6xl px-5 md:px-8">
                <Reveal>
                    <p className="text-center text-[11px] font-bold uppercase tracking-[0.35em] text-zinc-700">
                        An initiative by
                    </p>

                    <div className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-3">
                        {organisers.map((org, i) => {
                            const isExternal = org.url && org.url !== "#";
                            return (
                                <a
                                    key={`${org.name}-${i}`}
                                    href={org.url || "#"}
                                    data-cms-link-key={`organisers.${i}.url`}
                                    data-testid={`organiser-logo-${i}`}
                                    aria-label={org.name}
                                    title={org.name}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noreferrer" : undefined}
                                    className="group relative flex min-h-[150px] items-center justify-center overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-white px-7 py-7 shadow-[0_16px_48px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/75 hover:shadow-[0_24px_65px_rgba(0,0,0,0.16)]"
                                >
                                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.10),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    {org.logo ? (
                                        <span className="relative flex h-[112px] w-full items-center justify-center">
                                            <img
                                                data-cms-img-key={`organisers.${i}.logo`}
                                                src={org.logo}
                                                alt={org.name}
                                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                                            />
                                        </span>
                                    ) : (
                                        <span className="font-display relative max-w-[220px] text-center text-base font-semibold leading-snug text-zinc-800 transition-colors duration-300 group-hover:text-[#a8821f] md:text-lg">
                                            {org.name}
                                        </span>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};
