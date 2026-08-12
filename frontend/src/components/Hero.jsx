import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Globe2, Mic, Music, Guitar, Sparkles, Handshake, Heart, ChevronDown } from "lucide-react";
import { siteConfig, eventConfig, charityConfig } from "../config";
import { CountdownTimer } from "./CountdownTimer";
import { TicketButton } from "./TicketButton";
import { MaskedLine } from "./Reveal";

const HIGHLIGHTS = [
    { icon: Globe2, text: "The world's first multi-ethnic Bollywood choir concert" },
    { icon: Mic, text: "90 performers live on stage" },
    { icon: Music, text: "Live symphony orchestra" },
    { icon: Guitar, text: "Contemporary live band" },
    { icon: Sparkles, text: "90s Bollywood hits presented like never before" },
    { icon: Handshake, text: "Celebrating 75 years of India–New Zealand friendship" },
    { icon: Heart, text: `Proudly supporting ${charityConfig.name}` },
];

export const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const numY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
    const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

    const particles = useMemo(
        () =>
            Array.from({ length: 18 }, (_, i) => ({
                left: `${(i * 53 + 7) % 100}%`,
                top: `${(i * 37 + 11) % 90}%`,
                delay: `${(i % 7) * 0.8}s`,
                size: 2 + (i % 3),
            })),
        [],
    );

    return (
        <section id="home" ref={ref} data-testid="hero-section" className="stage-glow relative flex min-h-screen flex-col overflow-hidden pt-[76px]">
            <motion.span
                aria-hidden="true"
                style={{ y: numY }}
                className="outline-num font-display pointer-events-none absolute -right-[6vw] top-[8vh] select-none text-[52vw] font-black leading-none md:text-[34vw]"
            >
                90
            </motion.span>

            {particles.map((p, i) => (
                <span
                    key={i}
                    aria-hidden="true"
                    className="twinkle pointer-events-none absolute rounded-full bg-[#f3e5ab]"
                    style={{ left: p.left, top: p.top, animationDelay: p.delay, width: p.size, height: p.size }}
                />
            ))}

            <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-16 text-center md:px-8">
                <motion.img
                    src={siteConfig.brandTitleImage}
                    alt="New Zealand Sings Bollywood – 90's with 90"
                    data-testid="hero-brand-title"
                    className="w-full max-w-xl drop-shadow-[0_0_45px_rgba(212,175,55,0.25)] md:max-w-2xl"
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(14px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />

                <h1 className="font-display mt-10 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    <MaskedLine delay={0.5}>A World-First Musical Celebration.</MaskedLine>
                    <MaskedLine delay={0.68} className="gold-text mt-1 pb-2 italic">A Night That Will Make History.</MaskedLine>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base"
                >
                    For one unforgettable night, Bollywood's golden era comes alive in a way the world has never seen before.{" "}
                    <strong className="font-semibold text-[#f3e5ab]">New Zealand Sings Bollywood – 90s with 90</strong> is the world's first
                    multi-ethnic Bollywood choir concert, bringing together <strong className="font-semibold text-[#f3e5ab]">90 professional singers and musicians</strong>{" "}
                    in a breathtaking production that reimagines the greatest Bollywood songs of the 90s with the grandeur of a live symphony orchestra,
                    contemporary band, and professional choir.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="font-accent mt-5 text-xl italic text-[#d4af37] sm:text-2xl"
                >
                    One night. One stage. One historic event.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.35, duration: 0.9 }}
                    className="mt-10"
                >
                    <CountdownTimer />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.9 }}
                    className="mt-9 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 sm:text-xs"
                >
                    {eventConfig.detailsLine}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.9 }}
                    className="mt-7"
                >
                    <TicketButton size="lg" testId="hero-buy-tickets-btn" showNote />
                </motion.div>

                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.85, duration: 1 }}
                    className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-2 lg:grid-cols-3"
                >
                    {HIGHLIGHTS.map(({ icon: Icon, text }, i) => (
                        <li
                            key={i}
                            data-testid={`hero-highlight-${i}`}
                            className="flex items-center gap-3 rounded-lg border border-[#d4af37]/15 bg-white/[0.02] px-4 py-3 backdrop-blur-sm transition-colors duration-300 hover:border-[#d4af37]/40"
                        >
                            <Icon className="h-4 w-4 shrink-0 text-[#d4af37]" aria-hidden="true" />
                            <span className="text-xs leading-snug text-zinc-300">{text}</span>
                        </li>
                    ))}
                </motion.ul>
            </motion.div>

            <motion.a
                href="#initiative"
                data-testid="hero-scroll-indicator"
                aria-label="Scroll down"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="relative z-10 mx-auto mb-8 text-[#d4af37]/60 transition-colors hover:text-[#d4af37]"
            >
                <ChevronDown className="h-6 w-6 animate-bounce" />
            </motion.a>
        </section>
    );
};
