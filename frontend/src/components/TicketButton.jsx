import { TICKET_URL, eventConfig } from "../config";
import { ArrowRight } from "lucide-react";

export const TicketButton = ({
    label = "BUY TICKETS",
    variant = "gold",
    size = "md",
    className = "",
    testId = "buy-tickets-btn",
    showNote = false,
}) => {
    const sizes = {
        sm: "px-5 py-2.5 text-xs",
        md: "px-8 py-4 text-sm",
        lg: "px-12 py-5 text-base",
    };
    const variants = {
        gold: "bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#a8821f] text-black shadow-[0_0_35px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.55)]",
        dark: "bg-black text-[#d4af37] border border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black",
        outline: "bg-transparent text-[#f3e5ab] border border-[#f3e5ab]/40 hover:border-[#d4af37] hover:text-[#d4af37]",
    };
    return (
        <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
            <a
                href={TICKET_URL}
                data-testid={testId}
                aria-label={`${label} — ${eventConfig.name}`}
                className={`group inline-flex items-center gap-3 rounded-full font-bold uppercase tracking-[0.22em] transition-[box-shadow,background-color,color,transform] duration-300 hover:-translate-y-0.5 ${sizes[size]} ${variants[variant]}`}
            >
                {label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            {showNote && (
                <p className="m-0 max-w-xs text-center text-xs leading-relaxed text-current opacity-60">
                    {eventConfig.ticketNote}
                </p>
            )}
        </div>
    );
};
