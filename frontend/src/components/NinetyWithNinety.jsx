import { Mic, Music, Guitar, Users, Globe2, Disc3, Quote } from "lucide-react";
import { siteConfig } from "../config";
import { useCms } from "../cms/CmsProvider";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";
import { TicketButton } from "./TicketButton";

const STATS = [
    { icon: Mic, title: "90 Performers", sub: "Established artists, one stage" },
    { icon: Users, title: "Professional Choir", sub: "Auckland Chamber Choir – Viva Voce" },
    { icon: Music, title: "Live Symphony Orchestra", sub: "St Matthew's Chamber Orchestra" },
    { icon: Guitar, title: "Contemporary Live Band", sub: "A full modern sound" },
    { icon: Globe2, title: "Multi-Ethnic Performers", sub: "From across Aotearoa" },
    { icon: Disc3, title: "90s Bollywood Classics", sub: "Music re-arranged in Bollywood, Mumbai" },
];

export const NinetyWithNinety = () => {
    const { content } = useCms();
    const site = content.site || siteConfig;

    return (
    <section id="90s-with-90" data-testid="ninety-section" className="relative border-t border-[#d4af37]/10 bg-[#080706] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
            <ChapterHeading
                number="02"
                overline="90s with 90"
                title={<>90 Performers. One Stage.<br /><span className="gold-text italic">One Extraordinary Celebration.</span></>}
            >
                For the first time in New Zealand, Bollywood's 90s music will be brought to life through a large-scale choir and orchestral
                production featuring 90 established artists on one stage.
            </ChapterHeading>

            <Reveal delay={0.08} className="mb-14">
                <div className="relative overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
                    <img
                        data-cms-img-key="site.eventImages.landscapePoster"
                        src={site.eventImages?.landscapePoster || siteConfig.eventImages.landscapePoster}
                        alt="Latest NZ Sings Bollywood – 90s with 90 event poster showing 90 performers, choir and live symphony orchestra"
                        loading="lazy"
                        className="w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden="true" />
                </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {STATS.map(({ icon: Icon, title, sub }, i) => (
                    <Reveal key={title} delay={0.06 * i}>
                        <div
                            data-testid={`stat-card-${i}`}
                            className="group h-full rounded-xl border border-[#d4af37]/15 bg-white/[0.02] p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#d4af37]/45 hover:shadow-[0_20px_50px_rgba(212,175,55,0.08)]"
                        >
                            <Icon className="h-6 w-6 text-[#d4af37] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                            <h3 className="font-display mt-5 text-xl font-semibold text-white">{title}</h3>
                            <p className="mt-2 text-sm text-zinc-400">{sub}</p>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={0.1} className="mt-16 max-w-3xl">
                <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
                    The production brings together <strong className="font-semibold text-white">Auckland Chamber Choir – Viva Voce</strong>,{" "}
                    <strong className="font-semibold text-white">St Matthew's Chamber Orchestra</strong>, and professional singers and musicians
                    from across New Zealand.
                </p>
                <p className="mt-6 text-base leading-relaxed text-zinc-400 md:text-lg">
                    The music has been specially arranged in Mumbai by Bollywood composer, arranger and music producer{" "}
                    <strong className="font-semibold text-[#f3e5ab]">Lavine Da Costa</strong>, who has worked alongside some of India's most
                    celebrated composers, including Ajay–Atul, Salim–Sulaiman and Shankar–Ehsaan–Loy, bringing an authentic Bollywood musical
                    signature to this landmark production.
                </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-20">
                <figure data-testid="director-quote" className="relative mx-auto max-w-4xl rounded-2xl border border-[#d4af37]/20 bg-gradient-to-b from-white/[0.04] to-transparent p-8 md:p-14">
                    <Quote className="h-10 w-10 text-[#d4af37]/50" aria-hidden="true" />
                    <blockquote className="font-accent mt-6 text-xl italic leading-relaxed text-zinc-100 md:text-2xl">
                        "90s with 90 is more than a concert, it is a celebration of the music, memories and connections that Bollywood has created
                        across generations and cultures. Bringing 90 established artists together on one stage, including some of New Zealand's
                        finest musical ensembles and independent artists, is our way of paying tribute to Bollywood while celebrating the
                        multicultural spirit of Aotearoa. As we mark 75 years of diplomatic and cultural ties between India and New Zealand, we
                        want audiences to experience what happens when New Zealand comes together to sing Bollywood."
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                        <span className="h-px w-10 bg-[#d4af37]" aria-hidden="true" />
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                            Ashish Ramakrishnan, Event Director
                        </span>
                    </figcaption>
                </figure>
            </Reveal>

            <Reveal delay={0.1} className="mt-20 text-center">
                <p className="font-display text-2xl font-semibold text-white sm:text-3xl">
                    New Zealand comes together to <span className="gold-text italic">celebrate Bollywood.</span>
                </p>
                <TicketButton label="GET YOUR TICKETS" size="lg" testId="ninety-get-tickets-btn" className="mt-8" />
            </Reveal>
        </div>
    </section>
    );
};
