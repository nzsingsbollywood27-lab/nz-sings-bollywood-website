import { useEffect } from "react";
import Lenis from "lenis";
import "@/App.css";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InitiativeBy } from "@/components/InitiativeBy";
import { Marquee } from "@/components/Marquee";
import { TheShow } from "@/components/TheShow";
import { NinetyWithNinety } from "@/components/NinetyWithNinety";
import { SeventyFiveYears } from "@/components/SeventyFiveYears";
import { TicketsCTA } from "@/components/TicketsCTA";
import { PartnersSupporters } from "@/components/PartnersSupporters";
import { TeamBehindEvent } from "@/components/TeamBehindEvent";
import { NewsStories } from "@/components/NewsStories";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function App() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
        const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -76 } });
        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="grain min-h-screen bg-[#050505] text-white">
            <Header />
            <main>
                <Hero />
                <InitiativeBy />
                <Marquee />
                <TheShow />
                <NinetyWithNinety />
                <TicketsCTA />
                <SeventyFiveYears />
                <PartnersSupporters />
                <TeamBehindEvent />
                <Marquee inverted />
                <NewsStories />
                <FAQ />
                <TicketsCTA />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default App;
