import { useEffect, useMemo, useState } from "react";
import { ADMIN_UID, supabase } from "../lib/supabase";
import { defaultContent, mergeContent } from "../cms/defaultContent";
import { normalizeContent } from "../cms/normaliseContent";
import "./admin.css";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024;
const OUTPUT_TYPE = "image/webp";
const OUTPUT_QUALITY = 0.92;

const clone = (value) => JSON.parse(JSON.stringify(value));
const title = (key) => key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());
const imageKey = (key) => /(image|logo|photo|poster)$/i.test(key);
const urlKey = (key) => /(url|href|link)$/i.test(key);
const validUrl = (value) => !value || value.startsWith("/") || value.startsWith("#") || /^https?:\/\//i.test(value) || /^mailto:/i.test(value);

const groups = [
    { id: "general", label: "General", heading: "General site information", help: "Website identity, contact details and primary messaging.", paths: ["site.name", "site.shortName", "site.domain", "site.tagline", "site.coreMessage", "site.secondaryMessage", "contactEmail"] },
    { id: "event", label: "Event & tickets", heading: "Event and ticket details", help: "Dates, times, venue information, countdown and ticket settings.", paths: ["event", "ticketUrl", "sections.tickets"] },
    { id: "sections", label: "Page sections", heading: "Page section text", help: "Headings, paragraphs, descriptions and calls to action, arranged by website section.", paths: ["sections.show", "sections.years90", "sections.years75", "sections.partners", "sections.team", "sections.news", "sections.faq", "sections.contact", "sections.footer", "sections.marquee"] },
    { id: "images", label: "Brand & posters", heading: "Brand images and event posters", help: "Upload-safe image tools. Logos keep their original aspect; posters are resized to the correct website frame.", paths: ["site.brandTitleImage", "site.brandTitleHeaderImage", "site.ogImage", "site.eventImages"] },
    { id: "navigation", label: "Navigation & social", heading: "Navigation and social media", help: "Header links, footer links and social profiles.", paths: ["navigation", "footerNavigation", "social"] },
    { id: "organisers", label: "Organisers", heading: "Organisers", help: "Names, links and logos for event organisers.", paths: ["organisers"] },
    { id: "partners", label: "Partners", heading: "Partners by category", help: "Partner categories, names, links and logos. Upload each logo inside the correct partner record; the public site now reads these records directly.", paths: ["partners"] },
    { id: "supporters", label: "Supporters", heading: "Supporters and charity", help: "Supporter logos, links and charity messaging.", paths: ["supporters", "charity"] },
    { id: "team", label: "Team", heading: "Team members", help: "Names, roles, biographies and portraits. Uploaded portraits are resized to the website portrait frame.", paths: ["team"] },
    { id: "faq", label: "FAQs", heading: "Frequently asked questions", help: "Questions appear in the same order on the public website.", paths: ["faq"] },
    { id: "news", label: "News", heading: "News and stories", help: "Story labels, titles, descriptions, links and optional images.", paths: ["news"] },
    { id: "advanced", label: "Advanced", heading: "Advanced overrides", help: "Only use these for website values that are not represented in another section.", paths: ["textOverrides", "imageOverrides"] },
];

const IMAGE_PROFILES = {
    logo: { label: "Logo original ratio", width: 1600, height: 900, fit: "contain", background: "transparent", preserveAspect: true, note: "Logos keep their original shape and are not placed inside a padded canvas. Best for organiser, partner and supporter logos." },
    headerLogo: { label: "Header logo original ratio", width: 1600, height: 700, fit: "contain", background: "transparent", preserveAspect: true, note: "Keeps the title/logo sharp without stretching the header." },
    portrait: { label: "Portrait safe fit", width: 1000, height: 1250, fit: "contain", background: "#050505", note: "Portraits are padded to the website card shape so heads/faces are not cropped." },
    squarePoster: { label: "Square poster", width: 1400, height: 1400, fit: "contain", background: "#050505", note: "Use for square event poster positions." },
    portraitPoster: { label: "Portrait poster", width: 1080, height: 1350, fit: "contain", background: "#050505", note: "Use for mobile/portrait poster positions." },
    landscapePoster: { label: "Landscape poster", width: 1600, height: 900, fit: "contain", background: "#050505", note: "Use for wide poster/banner positions." },
    openGraph: { label: "Social preview image", width: 1200, height: 630, fit: "contain", background: "#050505", note: "Correct size for link preview cards." },
    general: { label: "Website image", width: 1400, height: 1000, fit: "contain", background: "#050505", note: "Safe general image resize that avoids stretching or cropping." },
};

const imageProfileFor = (path, fieldKey) => {
    const key = `${path}.${fieldKey}`.toLowerCase();
    if (key.includes("brandtitleheader")) return IMAGE_PROFILES.headerLogo;
    if (key.includes("brandtitle") || key.includes("logo")) return IMAGE_PROFILES.logo;
    if (key.includes("organisers") || key.includes("partners") || key.includes("supporters")) return IMAGE_PROFILES.logo;
    if (key.includes("team") || key.includes("photo") || key.includes("portrait")) return IMAGE_PROFILES.portrait;
    if (key.includes("squareposter")) return IMAGE_PROFILES.squarePoster;
    if (key.includes("portraitposter") || key.includes("potrait")) return IMAGE_PROFILES.portraitPoster;
    if (key.includes("landscapeposter")) return IMAGE_PROFILES.landscapePoster;
    if (key.includes("ogimage") || key.includes("open graph")) return IMAGE_PROFILES.openGraph;
    if (key.includes("poster")) return IMAGE_PROFILES.portraitPoster;
    return IMAGE_PROFILES.general;
};

const readImage = (file) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to read this image. Please try another file."));
    image.src = URL.createObjectURL(file);
});

const canvasToBlob = (canvas, type = OUTPUT_TYPE, quality = OUTPUT_QUALITY) => new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Unable to prepare this image for upload."))), type, quality);
});

async function prepareImageForUpload(file, profile) {
    if (file.type === "image/gif") return { blob: file, extension: "gif", profileLabel: "Original GIF" };

    const image = await readImage(file);
    const canvas = document.createElement("canvas");

    const scale = profile.fit === "cover"
        ? Math.max(profile.width / image.naturalWidth, profile.height / image.naturalHeight)
        : Math.min(profile.width / image.naturalWidth, profile.height / image.naturalHeight, 1);
    const drawWidth = Math.round(image.naturalWidth * scale);
    const drawHeight = Math.round(image.naturalHeight * scale);

    if (profile.preserveAspect) {
        canvas.width = drawWidth;
        canvas.height = drawHeight;
    } else {
        canvas.width = profile.width;
        canvas.height = profile.height;
    }

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!profile.preserveAspect && profile.background !== "transparent") {
        context.fillStyle = profile.background;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    const drawX = profile.preserveAspect ? 0 : Math.round((profile.width - drawWidth) / 2);
    const drawY = profile.preserveAspect ? 0 : Math.round((profile.height - drawHeight) / 2);

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    URL.revokeObjectURL(image.src);

    const blob = await canvasToBlob(canvas);
    return { blob, extension: "webp", profileLabel: profile.label };
}

function Field({ label, value, onChange, type = "text", help }) {
    const multiline = typeof value === "string" && (value.length > 90 || /(paragraph|description|excerpt|bio|intro|message|note|highlight|closing|answer)/i.test(label));
    const Tag = multiline ? "textarea" : "input";
    return <label className="cms-field"><span>{label}</span><Tag type={type} rows={multiline ? 4 : undefined} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />{help && <small>{help}</small>}</label>;
}

function ImageEditor({ label, value, onChange, upload, busy, fieldPath, fieldKey }) {
    const profile = imageProfileFor(fieldPath, fieldKey);
    return <div className="image-field">
        <div className="image-preview">
            {value ? <img src={value} alt="" /> : <span>No image selected</span>}
        </div>
        <div className="image-controls">
            <div className="image-heading-row"><h4>{label}</h4><span>{profile.width} × {profile.height}</span></div>
            <p className="image-profile-note"><strong>{profile.label}.</strong> {profile.note}</p>
            <Field label="Image URL or asset path" value={value || ""} onChange={onChange} />
            <label className="upload-button">{busy ? "Uploading…" : "Upload replacement"}<input type="file" accept={TYPES.join(",")} disabled={busy} onChange={(e) => upload(e.target.files?.[0], onChange, e.target, fieldPath, fieldKey)} /></label>
            <small>JPEG, PNG, WebP or GIF. Maximum 8 MB. Logos keep their original ratio. Posters and portraits are resized safely for the live site.</small>
        </div>
    </div>;
}

function Editor({ value, path, fieldKey, setPath, remove, upload, busy, template }) {
    if (Array.isArray(value)) {
        const itemTemplate = template?.[0] ?? (value[0] ? clone(value[0]) : "");
        return <div className="collection">
            {value.map((item, index) => <article className="cms-card" key={index}>
                <div className="cms-card-head"><h3>{title(fieldKey)} {index + 1}{item?.name ? ` — ${item.name}` : item?.title ? ` — ${item.title}` : ""}</h3><button className="danger-link" type="button" onClick={() => remove(path, index)}>Remove</button></div>
                <Editor value={item} template={itemTemplate} path={`${path}.${index}`} fieldKey={String(index)} setPath={setPath} remove={remove} upload={upload} busy={busy} />
            </article>)}
            <button className="add-button" type="button" onClick={() => setPath(path, [...value, clone(itemTemplate)])}>+ Add {title(fieldKey).replace(/s$/, "")}</button>
        </div>;
    }
    if (value && typeof value === "object") {
        return <div className="object-fields">{Object.entries(value).filter(([key]) => key !== "logoClassName").map(([key, child]) =>
            <div className={child && typeof child === "object" ? "nested-group" : ""} key={key}>
                {child && typeof child === "object" && <h3 className="subheading">{title(key)}</h3>}
                <Editor value={child} template={template?.[key]} path={`${path}.${key}`} fieldKey={key} setPath={setPath} remove={remove} upload={upload} busy={busy} />
            </div>)}</div>;
    }
    if (imageKey(fieldKey)) return <ImageEditor label={title(fieldKey)} value={value || ""} onChange={(next) => setPath(path, next)} upload={upload} busy={busy} fieldPath={path} fieldKey={fieldKey} />;
    if (typeof value === "boolean") return <label className="checkbox-field"><input type="checkbox" checked={value} onChange={(e) => setPath(path, e.target.checked)} />{title(fieldKey)}</label>;
    return <Field label={title(fieldKey)} type={/email/i.test(fieldKey) ? "email" : "text"} value={value ?? ""} onChange={(next) => setPath(path, next)} help={fieldKey === "dateTimeISO" ? "Example: 2027-02-27T19:00:00+13:00" : undefined} />;
}

function Login({ busy, message, login }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return <main className="admin-login" data-cms-ignore><form className="login-card" onSubmit={(e) => { e.preventDefault(); login(email, password); }}>
        <div className="login-mark">NZ</div><p className="eyebrow">Secure administration</p><h1>Website CMS</h1><p>Sign in with the approved administrator account.</p>
        <Field label="Email" type="email" value={email} onChange={setEmail}/><Field label="Password" type="password" value={password} onChange={setPassword}/>
        <button className="primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>{message && <p className="cms-message error">{message}</p>}
    </form></main>;
}

export function AdminPage() {
    const [session, setSession] = useState(null);
    const [checking, setChecking] = useState(true);
    const [content, setContent] = useState(normalizeContent(defaultContent));
    const [saved, setSaved] = useState(normalizeContent(defaultContent));
    const [active, setActive] = useState("general");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);
    const group = groups.find((item) => item.id === active);

    useEffect(() => { supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false); }); const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next)); return () => data.subscription.unsubscribe(); }, []);
    useEffect(() => { if (session?.user?.id !== ADMIN_UID) return; setBusy(true); supabase.from("cms_documents").select("content").eq("id", "site").maybeSingle().then(({ data, error }) => { const next = normalizeContent(mergeContent(defaultContent, data?.content)); setContent(next); setSaved(clone(next)); if (error) show(error.message, "error"); setBusy(false); }); }, [session]);
    useEffect(() => { const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);

    const show = (text, type = "success") => { setMessage(text); setMessageType(type); };
    const getPath = (root, path) => path.split(".").reduce((result, key) => result?.[key], root);
    const setPath = (path, value) => { setContent((current) => { const next = clone(current); const parts = path.split("."); let target = next; parts.slice(0, -1).forEach((part) => { if (target[part] == null) target[part] = {}; target = target[part]; }); target[parts.at(-1)] = value; return next; }); setMessage(""); };
    const remove = (path, index) => setPath(path, getPath(content, path).filter((_item, i) => i !== index));
    const validate = () => {
        if (!content.site?.name?.trim()) throw new Error("Site name is required.");
        if (!content.event?.dateTimeISO || Number.isNaN(Date.parse(content.event.dateTimeISO))) throw new Error("Enter a valid event countdown date/time.");
        const inspect = (value, key = "") => { if (typeof value === "string" && urlKey(key) && !validUrl(value)) throw new Error(`Invalid URL in ${title(key)}.`); if (value && typeof value === "object") Object.entries(value).forEach(([childKey, child]) => inspect(child, childKey)); };
        inspect(content);
    };
    const publish = async () => { setBusy(true); try { validate(); const normalizedContent = normalizeContent(content); const { error } = await supabase.from("cms_documents").upsert({ id: "site", content: normalizedContent, is_published: true, updated_at: new Date().toISOString(), updated_by: session.user.id }); if (error) throw error; setContent(normalizedContent); setSaved(clone(normalizedContent)); show("All changes published successfully."); } catch (error) { show(error.message, "error"); } setBusy(false); };
    const upload = async (file, onChange, input, fieldPath, fieldKey) => {
        if (!file) return;
        if (!TYPES.includes(file.type) || file.size > MAX_SIZE) { show("Choose a JPEG, PNG, WebP or GIF no larger than 8 MB.", "error"); input.value = ""; return; }
        setBusy(true);
        try {
            const profile = imageProfileFor(fieldPath, fieldKey);
            const prepared = await prepareImageForUpload(file, profile);
            const safeBase = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
            const storagePath = `uploads/${Date.now()}-${fieldPath.replace(/[^a-zA-Z0-9_-]/g, "-")}-${safeBase}.${prepared.extension}`;
            const { error } = await supabase.storage.from("cms-images").upload(storagePath, prepared.blob, { contentType: prepared.blob.type || file.type, upsert: false });
            if (error) throw error;
            const { data } = supabase.storage.from("cms-images").getPublicUrl(storagePath);
            onChange(data.publicUrl);
            show(`${file.name} uploaded as ${prepared.profileLabel}. Publish changes to make it live.`);
        } catch (error) {
            show(error.message, "error");
        }
        input.value = "";
        setBusy(false);
    };
    const login = async (email, password) => { setBusy(true); setMessage(""); const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password }); if (!error && data.user?.id !== ADMIN_UID) { await supabase.auth.signOut(); show("This account is not authorised.", "error"); } else if (error) show(error.message, "error"); setBusy(false); };

    if (checking) return <main className="admin-loading">Checking your session…</main>;
    if (!session) return <Login busy={busy} message={message} login={login}/>;
    if (session.user.id !== ADMIN_UID) return <main className="admin-loading"><p>Unauthorised account.</p><button onClick={() => supabase.auth.signOut()}>Sign out</button></main>;

    return <main className="cms-app" data-cms-ignore>
        <header className="cms-topbar"><div className="brand"><span className="cms-logo">NZ</span><div><p>NZ Sings Bollywood</p><h1>Content Management</h1></div></div><div className="topbar-actions"><a href="/" target="_blank" rel="noreferrer">View website ↗</a><button onClick={() => supabase.auth.signOut()}>Log out</button></div></header>
        <div className="cms-layout"><aside className="cms-sidebar"><p className="sidebar-label">Website content</p><nav>{groups.map((item) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}>{item.label}</button>)}</nav><div className={`save-state ${dirty ? "dirty" : "saved"}`}>{dirty ? "Unpublished changes" : "Everything published"}</div></aside>
            <section className="cms-main"><div className="mobile-tabs"><select value={active} onChange={(e) => setActive(e.target.value)}>{groups.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></div>
                <div className="cms-panel"><div className="cms-panel-heading"><p className="eyebrow">Edit website</p><h2>{group.heading}</h2><p>{group.help}</p></div>
                    {group.paths.map((path) => { const value = getPath(content, path); const fieldKey = path.split(".").at(-1); return <div className={value && typeof value === "object" ? "path-section" : ""} key={path}>{value && typeof value === "object" && !Array.isArray(value) && <h3 className="section-title">{title(fieldKey)}</h3>}<Editor value={value} template={getPath(defaultContent, path)} path={path} fieldKey={fieldKey} setPath={setPath} remove={remove} upload={upload} busy={busy}/></div>; })}
                </div>
                <div className="publish-bar"><div>{message ? <p className={`cms-message ${messageType}`}>{message}</p> : <p>{dirty ? "You have unpublished changes." : "Your website content is up to date."}</p>}</div><div className="publish-actions"><button className="secondary-button" disabled={!dirty || busy} onClick={() => { setContent(clone(saved)); show("Unpublished changes discarded."); }}>Discard changes</button><button className="primary-button" disabled={!dirty || busy} onClick={publish}>{busy ? "Working…" : "Publish changes"}</button></div></div>
            </section>
        </div>
    </main>;
}
