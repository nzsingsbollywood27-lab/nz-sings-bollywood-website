import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const ConnectionMotif = () => (
    <svg viewBox="0 0 600 220" fill="none" aria-hidden="true" className="w-full max-w-xl opacity-70">
        <path d="M60 160 C 200 40, 400 40, 540 160" stroke="url(#g75)" strokeWidth="1.2" strokeDasharray="4 6" />
        <circle cx="60" cy="160" r="5" fill="#d4af37" />
        <circle cx="60" cy="160" r="14" stroke="#d4af37" strokeOpacity="0.4" />
        <circle cx="540" cy="160" r="5" fill="#f3e5ab" />
        <circle cx="540" cy="160" r="14" stroke="#f3e5ab" strokeOpacity="0.4" />
        <text x="60" y="200" fill="#a1a1aa" fontSize="13" letterSpacing="3" textAnchor="middle" fontFamily="Manrope, sans-serif">INDIA</text>
        <text x="540" y="200" fill="#a1a1aa" fontSize="13" letterSpacing="3" textAnchor="middle" fontFamily="Manrope, sans-serif">AOTEAROA</text>
        <defs>
            <linearGradient id="g75" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d4af37" />
                <stop offset="1" stopColor="#f3e5ab" />
            </linearGradient>
        </defs>
    </svg>
);

export const SeventyFiveYears = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

    return (
        <section id="75-years" ref={ref} data-testid="seventyfive-section" className="stage-glow relative overflow-hidden border-t border-[#d4af37]/10 py-24 md:py-36">
            <motion.span
                aria-hidden="true"
                style={{ y }}
                className="outline-num font-display pointer-events-none absolute -left-[4vw] top-1/2 -translate-y-1/2 select-none text-[60vw] font-black leading-none md:text-[30vw]"
            >
                75
            </motion.span>

            <div className="relative mx-auto max-w-7xl px-5 md:px-8">
                <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
                    <div className="md:col-span-7">
                        <ChapterHeading
                            number="03"
                            overline="75 Years"
                            title={<>75 Years.<br /><span className="gold-text italic">One Shared Connection.</span></>}
                        >
                            Celebrating India and New Zealand through music.
                        </ChapterHeading>

                        <Reveal delay={0.1}>
                            <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
                                90s with 90 celebrates <strong className="font-semibold text-white">75 years of diplomatic and cultural ties
                                between India and New Zealand</strong>, recognising the people, communities and cultural connections that have
                                continued to bring the two countries closer.
                            </p>
                            <p className="mt-6 text-base leading-relaxed text-zinc-400 md:text-lg">
                                Bollywood has played an extraordinary role in connecting people across cultures and generations.
                            </p>
                            <p className="mt-6 text-base leading-relaxed text-zinc-300 md:text-lg">
                                This concert is a <strong className="font-semibold text-[#f3e5ab]">musical tribute from New Zealand to
                                Bollywood</strong>, celebrating its creativity, influence and enduring place in the cultural lives of people
                                across Aotearoa.
                            </p>
                        </Reveal>
                    </div>

                    <div className="flex flex-col items-center justify-center md:col-span-5">
                        <Reveal delay={0.2} className="w-full">
                            <div className="rounded-2xl border border-[#d4af37]/15 bg-white/[0.02] p-8 md:p-10">
                                <ConnectionMotif />
                                <p className="font-accent mt-8 text-center text-2xl italic leading-snug text-[#f3e5ab]">
                                    Two nations. One stage.<br />One song, seventy-five years in the making.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};
