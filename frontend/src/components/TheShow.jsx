import { siteConfig } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";


export const TheShow = () => (
    <section id="the-show" data-testid="the-show-section" className="stage-glow relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
            <ChapterHeading number="01" overline="The Show" title={<>A World-First<br /><span className="gold-text italic">Musical Celebration</span></>} />

            <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-10">
                <Reveal className="md:col-span-5" delay={0.1}>
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.18),transparent_65%)]" aria-hidden="true" />
                        <div className="relative overflow-hidden rounded-xl border border-[#d4af37]/25 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                            <img
                                src={siteConfig.eventImages.portraitPoster}
                                alt="NZ Sings Bollywood – 90s with 90 portrait poster showing choir and live symphony orchestra"
                                data-testid="the-show-image"
                                loading="lazy"
                                className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03] sm:aspect-[3/3.4]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" aria-hidden="true" />
                            <p className="font-accent absolute bottom-5 left-5 right-5 text-lg italic leading-snug text-[#f3e5ab]">
                                "This is not just another Bollywood concert."
                            </p>
                        </div>
                    </div>
                </Reveal>

                <div className="md:col-span-7 md:pl-6">
                    <Reveal delay={0.15}>
                        <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
                            <strong className="font-semibold text-white">New Zealand Sings Bollywood – 90s with 90</strong> is a landmark cultural
                            celebration where New Zealand pays tribute to Bollywood through music. It brings together multicultural performers,
                            professional choir singers, musicians, orchestra, and contemporary band elements to reimagine iconic 90s Bollywood songs
                            on a scale not seen before.
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <p className="mt-6 text-base leading-relaxed text-zinc-400 md:text-lg">
                            Whether these songs defined your childhood or you're discovering them for the first time, prepare for an evening of
                            goosebumps, nostalgia, joy and unforgettable musical moments unlike anything you've experienced before.
                        </p>
                    </Reveal>
                    <Reveal delay={0.35}>
                        <div className="mt-10 border-l-2 border-[#d4af37] pl-6">
                            <p className="font-accent text-xl italic leading-relaxed text-[#f3e5ab] md:text-2xl">
                                A once-in-a-generation musical experience that will set a new benchmark for live entertainment in New Zealand.
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.45}>
                        <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">
                            {`New Zealand Pays Tribute to Bollywood`}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                            Celebrating 75 years of India–New Zealand friendship through music
                        </p>
                    </Reveal>
                </div>
            </div>
        </div>
    </section>
);
