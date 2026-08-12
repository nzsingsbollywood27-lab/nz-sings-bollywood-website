import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Menu, X } from "lucide-react";
import { navigationConfig, socialConfig, siteConfig } from "../config";
import { TicketButton } from "./TicketButton";

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            data-testid="site-header"
            className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
                scrolled ? "border-b border-[#d4af37]/15 bg-black/75 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
                <a href="#home" data-testid="header-logo-link" aria-label="NZ Sings Bollywood – home" className="flex items-center">
                    <img src={siteConfig.brandTitleHeaderImage} alt="NZ Sings Bollywood – 90s with 90" className="h-10 w-auto md:h-12" />
                </a>

                <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
                    {navigationConfig.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            data-testid={`nav-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                            className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-300 transition-colors duration-300 hover:text-[#d4af37]"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3 md:gap-4">
                    <div className="hidden items-center gap-3 md:flex">
                        <a href={socialConfig.instagram} data-testid="header-instagram-link" aria-label="Instagram" className="text-zinc-400 transition-colors duration-300 hover:text-[#d4af37]">
                            <Instagram className="h-[18px] w-[18px]" />
                        </a>
                        <a href={socialConfig.facebook} data-testid="header-facebook-link" aria-label="Facebook" className="text-zinc-400 transition-colors duration-300 hover:text-[#d4af37]">
                            <Facebook className="h-[18px] w-[18px]" />
                        </a>
                    </div>
                    <TicketButton size="sm" testId="header-buy-tickets-btn" className="hidden sm:inline-flex" />
                    <button
                        type="button"
                        data-testid="mobile-menu-btn"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/30 text-[#f3e5ab] xl:hidden"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        aria-label="Mobile"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="border-t border-[#d4af37]/15 bg-black/95 px-6 pb-10 pt-6 backdrop-blur-xl xl:hidden"
                    >
                        <div className="flex flex-col gap-1">
                            {navigationConfig.map((item, i) => (
                                <motion.a
                                    key={item.href}
                                    href={item.href}
                                    data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                    onClick={() => setOpen(false)}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                                    className="font-display border-b border-white/5 py-4 text-2xl text-zinc-100 transition-colors hover:text-[#d4af37]"
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <a href={socialConfig.instagram} data-testid="mobile-instagram-link" aria-label="Instagram" className="text-zinc-400 hover:text-[#d4af37]">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href={socialConfig.facebook} data-testid="mobile-facebook-link" aria-label="Facebook" className="text-zinc-400 hover:text-[#d4af37]">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            </div>
                            <TicketButton size="sm" testId="mobile-buy-tickets-btn" />
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};
