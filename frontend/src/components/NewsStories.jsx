import { Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { newsConfig, socialConfig } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

export const NewsStories = () => (
    <section id="news" data-testid="news-section" className="relative border-t border-[#d4af37]/10 bg-[#080706] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
            <ChapterHeading number="06" overline="News & Stories" title={<>Follow <span className="gold-text italic">the Journey</span></>}>
                Behind the scenes. 90s nostalgia. Performer announcements. Rehearsals. Event updates.
            </ChapterHeading>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {newsConfig.map((story, i) => (
                    <Reveal key={story.title} delay={0.07 * i}>
                        <article
                            data-testid={`news-card-${i}`}
                            className="group flex h-full min-h-[240px] flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#d4af37]/45"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="font-accent text-lg italic text-[#d4af37]/70">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="rounded-full border border-[#d4af37]/25 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/80">
                                        {story.tag}
                                    </span>
                                </div>
                                <h3 className="font-display mt-5 text-xl font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#f3e5ab]">
                                    {story.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{story.excerpt}</p>
                            </div>
                            <p className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                                Story arriving soon
                                <ArrowUpRight className="h-3.5 w-3.5 text-[#d4af37]/60" aria-hidden="true" />
                            </p>
                        </article>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={0.2} className="mt-14">
                <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-white/10 bg-white/[0.02] px-8 py-7 sm:flex-row">
                    <p className="text-sm text-zinc-400">
                        <span className="font-semibold text-white">Follow the journey</span> — announcements, rehearsals and 90s nostalgia.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href={socialConfig.instagram}
                            data-testid="news-instagram-link"
                            aria-label="Follow on Instagram"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-[border-color,color,background-color] duration-300 hover:border-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a
                            href={socialConfig.facebook}
                            data-testid="news-facebook-link"
                            aria-label="Follow on Facebook"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-[border-color,color,background-color] duration-300 hover:border-[#d4af37] hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </Reveal>
        </div>
    </section>
);
