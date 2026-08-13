import { Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { socialConfig } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const socialItems = [
    {
        key: "instagram",
        label: "Instagram",
        href: socialConfig.instagram,
        Icon: Instagram,
        description: "Follow rehearsal moments, performer updates and event highlights.",
        testId: "news-instagram-link",
    },
    {
        key: "facebook",
        label: "Facebook",
        href: socialConfig.facebook,
        Icon: Facebook,
        description: "Follow event announcements, community updates and official posts.",
        testId: "news-facebook-link",
    },
];

const isActiveLink = (href) => href && href !== "#";

export const NewsStories = () => (
    <section id="news" data-testid="news-section" className="relative border-t border-[#d4af37]/10 bg-[#080706] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
            <ChapterHeading number="06" overline="Social Media" title={<>Follow <span className="gold-text italic">the Journey</span></>} />

            <Reveal delay={0.12}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {socialItems.map(({ key, label, href, Icon, description, testId }) => {
                        const active = isActiveLink(href);
                        const content = (
                            <>
                                <div className="flex items-center justify-between gap-5">
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3 className="font-display text-2xl font-semibold text-white">{label}</h3>
                                            {!active && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">Link coming soon</p>}
                                        </div>
                                    </div>
                                    {active && <ArrowUpRight className="h-5 w-5 text-[#d4af37] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />}
                                </div>
                                <p className="mt-6 text-sm leading-relaxed text-zinc-400">{description}</p>
                            </>
                        );

                        return active ? (
                            <a
                                key={key}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                data-testid={testId}
                                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-[#d4af37]/45 hover:bg-[#d4af37]/[0.04]"
                            >
                                {content}
                            </a>
                        ) : (
                            <div
                                key={key}
                                data-testid={testId}
                                className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 opacity-80"
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>
            </Reveal>
        </div>
    </section>
);
