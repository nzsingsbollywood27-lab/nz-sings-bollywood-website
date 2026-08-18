import { siteConfig, eventConfig, navigationConfig, footerNavConfig, socialConfig, organisersConfig, partnersConfig, supportersConfig, charityConfig, teamConfig, faqConfig, newsConfig, TICKET_URL, CONTACT_EMAIL } from "../config";

const normalisedSocialConfig = {
    instagram: socialConfig.instagram || "",
    facebook: socialConfig.facebook || "",
};

export const defaultContent = {
    site: siteConfig,
    event: eventConfig,
    ticketUrl: TICKET_URL,
    contactEmail: CONTACT_EMAIL,
    navigation: navigationConfig,
    footerNavigation: footerNavConfig,
    social: normalisedSocialConfig,
    organisers: organisersConfig,
    partners: partnersConfig,
    supporters: supportersConfig,
    charity: charityConfig,
    team: teamConfig,
    faq: faqConfig,
    news: newsConfig,
    sections: {
        show: {
            overline: "The Show",
            title: "A World-First Musical Celebration",
            posterQuote: '"This is not just another Bollywood concert."',
            paragraph1: "New Zealand Sings Bollywood – 90s with 90 is a landmark cultural celebration where New Zealand pays tribute to Bollywood through music. It brings together multicultural performers, professional choir singers, musicians, orchestra, and contemporary band elements to reimagine iconic 90s Bollywood songs on a scale not seen before.",
            paragraph2: "Whether these songs defined your childhood or you're discovering them for the first time, prepare for an evening of goosebumps, nostalgia, joy and unforgettable musical moments unlike anything you've experienced before.",
            highlight: "A once-in-a-generation musical experience that will set a new benchmark for live entertainment in New Zealand.",
        },
        years90: {
            overline: "90s with 90",
            title: "The Soundtrack of a Generation. Reimagined.",
            paragraph1: "The 1990s marked a defining era for Bollywood music — a decade of unforgettable melodies, powerful storytelling and songs that continue to live across generations.",
            paragraph2: "90s with 90 reimagines these iconic songs through choir, orchestra and contemporary band arrangements, performed live by 90 artists on one stage.",
            highlight: "Ninety performers. One stage. A decade of music that still moves us.",
        },
        years75: {
            overline: "75 Years",
            title: "75 Years. One Shared Connection.",
            intro: "Celebrating India and New Zealand through music.",
            paragraph1: "90s with 90 celebrates 75 years of diplomatic and cultural ties between India and New Zealand, recognising the people, communities and cultural connections that have continued to bring the two countries closer.",
            paragraph2: "Bollywood has played an extraordinary role in connecting people across cultures and generations.",
            paragraph3: "This concert is a musical tribute from New Zealand to India, celebrating its creativity, influence and enduring place in the cultural lives of people across Aotearoa.",
            highlight: "Two nations. One stage. One song, seventy-five years in the making.",
        },
        tickets: {
            overline: "One night only",
            title: "BE PART OF THIS HISTORIC EVENT",
            subtitle: "One stage. 90 performers. One night you'll remember.",
            buttonLabel: "BUY TICKETS",
        },
        partners: {
            overline: "Partners & Supporters",
            title: "Made possible through music, culture, diversity and community.",
            intro: "90s with 90 is made possible through the support of organisations that believe in the power of music, culture, diversity and community. We thank our partners and supporters for helping bring New Zealand Sings Bollywood – 90s with 90 to the stage.",
            ctaTitle: "Interested in partnering with us?",
            ctaLabel: "Become a Partner",
        },
        team: {
            overline: "The Team Behind the Event",
            title: "The visionaries behind the production",
            intro: "New Zealand Sings Bollywood – 90s with 90 is proudly brought to life by Ashish Ramakrishnan, Dinesh Raniga and Basant Madhur — partners who share a common vision of creating world-class cultural experiences that bring communities together through music.",
            closing: "Together, Ashish, Dinesh and Basant combine their expertise in event production, music and community leadership to create a world-class celebration of Bollywood, while commemorating 75 years of friendship between India and New Zealand.",
        },
        news: {
            overline: "Social Media",
            title: "Follow the Journey",
            instagramDescription: "Follow rehearsal moments, performer updates and event highlights.",
            facebookDescription: "Follow event announcements, community updates and official posts.",
        },
        faq: { overline: "Questions", title: "Frequently Asked Questions" },
        contact: {
            overline: "Get Involved",
            title: "Be part of the celebration",
            intro: "Whether you are interested in sponsorship, partnership, media, community support or general enquiries — get in touch.",
            submitLabel: "Send Enquiry",
        },
        footer: {
            brandLine: "NZ Sings Bollywood",
            subtitle: "90s with 90",
            description: "90 performers. One unforgettable celebration.",
            exploreLabel: "Explore",
            followLabel: "Follow Us",
        },
        marquee: { text: "90 PERFORMERS • ONE STAGE • 75 YEARS OF CONNECTION" },
    },
    textOverrides: {},
    imageOverrides: {},
};

const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);

export const mergeContent = (fallback, remote) => {
    if (Array.isArray(fallback)) return Array.isArray(remote) ? remote : fallback;
    if (!isPlainObject(fallback)) return remote ?? fallback;

    const result = { ...fallback };
    if (!isPlainObject(remote)) return result;

    Object.entries(remote).forEach(([key, value]) => {
        result[key] = mergeContent(fallback[key], value);
    });

    return result;
};
