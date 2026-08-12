import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Mail, Send } from "lucide-react";
import { CONTACT_EMAIL } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const ENQUIRY_TYPES = ["Sponsorship", "Partnership", "Media", "Community Support", "General Enquiry"];

const inputCls =
    "w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-zinc-600 transition-[border-color,box-shadow] duration-300 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50";

export const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        organisation: "",
        email: "",
        phone: "",
        type: ENQUIRY_TYPES[0],
        message: "",
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [submitting, setSubmitting] = useState(false);

    const set = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value });
        if (status.type) {
            setStatus({ type: "", message: "" });
        }
    };

    const selectType = (type) => {
        setForm({ ...form, type });
        setDropdownOpen(false);
        if (status.type) {
            setStatus({ type: "", message: "" });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.ok) {
                throw new Error(result.error || "Unable to send enquiry.");
            }

            setStatus({
                type: "success",
                message: "Enquiry sent successfully. Thank you.",
            });
            setForm({
                name: "",
                organisation: "",
                email: "",
                phone: "",
                type: ENQUIRY_TYPES[0],
                message: "",
            });
        } catch (error) {
            setStatus({
                type: "error",
                message: "Unable to send enquiry. Please check the Resend API key and try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="contact" data-testid="contact-section" className="stage-glow relative border-t border-[#d4af37]/10 py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <ChapterHeading number="08" overline="Get Involved" title={<>Be part of <span className="gold-text italic">the celebration</span></>}>
                            Whether you are interested in sponsorship, partnership, media, community support or general enquiries — get in touch.
                        </ChapterHeading>
                        <Reveal delay={0.1}>
                            <ul className="flex flex-wrap gap-2">
                                {ENQUIRY_TYPES.map((t) => (
                                    <li key={t} className="rounded-full border border-[#d4af37]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300">
                                        {t}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                data-testid="contact-email-fallback"
                                className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-[#d4af37] transition-colors hover:text-[#f3e5ab]"
                            >
                                <Mail className="h-4 w-4" aria-hidden="true" />
                                Email: {CONTACT_EMAIL}
                            </a>
                        </Reveal>
                    </div>

                    <Reveal delay={0.15} className="lg:col-span-7">
                        <form
                            onSubmit={onSubmit}
                            data-testid="contact-form"
                            className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] p-7 md:p-10"
                        >
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="contact-name" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Name *</label>
                                    <input id="contact-name" data-testid="contact-name-input" required value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} />
                                </div>
                                <div>
                                    <label htmlFor="contact-organisation" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Organisation</label>
                                    <input id="contact-organisation" data-testid="contact-organisation-input" value={form.organisation} onChange={set("organisation")} placeholder="Company or trust" className={inputCls} />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Email *</label>
                                    <input id="contact-email" data-testid="contact-email-input" type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputCls} />
                                </div>
                                <div>
                                    <label htmlFor="contact-phone" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Phone</label>
                                    <input id="contact-phone" data-testid="contact-phone-input" type="tel" value={form.phone} onChange={set("phone")} placeholder="+64 ..." className={inputCls} />
                                </div>
                                <div className="relative sm:col-span-2">
                                    <label id="contact-type-label" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Enquiry type *</label>
                                    <button
                                        type="button"
                                        aria-labelledby="contact-type-label"
                                        aria-expanded={dropdownOpen}
                                        data-testid="contact-type-select"
                                        onClick={() => setDropdownOpen((open) => !open)}
                                        onBlur={() => window.setTimeout(() => setDropdownOpen(false), 120)}
                                        className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3.5 text-left text-sm text-white transition-[border-color,box-shadow] duration-300 hover:border-[#d4af37]/60 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50"
                                    >
                                        <span>{form.type}</span>
                                        <ChevronDown className={`h-4 w-4 text-[#d4af37] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                                    </button>

                                    {dropdownOpen && (
                                        <div
                                            role="listbox"
                                            aria-label="Enquiry type"
                                            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-[#d4af37]/30 bg-[#0c0a07] shadow-[0_18px_50px_rgba(0,0,0,0.65)]"
                                        >
                                            {ENQUIRY_TYPES.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={form.type === t}
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    onClick={() => selectType(t)}
                                                    className={`block w-full px-4 py-3 text-left text-sm transition-colors ${
                                                        form.type === t
                                                            ? "bg-[#d4af37] text-black"
                                                            : "bg-[#0c0a07] text-white hover:bg-[#d4af37]/15 hover:text-[#f3e5ab]"
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="contact-message" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Message *</label>
                                    <textarea id="contact-message" data-testid="contact-message-input" required rows={5} value={form.message} onChange={set("message")} placeholder="Tell us how you'd like to be involved..." className={`${inputCls} resize-none`} />
                                </div>
                            </div>

                            {status.message && (
                                <div
                                    className={`mt-7 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
                                        status.type === "success"
                                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                                            : "border-red-500/40 bg-red-500/10 text-red-100"
                                    }`}
                                    data-testid="contact-status-message"
                                >
                                    {status.type === "success" ? (
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                    ) : (
                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                    )}
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                data-testid="contact-submit-btn"
                                className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#a8821f] px-8 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-[box-shadow,transform,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(212,175,55,0.45)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {submitting ? "Sending..." : "Send Enquiry"}
                                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </button>
                            <p className="mt-4 text-xs text-zinc-600">Your enquiry will be emailed to the event team.</p>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};
