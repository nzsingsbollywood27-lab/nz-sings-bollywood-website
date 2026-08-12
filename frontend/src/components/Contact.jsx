import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { CONTACT_EMAIL } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

const ENQUIRY_TYPES = ["Sponsorship", "Partnership", "Media", "Community Support", "General Enquiry"];

const inputCls =
    "w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-zinc-600 transition-[border-color,box-shadow] duration-300 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50";

export const Contact = () => {
    const [form, setForm] = useState({ name: "", organisation: "", email: "", phone: "", type: ENQUIRY_TYPES[0], message: "" });

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`[${form.type}] Website enquiry — ${form.name}`);
        const body = encodeURIComponent(
            `Name: ${form.name}\nOrganisation: ${form.organisation}\nEmail: ${form.email}\nPhone: ${form.phone}\nEnquiry type: ${form.type}\n\nMessage:\n${form.message}`,
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
                                <div className="sm:col-span-2">
                                    <label htmlFor="contact-type" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Enquiry type *</label>
                                    <select id="contact-type" data-testid="contact-type-select" value={form.type} onChange={set("type")} className={`${inputCls} appearance-none bg-[#0c0a07]`}>
                                        {ENQUIRY_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="contact-message" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Message *</label>
                                    <textarea id="contact-message" data-testid="contact-message-input" required rows={5} value={form.message} onChange={set("message")} placeholder="Tell us how you'd like to be involved..." className={`${inputCls} resize-none`} />
                                </div>
                            </div>
                            <button
                                type="submit"
                                data-testid="contact-submit-btn"
                                className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#a8821f] px-8 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(212,175,55,0.45)] sm:w-auto"
                            >
                                Send Enquiry
                                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </button>
                            <p className="mt-4 text-xs text-zinc-600">Opens your email app with everything pre-filled to {CONTACT_EMAIL}.</p>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};
