import { eventConfig } from "../config";
import { Reveal } from "./Reveal";
import { TicketButton } from "./TicketButton";

export const TicketsCTA = () => (
    <section
        id="tickets"
        data-testid="tickets-cta-section"
        aria-label="Buy tickets"
        className="relative overflow-hidden bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#b8912a] py-24 text-black md:py-28"
    >
        <span aria-hidden="true" className="font-display pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[42vw] font-black leading-none text-black/[0.05] md:text-[24vw]">
            90
        </span>
        <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
            <Reveal>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.4em] text-black/60">One night only</p>
                <h2 className="font-display mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                    BE PART OF THIS<br /><span className="italic">HISTORIC EVENT</span>
                </h2>
                <p className="font-accent mt-6 text-xl italic text-black/75 sm:text-2xl">
                    One stage. 90 performers. One night you'll remember.
                </p>
                <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.3em] text-black/70 sm:text-sm">
                    27 FEBRUARY 2027 | 7:00 PM | AUCKLAND
                </p>
                <div className="mt-10">
                    <TicketButton size="lg" variant="dark" testId="tickets-cta-buy-btn" showNote />
                </div>
            </Reveal>
        </div>
    </section>
);
