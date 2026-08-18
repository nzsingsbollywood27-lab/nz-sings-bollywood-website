import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultContent, mergeContent } from "./defaultContent";

const CmsContext = createContext({ content: defaultContent, loading: true, source: "fallback" });
export const useCms = () => useContext(CmsContext);

const norm = (value) => String(value || "").replace(/\s+/g, " ").trim();

function derived(content) {
    const text = { ...(content.textOverrides || {}) };
    const images = { ...(content.imageOverrides || {}) };
    const links = {};

    const walk = (fallbackValue, remoteValue) => {
        if (typeof fallbackValue === "string" && typeof remoteValue === "string" && fallbackValue !== remoteValue) {
            if (fallbackValue.startsWith("/assets/")) images[fallbackValue] = remoteValue;
            else if (/^(https?:|mailto:|#)/.test(fallbackValue)) links[fallbackValue] = remoteValue;
            else text[norm(fallbackValue)] = remoteValue;
            return;
        }

        if (fallbackValue && remoteValue && typeof fallbackValue === "object" && typeof remoteValue === "object") {
            Object.keys(fallbackValue).forEach((key) => walk(fallbackValue[key], remoteValue[key]));
        }
    };

    walk(defaultContent, content);
    return { text, images, links };
}

function applyOverrides(content) {
    const maps = derived(content);

    const apply = () => {
        document.querySelectorAll("img[src]").forEach((img) => {
            const original = img.dataset.cmsOriginalSrc || img.getAttribute("src");
            img.dataset.cmsOriginalSrc = original;
            if (maps.images[original]) img.setAttribute("src", maps.images[original]);
        });

        document.querySelectorAll("source[srcset]").forEach((source) => {
            const original = source.dataset.cmsOriginalSrcset || source.getAttribute("srcset");
            source.dataset.cmsOriginalSrcset = original;
            if (maps.images[original]) source.setAttribute("srcset", maps.images[original]);
        });

        document.querySelectorAll("a[href]").forEach((anchor) => {
            const original = anchor.dataset.cmsOriginalHref || anchor.getAttribute("href");
            anchor.dataset.cmsOriginalHref = original;
            if (maps.links[original]) anchor.setAttribute("href", maps.links[original]);
        });

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.parentElement?.closest("[data-cms-ignore],script,style")) continue;
            const key = node.parentElement?.dataset.cmsOriginalText || norm(node.nodeValue || "");
            if (!key) continue;
            node.parentElement.dataset.cmsOriginalText = key;
            if (Object.prototype.hasOwnProperty.call(maps.text, key)) {
                node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), maps.text[key]);
            }
        }
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
}

export function CmsProvider({ children }) {
    const [state, setState] = useState({ content: defaultContent, loading: true, source: "fallback" });

    useEffect(() => {
        let active = true;
        supabase
            .from("cms_documents")
            .select("content")
            .eq("id", "site")
            .eq("is_published", true)
            .maybeSingle()
            .then(({ data, error }) => {
                if (!active) return;
                setState({
                    content: mergeContent(defaultContent, data?.content),
                    loading: false,
                    source: error || !data ? "fallback" : "supabase",
                });
            })
            .catch(() => active && setState({ content: defaultContent, loading: false, source: "fallback" }));

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => applyOverrides(state.content), [state.content]);

    return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>;
}
