import { partnersConfig, teamConfig, siteConfig, socialConfig } from "../config";

const keyOf = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const findByName = (items, name) => items.find((item) => keyOf(item?.name) === keyOf(name));

const CATEGORY_ALIASES = {
    "powered by partner": "powered by partners",
    "powered by partners": "powered by partners",
};

const categoryKey = (category) => CATEGORY_ALIASES[keyOf(category)] || keyOf(category);

const flattenPartnerItems = (groups = []) =>
    (Array.isArray(groups) ? groups : []).flatMap((group) =>
        (Array.isArray(group?.partners) ? group.partners : []).map((partner) => ({
            ...partner,
            category: group?.category,
        })),
    );

const findRemotePartner = (remoteItems, canonicalGroup, canonicalPartner) => {
    const groupKey = categoryKey(canonicalGroup.category);
    const sameName = findByName(remoteItems, canonicalPartner.name);
    if (sameName) return sameName;

    // Prevent logo/category drift caused by edited arrays in the CMS. Only use index fallback
    // when the saved partner is still in the same canonical category.
    const groupedItems = remoteItems.filter((item) => categoryKey(item.category) === groupKey);
    return groupedItems.find((item) => keyOf(item.name) === keyOf(canonicalPartner.name));
};

const normalisePartners = (remotePartners) => {
    const remoteItems = flattenPartnerItems(remotePartners);

    return partnersConfig.map((canonicalGroup) => ({
        ...canonicalGroup,
        category: canonicalGroup.category,
        partners: canonicalGroup.partners.map((canonicalPartner) => {
            const remote = findRemotePartner(remoteItems, canonicalGroup, canonicalPartner);
            return {
                ...canonicalPartner,
                ...(remote || {}),
                // Lock the identity/category to the production structure so admin containers
                // and public containers cannot become offset from each other.
                name: canonicalPartner.name,
                category: undefined,
            };
        }),
    }));
};

const normaliseTeam = (remoteTeam) => {
    const requestedRoles = {
        [keyOf("Ashish Ramakrishnan")]: "Event Director & Producer",
        [keyOf("Dinesh Raniga")]: "Event Producer",
        [keyOf("Basant Madhur")]: "Event Producer",
    };

    return teamConfig.map((canonicalMember) => {
        const remote = findByName(Array.isArray(remoteTeam) ? remoteTeam : [], canonicalMember.name);
        const memberKey = keyOf(canonicalMember.name);
        return {
            ...canonicalMember,
            ...(remote || {}),
            name: canonicalMember.name,
            role: requestedRoles[memberKey] || canonicalMember.role,
            // Keep approved production portraits unless the source files are deliberately changed in code.
            // This prevents accidental CMS crop/resize variants from making organiser photos uneven.
            photo: canonicalMember.photo,
        };
    });
};

const normaliseSocial = (remoteSocial) => ({
    ...socialConfig,
    ...(remoteSocial || {}),
    instagram: remoteSocial?.instagram && remoteSocial.instagram !== "#" ? remoteSocial.instagram : socialConfig.instagram || "",
    facebook: remoteSocial?.facebook && remoteSocial.facebook !== "#" ? remoteSocial.facebook : socialConfig.facebook || "",
});

const normaliseHeroImages = (remoteSite) => {
    const site = { ...siteConfig, ...(remoteSite || {}) };
    const eventImages = {
        ...(siteConfig.eventImages || {}),
        ...(site.eventImages || {}),
    };

    // Mobile must stay on the square poster for first impact.
    eventImages.mobilePoster = siteConfig.eventImages?.squarePoster || eventImages.squarePoster;
    eventImages.squarePoster = eventImages.squarePoster || siteConfig.eventImages?.squarePoster;
    eventImages.portraitPoster = eventImages.portraitPoster || siteConfig.eventImages?.portraitPoster;

    return {
        ...site,
        eventImages,
    };
};

export const normalizeContent = (content) => {
    const next = {
        ...content,
        site: normaliseHeroImages(content?.site),
        social: normaliseSocial(content?.social),
        partners: normalisePartners(content?.partners),
        team: normaliseTeam(content?.team),
    };

    return next;
};
