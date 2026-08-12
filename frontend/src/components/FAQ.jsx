import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { faqConfig } from "../config";
import { ChapterHeading } from "./ChapterHeading";
import { Reveal } from "./Reveal";

export const FAQ = () => (
    <section id="faq" data-testid="faq-section" className="relative border-t border-[#d4af37]/10 py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
            <ChapterHeading number="07" overline="Questions" title={<>Frequently Asked <span className="gold-text italic">Questions</span></>} />

            <Reveal>
                <Accordion type="single" collapsible data-testid="faq-accordion" className="w-full">
                    {faqConfig.map((item, i) => (
                        <AccordionItem key={i} value={`faq-${i}`} className="border-b border-[#d4af37]/15">
                            <AccordionTrigger
                                data-testid={`faq-trigger-${i}`}
                                className="font-display py-6 text-left text-lg font-medium text-zinc-100 transition-colors hover:text-[#f3e5ab] hover:no-underline md:text-xl [&[data-state=open]]:text-[#d4af37]"
                            >
                                {item.q}
                            </AccordionTrigger>
                            <AccordionContent data-testid={`faq-content-${i}`} className="pb-6 text-base leading-relaxed text-zinc-400">
                                {item.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Reveal>
        </div>
    </section>
);
