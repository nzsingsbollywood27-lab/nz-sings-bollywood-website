import { useEffect, useState } from "react";
import { eventConfig } from "../config";

const getRemaining = () => {
    const diff = Math.max(0, new Date(eventConfig.dateTimeISO).getTime() - Date.now());
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
    };
};

const Cell = ({ value, label }) => (
    <div className="flex flex-col items-center" data-testid={`countdown-${label.toLowerCase()}`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-[#d4af37]/30 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(243,229,171,0.08)] backdrop-blur-sm sm:h-20 sm:w-20">
            <span className="font-display text-2xl font-semibold tabular-nums text-[#f3e5ab] sm:text-4xl">
                {String(value).padStart(2, "0")}
            </span>
        </div>
        <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">{label}</span>
    </div>
);

export const CountdownTimer = () => {
    const [t, setT] = useState(getRemaining);

    useEffect(() => {
        const id = setInterval(() => setT(getRemaining()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div data-testid="countdown-timer" role="timer" aria-label="Countdown to the event" className="flex items-start justify-center gap-3 sm:gap-5">
            <Cell value={t.days} label="Days" />
            <span className="pt-5 font-display text-2xl text-[#d4af37]/50 sm:pt-6" aria-hidden="true">:</span>
            <Cell value={t.hours} label="Hours" />
            <span className="pt-5 font-display text-2xl text-[#d4af37]/50 sm:pt-6" aria-hidden="true">:</span>
            <Cell value={t.minutes} label="Minutes" />
            <span className="hidden pt-5 font-display text-2xl text-[#d4af37]/50 sm:block sm:pt-6" aria-hidden="true">:</span>
            <span className="hidden sm:block"><Cell value={t.seconds} label="Seconds" /></span>
        </div>
    );
};
