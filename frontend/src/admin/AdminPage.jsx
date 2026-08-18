import { useEffect, useMemo, useState } from "react";
import { ADMIN_UID, supabase } from "../lib/supabase";
import { defaultContent, mergeContent } from "../cms/defaultContent";
import "./admin.css";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;
const clone = (value) => JSON.parse(JSON.stringify(value));
const title = (key) => key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());
const imageKey = (key) => /(image|logo|photo|poster)$/i.test(key);
const urlKey = (key) => /(url|href|link)$/i.test(key);
const validUrl = (value) => !value || value.startsWith("/") || value.startsWith("#") || /^https?:\/\//i.test(value) || /^mailto:/i.test(value);

const groups = [
  { id: "general", label: "General", heading: "General site information", help: "Website identity, contact details and primary messaging.", paths: ["site.name","site.shortName","site.domain","site.tagline","site.coreMessage","site.secondaryMessage","contactEmail"] },
  { id: "event", label: "Event & tickets", heading: "Event and ticket details", help: "Dates, times, venue information, countdown and ticket settings.", paths: ["event","ticketUrl","sections.tickets"] },
  { id: "sections", label: "Page sections", heading: "Page section text", help: "Headings, paragraphs, descriptions and calls to action, arranged by website section.", paths: ["sections.show","sections.years90","sections.years75","sections.partners","sections.team","sections.news","sections.faq","sections.contact","sections.footer","sections.marquee"] },
  { id: "images", label: "Brand & posters", heading: "Brand images and event posters", help: "Preview and replace every primary website image.", paths: ["site.brandTitleImage","site.brandTitleHeaderImage","site.ogImage","site.eventImages"] },
  { id: "navigation", label: "Navigation & social", heading: "Navigation and social media", help: "Header links, footer links and social profiles.", paths: ["navigation","footerNavigation","social"] },
  { id: "organisers", label: "Organisers", heading: "Organisers", help: "Names, links and logos for event organisers.", paths: ["organisers"] },
  { id: "partners", label: "Partners", heading: "Partners by category", help: "Partner categories, names, links and logos.", paths: ["partners"] },
  { id: "supporters", label: "Supporters", heading: "Supporters and charity", help: "Supporter logos, links and charity messaging.", paths: ["supporters","charity"] },
  { id: "team", label: "Team", heading: "Team members", help: "Names, roles, biographies and portraits.", paths: ["team"] },
  { id: "faq", label: "FAQs", heading: "Frequently asked questions", help: "Questions appear in the same order on the public website.", paths: ["faq"] },
  { id: "news", label: "News", heading: "News and stories", help: "Story labels, titles, descriptions, links and optional images.", paths: ["news"] },
  { id: "advanced", label: "Advanced", heading: "Advanced overrides", help: "Only use these for website values that are not represented in another section.", paths: ["textOverrides","imageOverrides"] },
];

function Field({ label, value, onChange, type = "text", help }) {
  const multiline = typeof value === "string" && (value.length > 90 || /(paragraph|description|excerpt|bio|intro|message|note|highlight|closing|answer)/i.test(label));
  const Tag = multiline ? "textarea" : "input";
  return <label className="cms-field"><span>{label}</span><Tag type={type} rows={multiline ? 4 : undefined} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />{help && <small>{help}</small>}</label>;
}

function ImageEditor({ label, value, onChange, upload, busy }) {
  return <div className="image-field">
    <div className="image-preview">{value ? <img src={value} alt="" /> : <span>No image selected</span>}</div>
    <div className="image-controls"><h4>{label}</h4><Field label="Image URL or asset path" value={value || ""} onChange={onChange} />
      <label className="upload-button">{busy ? "Uploading…" : "Upload replacement"}<input type="file" accept={TYPES.join(",")} disabled={busy} onChange={(e) => upload(e.target.files?.[0], onChange, e.target)} /></label>
      <small>JPEG, PNG, WebP or GIF. Maximum 5 MB.</small>
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
  if (imageKey(fieldKey)) return <ImageEditor label={title(fieldKey)} value={value || ""} onChange={(next) => setPath(path, next)} upload={upload} busy={busy} />;
  if (typeof value === "boolean") return <label className="checkbox-field"><input type="checkbox" checked={value} onChange={(e) => setPath(path, e.target.checked)} />{title(fieldKey)}</label>;
  return <Field label={title(fieldKey)} type={/email/i.test(fieldKey) ? "email" : "text"} value={value ?? ""} onChange={(next) => setPath(path, next)} help={fieldKey === "dateTimeISO" ? "Example: 2027-02-27T19:00:00+13:00" : undefined} />;
}

function Login({ busy, message, login }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  return <main className="admin-login" data-cms-ignore><form className="login-card" onSubmit={(e) => { e.preventDefault(); login(email, password); }}>
    <div className="login-mark">NZ</div><p className="eyebrow">Secure administration</p><h1>Website CMS</h1><p>Sign in with the approved administrator account.</p>
    <Field label="Email" type="email" value={email} onChange={setEmail}/><Field label="Password" type="password" value={password} onChange={setPassword}/>
    <button className="primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>{message && <p className="cms-message error">{message}</p>}
  </form></main>;
}

export function AdminPage() {
  const [session, setSession] = useState(null); const [checking, setChecking] = useState(true);
  const [content, setContent] = useState(defaultContent); const [saved, setSaved] = useState(defaultContent);
  const [active, setActive] = useState("general"); const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(""); const [messageType, setMessageType] = useState("success");
  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);
  const group = groups.find((item) => item.id === active);

  useEffect(() => { supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false); }); const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next)); return () => data.subscription.unsubscribe(); }, []);
  useEffect(() => { if (session?.user?.id !== ADMIN_UID) return; setBusy(true); supabase.from("cms_documents").select("content").eq("id", "site").maybeSingle().then(({ data, error }) => { const next = mergeContent(defaultContent, data?.content); setContent(next); setSaved(clone(next)); if (error) show(error.message, "error"); setBusy(false); }); }, [session]);
  useEffect(() => { const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);

  const show = (text, type = "success") => { setMessage(text); setMessageType(type); };
  const getPath = (root, path) => path.split(".").reduce((result, key) => result?.[key], root);
  const setPath = (path, value) => { setContent((current) => { const next = clone(current); const parts = path.split("."); let target = next; parts.slice(0, -1).forEach((part) => { if (target[part] == null) target[part] = {}; target = target[part]; }); target[parts.at(-1)] = value; return next; }); setMessage(""); };
  const remove = (path, index) => setPath(path, getPath(content, path).filter((_item, i) => i !== index));
  const validate = () => {
    if (!content.site?.name?.trim()) throw new Error("Site name is required.");
    if (!content.event?.dateTimeISO || Number.isNaN(Date.parse(content.event.dateTimeISO))) throw new Error("Enter a valid event countdown date/time.");
    const inspect = (value, key = "") => { if (typeof value === "string" && urlKey(key) && !validUrl(value)) throw new Error(`Invalid URL in ${title(key)}.`); if (value && typeof value === "object") Object.entries(value).forEach(([childKey, child]) => inspect(child, childKey)); }; inspect(content);
  };
  const publish = async () => { setBusy(true); try { validate(); const { error } = await supabase.from("cms_documents").upsert({ id: "site", content, is_published: true, updated_at: new Date().toISOString(), updated_by: session.user.id }); if (error) throw error; setSaved(clone(content)); show("All changes published successfully."); } catch (error) { show(error.message, "error"); } setBusy(false); };
  const upload = async (file, onChange, input) => { if (!file) return; if (!TYPES.includes(file.type) || file.size > MAX_SIZE) { show("Choose a JPEG, PNG, WebP or GIF no larger than 5 MB.", "error"); input.value = ""; return; } setBusy(true); const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`; const { error } = await supabase.storage.from("cms-images").upload(path, file, { contentType: file.type, upsert: false }); if (error) show(error.message, "error"); else { const { data } = supabase.storage.from("cms-images").getPublicUrl(path); onChange(data.publicUrl); show(`${file.name} uploaded. Publish changes to make it live.`); } input.value = ""; setBusy(false); };
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
