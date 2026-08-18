import { teamConfig } from "../config";
import { useCms } from "../cms/CmsProvider";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const TeamCard = ({ member, index }) => (
    <article
        data-testid={`team-card-${index}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-gradient-to-b from-white/[0.04] to-transparent transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1.5 hover:border-[#d4af37]/55 hover:shadow-[0_25px_60px_rgba(212,175,55,0.1)]"
    >
        <div className="relative bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.16),transparent_64%),#0b0906] px-6 pb-6 pt-7">
            {member.photo ? (
                <div className="mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#f7f7f4] shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
                    <img
                        data-cms-img-key={`team.${index}.photo`}
                        src={member.photo}
                        alt={`Portrait of ${member.name}`}
                        loading="lazy"
                        className="h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                </div>
            ) : (
                <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.16),transparent_60%),#0c0a07]">
                    <span aria-hidden="true" className="font-display gold-text select-none text-7xl font-bold tracking-tight">
                        {member.initials}
                    </span>
                    <span aria-hidden="true" className="spotlight-cone absolute inset-0" />
                    <span className="absolute bottom-4 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">Portrait arriving soon</span>
                </div>
            )}
        </div>

        <div className="flex flex-1 flex-col p-7">
            <h3 className="font-display text-2xl font-semibold text-white">{member.name}</h3>
            {member.role && (
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">{member.role}</p>
            )}
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{member.bio}</p>
        </div>
    </article>
);

export const TeamBehindEvent = () => {
    const { content } = useCms();
    const team = content.team || teamConfig;
    const section = content.sections?.team || {};

    return (
    <section id="team" data-testid="team-section" className="relative border-t border-[#d4af37]/10 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
            <ChapterHeading number="05" overline={section.overline || "The Team Behind the Event"} title={<>{section.title || "The visionaries behind the production"}</>}>
                {section.intro || "New Zealand Sings Bollywood – 90s with 90 is proudly brought to life by Ashish Ramakrishnan, Dinesh Raniga and Basant Madhur."}
            </ChapterHeading>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((m, i) => (
                    <Reveal key={m.name} delay={0.08 * i}>
                        <TeamCard member={m} index={i} />
                    </Reveal>
                ))}
            </div>

            <Reveal delay={0.2} className="mt-16">
                <p className="font-accent mx-auto max-w-3xl text-center text-xl italic leading-relaxed text-[#f3e5ab] md:text-2xl">
                    {section.closing || "Together, Ashish, Dinesh and Basant combine their expertise in event production, music and community leadership to create a world-class celebration of Bollywood, while commemorating 75 years of friendship between India and New Zealand."}
                </p>
            </Reveal>
        </div>
    </section>
    );
};
