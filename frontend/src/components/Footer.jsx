import { Instagram, Facebook } from "lucide-react";
import { footerNavConfig, socialConfig, organisersConfig, siteConfig } from "../config";
import { useCms } from "../cms/CmsProvider";
import { TicketButton } from "./TicketButton";

const safeHref = (href) => href || "#";

export const Footer = () => {
    const { content } = useCms();
    const footerNav = content.footerNavigation || footerNavConfig;
    const social = content.social || socialConfig;
    const organisers = content.organisers || organisersConfig;
    const site = content.site || siteConfig;
    const sections = content.sections || {};
    const footer = sections.footer || {};

    return (
        <footer data-testid="site-footer" className="border-t border-[#d4af37]/15 bg-[#030302]">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <img src={site.brandTitleHeaderImage} alt="NZ Sings Bollywood – 90s with 90" className="h-14 w-auto" />
                        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.35em] text-[#d4af37]">{footer.brandLine || "NZ Sings Bollywood"}</p>
                        <p className="font-accent mt-1 text-lg italic text-zinc-400">{footer.subtitle || "90s with 90"}</p>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">{footer.description || "90 performers. One unforgettable celebration."}</p>
                        <TicketButton size="md" testId="footer-buy-tickets-btn" className="mt-8 items-start" />
                    </div>
                    <nav aria-label="Footer" className="lg:col-span-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">{footer.exploreLabel || "Explore"}</p>
                        <ul className="mt-5 space-y-3">
                            {footerNav.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} data-testid={`footer-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-sm text-zinc-300 transition-colors duration-300 hover:text-[#d4af37]">{item.label}</a>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">{footer.followLabel || "Follow Us"}</p>
                        <div className="mt-4 flex items-center gap-4">
                            <a href={safeHref(social.instagram)} data-testid="footer-instagram-link" aria-label="Instagram" className="text-zinc-400 transition-colors hover:text-[#d4af37]"><Instagram className="h-5 w-5" /></a>
                            <a href={safeHref(social.facebook)} data-testid="footer-facebook-link" aria-label="Facebook" className="text-zinc-400 transition-colors hover:text-[#d4af37]"><Facebook className="h-5 w-5" /></a>
                        </div>
                    </nav>
                    <div className="lg:col-span-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">An initiative by</p>
                        <div className="mt-5 grid grid-cols-3 gap-3">
                            {organisers.map((o, index) => (
                                <a key={`${o.name}-${index}`} href={safeHref(o.url)} aria-label={o.name} className="group flex min-h-[86px] items-center justify-center rounded-lg border border-white/10 bg-white px-3 py-3 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#d4af37]/60">
                                    {o.logo ? <img src={o.logo} alt={o.name} className="max-h-16 w-auto max-w-full object-contain transition-opacity duration-300 group-hover:opacity-80" /> : <span className="text-center text-[11px] font-semibold leading-tight text-zinc-900">{o.name}</span>}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/5 pt-8 text-center sm:text-left">
                    <p data-testid="footer-copyright" className="text-xs tracking-[0.15em] text-zinc-600">&copy; 2026 NZ Sings Bollywood</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-zinc-700">
                        Powered by <a href="https://webfitt.co.nz" target="_blank" rel="noreferrer" className="text-zinc-500 underline decoration-[#d4af37]/30 underline-offset-4 transition-colors duration-300 hover:text-[#d4af37]">Webfit Solutions Limited</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};
