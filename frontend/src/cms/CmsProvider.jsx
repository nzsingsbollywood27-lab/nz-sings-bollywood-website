import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultContent, mergeContent } from "./defaultContent";
import { normalizeContent } from "./normaliseContent";

const CmsContext = createContext({ content: defaultContent, loading: true, source: "fallback" });
export const useCms = () => useContext(CmsContext);


export function CmsProvider({ children }) {
    const [state, setState] = useState({ content: normalizeContent(defaultContent), loading: true, source: "fallback" });

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
                    content: normalizeContent(mergeContent(defaultContent, data?.content)),
                    loading: false,
                    source: error || !data ? "fallback" : "supabase",
                });
            })
            .catch(() => active && setState({ content: normalizeContent(defaultContent), loading: false, source: "fallback" }));

        return () => {
            active = false;
        };
    }, []);

    // Public components read CMS content directly. Avoid DOM-level overrides because repeated placeholder links/images can map to the wrong section.

    return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>;
}
