import { partnersConfig, teamConfig, siteConfig, socialConfig } from "../config";

const keyOf = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const findByName = (items, name) => items.find((item) => keyOf(item?.name) === keyOf(name));

const flattenPartnerItems = (groups = []) =>
    (Array.isArray(groups) ? groups : []).flatMap((group) =>
        (Array.isArray(group?.partners) ? group.partners : []).map((partner) => ({
            ...partner,
            category: group?.category,
        })),
    );

const normalisePartners = (remotePartners) => {
    const remoteItems = flattenPartnerItems(remotePartners);

    return partnersConfig.map((canonicalGroup) => ({
        ...canonicalGroup,
        category: canonicalGroup.category,
        partners: canonicalGroup.partners.map((canonicalPartner) => {
            const remote = findByName(remoteItems, canonicalPartner.name);
            return {
                ...canonicalPartner,
                ...(remote || {}),
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
            role: requestedRoles[memberKey] || remote?.role || canonicalMember.role,
            photo: remote?.photo || canonicalMember.photo,
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

    // Mobile should use the square poster for first impact, as requested.
    eventImages.mobilePoster = eventImages.squarePoster || siteConfig.eventImages?.squarePoster;
    eventImages.portraitPoster = eventImages.portraitPoster || eventImages.squarePoster || siteConfig.eventImages?.portraitPoster;

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
