import { Reveal } from "./Reveal";

export const ChapterHeading = ({ number, overline, title, align = "left", children }) => (
    <Reveal className={`mb-14 md:mb-20 ${align === "center" ? "text-center" : ""}`}>
        <div className={`flex items-baseline gap-4 ${align === "center" ? "justify-center" : ""}`}>
            <span className="font-accent text-lg italic text-[#d4af37]/80" aria-hidden="true">
                {number}
            </span>
            <span className="h-px w-10 self-center bg-[#d4af37]/50" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#d4af37]">{overline}</span>
        </div>
        <h2 className="font-display mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
        </h2>
        {children && <div className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">{children}</div>}
    </Reveal>
);
