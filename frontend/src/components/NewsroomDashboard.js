// frontend/src/components/NewsroomDashboard.js
import { useState, useEffect, useRef } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditIdeaPage from "./EditIdeaPage";
import CreateIdeaPage from "./CreateIdeaPage";
import ViewIdeaPage from "./ViewIdeaPage";

/* ── palette — matches site's cream theme ─────────── */
const C = {
    bg: "#fdf6f0",
    surface: "#ffffff",
    surf2: "#f5ece4",
    border: "#ede8e3",
    border2: "#d0c8c0",
    text: "#1a1a2e",
    muted: "#a0a0b0",
    muted2: "#6b6b80",
    accent: "#E8334A",
    aGlow: "rgba(232,51,74,0.18)",
    green: "#16a34a",
    blue: "#2563eb",
};

/* ── platform map ────────────────────────────────── */
const P = {
    Instagram: { c: "#e1306c", bg: "rgba(225,48,108,0.12)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
    LinkedIn: { c: "#0a66c2", bg: "rgba(10,102,194,0.12)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
    Twitter: { c: "#1d9bf0", bg: "rgba(29,155,240,0.12)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> },
    YouTube: { c: "#ff3b30", bg: "rgba(255,59,48,0.12)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> },
    Facebook: { c: "#1877f2", bg: "rgba(24,119,242,0.12)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
    TikTok: { c: "#25f4ee", bg: "rgba(37,244,238,0.12)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg> },
    WhatsApp: { c: "#25d366", bg: "rgba(37,211,102,0.12)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> },
};
const pOf = ch => P[ch] || { c: "#888899", bg: "rgba(136,136,153,0.12)", icon: null };

const STATUS_NEXT = { idea: "draft", draft: "published", published: null };
const STATUS_PREV = { idea: null, draft: "idea", published: "draft" };
const STATUS_NEXT_LABEL = { idea: "→ Draft", draft: "→ Publish" };
const STATUS_PREV_LABEL = { draft: "← Idea", published: "← Draft" };

const fmtDate = d =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

/* ── shared tiny styles ────────────────────────────*/
const btn = (extra = {}) => ({
    border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif",
    fontWeight: 700, borderRadius: 8, transition: "all 0.18s", ...extra,
});
const surfCard = (extra = {}) => ({
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, ...extra,
});

export default function NewsroomDashboard({ ideas = [], onStatusChange, onUpdate, onDelete, onCreate, onLogout, loading, error }) {
    const [selected, setSelected] = useState(null);
    const [showDel, setShowDel] = useState(false);
    const [moving, setMoving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [dateStr, setDateStr] = useState("");
    const [filterChannel, setFilterChannel] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [fabOpen, setFabOpen] = useState(false);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    const [editingIdea, setEditingIdea] = useState(null);
    const [viewingIdea, setViewingIdea] = useState(null);
    const [isCreatingIdea, setIsCreatingIdea] = useState(false);

    /* live clock */
    useEffect(() => {
        const tick = () => {
            const n = new Date();
            setDateStr(
                n.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase() +
                " · " + n.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
            );
        };
        tick();
        const id = setInterval(tick, 30_000);
        return () => clearInterval(id);
    }, []);

    const filteredIdeas = (filterChannel === "All" ? ideas : ideas.filter(i => i.channel === filterChannel))
        .filter(i => (i.name || i.text || "").toLowerCase().includes(searchQuery.toLowerCase()));
    const ideaItems = filteredIdeas.filter(i => i.status === "idea");
    const draftItems = filteredIdeas.filter(i => i.status === "draft");
    const publishedItems = filteredIdeas.filter(i => i.status === "published");
    const hero = filteredIdeas[0] || null;
    const activeHero = selected || hero;

    const selectIdea = idea => {
        setSelected(idea);
        setFabOpen(false);
    };
    const clearSelection = () => {
        setSelected(null);
        setFabOpen(false);
    };

    const startEdit = (idea) => {
        if (!idea && !activeHero) return;
        setViewingIdea(null);          // close view if open
        setEditingIdea(idea || activeHero);
    };

    const startView = () => {
        if (!activeHero) return;
        setViewingIdea(activeHero);
    };

    const handleMove = async () => {
        if (!activeHero) return;
        const next = STATUS_NEXT[activeHero.status];
        if (!next) return;
        setMoving(true);
        setFabOpen(false);
        try { await onStatusChange(activeHero.id, next); clearSelection(); }
        finally { setMoving(false); }
    };

    const handleMoveBack = async () => {
        if (!activeHero) return;
        const prev = STATUS_PREV[activeHero.status];
        if (!prev) return;
        setMoving(true);
        setFabOpen(false);
        try { await onStatusChange(activeHero.id, prev); clearSelection(); }
        finally { setMoving(false); }
    };

    const handleDeleteConfirmed = async () => {
        if (!activeHero) return;
        setShowDel(false);
        setDeleting(true);
        try { await onDelete(activeHero.id); clearSelection(); }
        finally { setDeleting(false); }
    };

    /* ── View gate: full-screen read-only view ───────────────────── */
    if (viewingIdea) {
        return (
            <ViewIdeaPage
                idea={viewingIdea}
                onBack={() => setViewingIdea(null)}
                onEdit={(idea) => {
                    setViewingIdea(null);
                    setEditingIdea(idea);
                }}
            />
        );
    }

    /* ── Edit gate: full-screen editor ───────────────────────────── */
    if (editingIdea) {
        return (
            <EditIdeaPage
                idea={editingIdea}
                onSave={async (id, data) => {
                    await onUpdate(id, data);
                    if (selected && selected.id === id) {
                        setSelected(prev => ({ ...prev, ...data }));
                    }
                    setEditingIdea(null);
                }}
                onCancel={() => setEditingIdea(null)}
            />
        );
    }

    if (isCreatingIdea) {
        return (
            <CreateIdeaPage
                onSave={async (data) => {
                    if (onCreate) await onCreate(data);
                    setIsCreatingIdea(false);
                }}
                onCancel={() => setIsCreatingIdea(false)}
            />
        );
    }

    return (
        <div style={{
            height: "100vh", display: "flex", flexDirection: "column",
            background: C.bg, color: C.text, fontFamily: "Inter,sans-serif",
            overflow: "hidden", WebkitFontSmoothing: "antialiased",
            boxShadow: "none"
        }}>

            {/* ── NAV ──────────────────────────────────── */}
            <nav style={{
                height: 52, flexShrink: 0, background: C.surface,
                borderBottom: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", padding: "0 24px", gap: 14
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 28, height: 28, background: C.accent, borderRadius: 7,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: ".85rem", boxShadow: `0 0 14px ${C.aGlow}`
                    }}>⚡</div>
                    <span style={{ fontWeight: 900, fontSize: "0.9rem", letterSpacing: "-.3px" }} contentEditable suppressContentEditableWarning>
                        Your <span style={{ color: C.accent }}>Brand</span>
                    </span>
                </div>

                <div style={{ flex: 1 }} />

                <span style={{ fontFamily: "monospace", fontSize: ".72rem", color: C.muted2 }}>{dateStr}</span>

                <input
                    type="text"
                    placeholder="Search ideas…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                        background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 8,
                        padding: "6px 12px", fontSize: ".78rem", color: C.text, outline: "none", width: "200px"
                    }}
                />

                <button onClick={() => setIsCreatingIdea(true)}
                    style={btn({
                        background: C.accent, color: "#fff", padding: "7px 16px",
                        fontSize: ".82rem", boxShadow: `0 0 16px ${C.aGlow}`
                    })}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 0 26px rgba(232,51,74,.45)` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 16px ${C.aGlow}` }}>
                    ＋ New Idea
                </button>

                <button onClick={onLogout}
                    style={btn({
                        background: "none", border: `1px solid ${C.border}`,
                        color: C.muted2, padding: "6px 12px", fontSize: ".78rem"
                    })}
                    onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.border2 }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.muted2; e.currentTarget.style.borderColor = C.border }}>
                    Logout
                </button>
            </nav>

            {/* ── SHELL ────────────────────────────────── */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                <aside style={{
                    width: 52, background: C.surface, borderRight: `1px solid ${C.border}`,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "14px 0", gap: 10, flexShrink: 0
                }}>
                    {[
                        { id: "board", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg> }
                    ].map((item) => (
                        <SbIcon key={item.id} icon={item.icon} active={true} onClick={() => { }} />
                    ))}
                </aside>


                {/* main content */}
                <main style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    padding: "18px 22px", gap: 14, overflow: "hidden"
                }}>

                    {/* ── BENTO ROW ───────────────────────── */}
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr 190px 190px",
                        gap: 14, flexShrink: 0
                    }}>

                        {/* Hero card */}
                        <div style={surfCard({
                            gridColumn: "span 2", padding: "20px 22px",
                            position: "relative", overflow: "visible", cursor: "pointer",
                            transition: "all .25s"
                        })}
                            onClick={() => { if (hero) selectIdea(activeHero); }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,51,74,.3)"; e.currentTarget.style.boxShadow = `0 0 40px rgba(232,51,74,.07)` }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none" }}>
                            {/* dim bg number */}
                            <div style={{
                                position: "absolute", right: -8, top: -16, fontSize: "7rem",
                                fontWeight: 900, color: "rgba(0,0,0,0.04)",
                                lineHeight: 1, pointerEvents: "none", userSelect: "none"
                            }}>01</div>

                            {activeHero ? (
                                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                        <div style={{
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase",
                                            letterSpacing: 1, padding: "4px 10px", borderRadius: 6,
                                            background: pOf(activeHero.channel).bg, color: pOf(activeHero.channel).c
                                        }}>
                                            {activeHero.channel}
                                        </div>
                                        <div style={{
                                            padding: "4px 10px", borderRadius: 6, fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase",
                                            color: activeHero.status === "idea" ? C.accent : activeHero.status === "published" ? C.green : C.blue,
                                            background: activeHero.status === "idea" ? "rgba(232,51,74,.1)" : activeHero.status === "published" ? "rgba(22,163,74,.1)" : "rgba(37,99,235,.1)",
                                        }}>
                                            {activeHero.status}
                                        </div>
                                        <div style={{ marginLeft: "auto", fontSize: ".7rem", color: C.muted2, fontWeight: 600 }}>
                                            {fmtDate(activeHero.createdAt)}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: "1.2rem", fontWeight: 800, lineHeight: 1.4,
                                        letterSpacing: "-.5px", color: C.text, marginBottom: "auto",
                                        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                                    }}>
                                        {activeHero.name || "Untitled Idea"}
                                    </div>

                                    {/* Attachments Display */}
                                    {(activeHero.links?.length > 0 || activeHero.images?.length > 0) && (
                                        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap", overflowY: "auto", maxHeight: "80px", paddingBottom: "4px" }}>
                                            {activeHero.links?.map((link, i) => (
                                                <div key={i} onClick={e => e.stopPropagation()}
                                                    style={{ width: "100%", fontSize: ".75rem", color: C.text, background: C.surf2, padding: "8px 10px", borderRadius: "8px", border: `1px solid ${C.border}`, whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                                                    <span style={{ color: C.accent, fontWeight: 700, marginRight: 6 }}>🔗 Link {i + 1}:</span>
                                                    {link}
                                                </div>
                                            ))}
                                            {activeHero.images?.map((img, i) => (
                                                <a key={`img-${i}`} href={img} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                                                    <img src={img} alt={`Attachment ${i}`} style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "6px", border: `1px solid ${C.border}`, cursor: "pointer" }} />
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* ══ GLASSMORPHIC COMMAND BAR ══════════════════════════════ */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>

                                        {/* ── Unified pill container ── */}
                                        <div style={{
                                            display: "inline-flex", alignItems: "stretch",
                                            background: "rgba(255,255,255,0.72)",
                                            backdropFilter: "blur(12px)",
                                            WebkitBackdropFilter: "blur(12px)",
                                            border: `1px solid ${C.border}`,
                                            borderRadius: 999,
                                            boxShadow: "0 2px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                                            overflow: "visible",
                                            position: "relative",
                                        }}>

                                            {/* §1 — STATUS section (Speed-Dial FAB) */}
                                            <div
                                                onMouseEnter={() => setHoveredBtn("status")}
                                                onMouseLeave={() => setHoveredBtn(null)}
                                                style={{ position: "relative", padding: "0 4px 0 4px" }}
                                            >
                                                {/* Sliding highlight for this section */}
                                                <div style={{
                                                    position: "absolute", inset: "4px",
                                                    borderRadius: 999,
                                                    background: hoveredBtn === "status" ? "linear-gradient(135deg, rgba(232,51,74,0.15), rgba(232,51,74,0.08))" : "transparent",
                                                    transition: "background 0.25s ease",
                                                    pointerEvents: "none",
                                                }} />

                                                {/* Speed-Dial FAB trigger */}
                                                <div
                                                    onClick={e => { e.stopPropagation(); if (!moving) setFabOpen(o => !o); }}
                                                    style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", padding: "5px 10px 5px 6px", gap: 6, cursor: moving ? "default" : "pointer" }}
                                                >
                                                    <button
                                                        disabled={moving}
                                                        title="Change status"
                                                        style={btn({
                                                            width: 28, height: 28, padding: 0, borderRadius: "50%",
                                                            background: fabOpen
                                                                ? C.text
                                                                : `linear-gradient(135deg, ${C.accent}, #ff6b35)`,
                                                            color: "#fff", fontSize: ".85rem",
                                                            boxShadow: fabOpen ? "0 3px 12px rgba(0,0,0,0.3)" : `0 0 14px ${C.aGlow}, 0 2px 6px rgba(232,51,74,0.4)`,
                                                            transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)",
                                                            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            opacity: moving ? 0.6 : 1, flexShrink: 0,
                                                            pointerEvents: "none",
                                                        })}
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                                                        </svg>
                                                    </button>
                                                    <span style={{ fontSize: ".75rem", fontWeight: 700, color: fabOpen ? C.text : C.accent, letterSpacing: "-.2px", transition: "color .2s", userSelect: "none" }}>
                                                        Status
                                                    </span>
                                                </div>

                                                {/* BACK bubble */}
                                                {STATUS_PREV[activeHero.status] && (
                                                    <button onClick={e => { e.stopPropagation(); handleMoveBack(); }} disabled={moving}
                                                        title={STATUS_PREV_LABEL[activeHero.status]}
                                                        style={{
                                                            position: "absolute",
                                                            bottom: fabOpen ? "48px" : "0px",
                                                            left: fabOpen ? "-36px" : "14px",
                                                            width: 28, height: 28, borderRadius: "50%",
                                                            background: C.surface, border: `1.5px solid ${C.border2}`,
                                                            color: C.muted2, fontSize: ".7rem", fontWeight: 900,
                                                            opacity: fabOpen ? 1 : 0, pointerEvents: fabOpen ? "all" : "none",
                                                            transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                                            boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
                                                            fontFamily: "Inter,sans-serif", zIndex: 20,
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = C.surf2; e.currentTarget.style.color = C.text; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.muted2; }}
                                                    >←</button>
                                                )}

                                                {/* FORWARD bubble */}
                                                {STATUS_NEXT[activeHero.status] && (
                                                    <button onClick={e => { e.stopPropagation(); handleMove(); }} disabled={moving}
                                                        title={STATUS_NEXT_LABEL[activeHero.status]}
                                                        style={{
                                                            position: "absolute",
                                                            bottom: fabOpen ? "48px" : "0px",
                                                            left: fabOpen ? "48px" : "14px",
                                                            width: 28, height: 28, borderRadius: "50%",
                                                            background: `linear-gradient(135deg, ${C.accent}, #ff6b35)`,
                                                            color: "#fff", fontSize: ".7rem", fontWeight: 900, border: "none",
                                                            opacity: fabOpen ? 1 : 0, pointerEvents: fabOpen ? "all" : "none",
                                                            transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1) 0.04s",
                                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                                            boxShadow: `0 0 14px ${C.aGlow}`,
                                                            fontFamily: "Inter,sans-serif", zIndex: 20,
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = `0 0 20px rgba(232,51,74,.55)`; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 0 14px ${C.aGlow}`; }}
                                                    >→</button>
                                                )}

                                                {/* FAB tooltip labels */}
                                                {fabOpen && STATUS_PREV[activeHero.status] && (
                                                    <div style={{ position: "absolute", bottom: "82px", left: "-42px", fontSize: ".58rem", fontWeight: 700, color: C.muted2, textTransform: "uppercase", letterSpacing: ".5px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20 }}>
                                                        {STATUS_PREV_LABEL[activeHero.status]}
                                                    </div>
                                                )}
                                                {fabOpen && STATUS_NEXT[activeHero.status] && (
                                                    <div style={{ position: "absolute", bottom: "82px", left: "38px", fontSize: ".58rem", fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: ".5px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20 }}>
                                                        {STATUS_NEXT_LABEL[activeHero.status]}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Vertical divider */}
                                            <div style={{ width: 1, background: C.border, alignSelf: "stretch", margin: "6px 0" }} />

                                            {/* §2 — VIEW section */}
                                            <button
                                                onClick={e => { e.stopPropagation(); startView(); }}
                                                onMouseEnter={() => setHoveredBtn("view")}
                                                onMouseLeave={() => setHoveredBtn(null)}
                                                style={{
                                                    border: "none", cursor: "pointer", background: "transparent",
                                                    display: "flex", alignItems: "center", gap: 6,
                                                    padding: "0 14px", borderRadius: 0,
                                                    fontFamily: "Inter,sans-serif", fontWeight: 700,
                                                    fontSize: ".75rem",
                                                    color: hoveredBtn === "view" ? C.text : C.muted2,
                                                    position: "relative", transition: "color 0.2s",
                                                }}
                                            >
                                                {/* Sliding bg highlight */}
                                                <div style={{
                                                    position: "absolute", inset: "4px", borderRadius: 999,
                                                    background: hoveredBtn === "view" ? "rgba(26,26,46,0.07)" : "transparent",
                                                    transition: "background 0.2s ease", pointerEvents: "none",
                                                }} />
                                                <span style={{ display: "flex", alignItems: "center", zIndex: 1, color: hoveredBtn === "view" ? "#6b6b80" : "#a0a0b0", transition: "color 0.2s" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                        <circle cx="12" cy="12" r="3"/>
                                                    </svg>
                                                </span>
                                                <span style={{ zIndex: 1 }}>View</span>
                                            </button>

                                            {/* Vertical divider */}
                                            <div style={{ width: 1, background: C.border, alignSelf: "stretch", margin: "6px 0" }} />

                                            {/* §3 — EDIT section */}
                                            <button
                                                onClick={e => { e.stopPropagation(); startEdit(activeHero); }}
                                                onMouseEnter={() => setHoveredBtn("edit")}
                                                onMouseLeave={() => setHoveredBtn(null)}
                                                style={{
                                                    border: "none", cursor: "pointer", background: "transparent",
                                                    display: "flex", alignItems: "center", gap: 6,
                                                    padding: "0 14px", borderRadius: 0,
                                                    fontFamily: "Inter,sans-serif", fontWeight: 700,
                                                    fontSize: ".75rem",
                                                    color: hoveredBtn === "edit" ? C.text : C.muted2,
                                                    position: "relative", transition: "color 0.2s",
                                                }}
                                            >
                                                {/* Sliding bg highlight */}
                                                <div style={{
                                                    position: "absolute", inset: "4px", borderRadius: 999,
                                                    background: hoveredBtn === "edit" ? "rgba(26,26,46,0.07)" : "transparent",
                                                    transition: "background 0.2s ease", pointerEvents: "none",
                                                }} />
                                                <span style={{ display: "flex", alignItems: "center", zIndex: 1, color: hoveredBtn === "edit" ? "#6b6b80" : "#a0a0b0", transition: "color 0.2s" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </span>
                                                <span style={{ zIndex: 1 }}>Edit</span>
                                            </button>

                                            {/* Vertical divider */}
                                            <div style={{ width: 1, background: C.border, alignSelf: "stretch", margin: "6px 0" }} />

                                            {/* §3 — DELETE section */}
                                            <button
                                                onClick={e => { e.stopPropagation(); setShowDel(true); }}
                                                onMouseEnter={() => setHoveredBtn("del")}
                                                onMouseLeave={() => setHoveredBtn(null)}
                                                style={{
                                                    border: "none", cursor: "pointer", background: "transparent",
                                                    display: "flex", alignItems: "center", gap: 6,
                                                    padding: "0 14px 0 10px", borderRadius: 0,
                                                    fontFamily: "Inter,sans-serif", fontWeight: 700,
                                                    fontSize: ".75rem", position: "relative",
                                                    color: hoveredBtn === "del" ? "#dc2626" : C.muted2,
                                                    transition: "color 0.2s",
                                                }}
                                            >
                                                {/* Sliding bg highlight */}
                                                <div style={{
                                                    position: "absolute", inset: "4px", borderRadius: 999,
                                                    background: hoveredBtn === "del" ? "rgba(220,38,38,0.1)" : "transparent",
                                                    transition: "background 0.2s ease", pointerEvents: "none",
                                                }} />
                                                <span style={{ display: "flex", alignItems: "center", zIndex: 1, color: hoveredBtn === "del" ? "#dc2626" : "#a0a0b0", transition: "color 0.2s" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                        <path d="M10 11v6M14 11v6"/>
                                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                    </svg>
                                                </span>
                                                <span style={{ zIndex: 1 }}>Delete</span>
                                            </button>
                                        </div>
                                        {/* ══ END COMMAND BAR ═══════════════════════════════════════ */}

                                        {/* Close button stays separate on the far right */}
                                        {selected && (
                                            <button onClick={e => { e.stopPropagation(); clearSelection(); }}
                                                style={btn({ marginLeft: "auto", padding: "7px 12px", fontSize: ".78rem", background: "transparent", color: C.muted, letterSpacing: "-.2px" })}>
                                                ✕ Close
                                            </button>
                                        )}
                                    </div>
                                    {/* ══════════════════════════════════════════════════════════ */}
                                </div>
                            ) : (
                                <div style={{ color: C.muted, fontSize: ".88rem", position: "relative", zIndex: 1 }}>
                                    No ideas yet — click <strong style={{ color: C.accent }}>＋ New Idea</strong> to begin.
                                </div>
                            )}
                        </div>

                        {/* Stat 1 */}
                        <StatCard label="Total Ideas" value={filteredIdeas.length} color={C.accent} sub="in your pipeline" />
                        {/* Dropdown 2 */}
                        <PlatformDropdown current={filterChannel} onSelect={setFilterChannel} />
                    </div>

                    {/* ── KANBAN ──────────────────────────── */}
                    {loading ? (
                        <div style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                            color: C.muted2, fontSize: ".88rem"
                        }}>Loading ideas…</div>
                    ) : error ? (
                        <div style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                            color: C.accent, fontSize: ".88rem"
                        }}>{error}</div>
                    ) : (
                        <div style={{
                            flex: 1, display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                            gap: 14, overflow: "hidden"
                        }}>
                            <KanbanCol title="Ideas" dot={C.accent} items={ideaItems}
                                onSelect={selectIdea} statusLabel="idea" />
                            <KanbanCol title="Draft" dot={C.blue} items={draftItems}
                                onSelect={selectIdea} statusLabel="draft" />
                            <KanbanCol title="Published" dot={C.green} items={publishedItems}
                                onSelect={selectIdea} statusLabel="published" />
                        </div>
                    )}
                </main>
            </div>

            {/* delete confirm */}
            <DeleteConfirmModal
                show={showDel}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setShowDel(false)} />
        </div>
    );
}

/* ── sub-components ──────────────────────────────── */
function SbIcon({ icon, active, onClick }) {
    return (
        <div onClick={onClick} style={{
            width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", fontSize: ".9rem",
            position: "relative",
            background: active ? "#fff0f2" : "transparent",
            color: active ? "#E8334A" : "#a0a0b0",
            borderLeft: active ? "2px solid #E8334A" : "2px solid transparent",
            transition: "all .15s"
        }}>
            {icon}
        </div>
    );
}

function StatCard({ label, value, color, sub }) {
    return (
        <div style={{
            alignSelf: "flex-start",
            background: "#ffffff", border: "1.5px solid #ede8e3",
            borderRadius: 14, padding: "18px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
            <div style={{
                fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 1, color: "#a0a0b0", marginBottom: 8
            }}>{label}</div>
            <div style={{
                fontSize: "2.2rem", fontWeight: 900, lineHeight: 1,
                letterSpacing: "-1.5px", color
            }}>{value}</div>
            <div style={{ fontSize: ".68rem", color: "#a0a0b0", marginTop: 6 }}>{sub}</div>
        </div>
    );
}

function KanbanCol({ title, dot, items, onSelect }) {
    const emptyMsg = { Ideas: "No ideas yet — add one!", Draft: "Move ideas here to start drafting.", Published: "Publish a draft to see it here." };
    return (
        <div style={{
            background: "#ffffff", border: "1.5px solid #ede8e3",
            borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
            {/* ── glassmorphic pill header ── */}
            <div style={{
                padding: "10px 14px", borderBottom: "1.5px solid #ede8e3",
                flexShrink: 0, background: "#fdf6f0"
            }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 9,
                    background: `linear-gradient(135deg, ${dot}18, ${dot}0a)`,
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: `1px solid ${dot}40`,
                    borderRadius: 999,
                    padding: "7px 14px",
                    boxShadow: `0 2px 12px ${dot}20, inset 0 1px 0 rgba(255,255,255,0.75)`,
                    position: "relative",
                }}>
                    {/* glowing status dot */}
                    <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: dot,
                        boxShadow: `0 0 0 3px ${dot}25, 0 0 8px ${dot}80`,
                        flexShrink: 0,
                    }} />
                    {/* title in accent color */}
                    <span style={{
                        fontSize: ".68rem", fontWeight: 800, textTransform: "uppercase",
                        letterSpacing: "1.4px", color: dot,
                        filter: "brightness(0.78)",
                    }}>{title}</span>
                    {/* count badge */}
                    <span style={{
                        marginLeft: "auto",
                        background: `${dot}18`,
                        border: `1px solid ${dot}35`,
                        borderRadius: 999,
                        padding: "1px 9px",
                        fontFamily: "monospace", fontSize: ".68rem",
                        fontWeight: 700,
                        color: dot,
                        filter: "brightness(0.78)",
                    }}>{items.length}</span>
                </div>
            </div>
            {/* rows */}
            <div style={{ flex: 1, overflowY: "auto" }}>
                {items.length === 0 ? (
                    <div style={{
                        border: "2px dashed #ede8e3", borderRadius: 10,
                        margin: 12, padding: "22px 14px", textAlign: "center",
                        color: "#a0a0b0", fontSize: ".78rem"
                    }}>
                        {emptyMsg[title]}
                    </div>
                ) : items.map((idea, idx) => (
                    <EditorialRow key={idea.id} idea={idea} idx={idx + 1} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
}

function EditorialRow({ idea, idx, onSelect }) {
    const [hov, setHov] = useState(false);
    const p = pOf(idea.channel);
    return (
        <div onClick={() => onSelect(idea)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "11px 18px",
                borderLeft: hov ? `2px solid #E8334A` : "2px solid transparent",
                borderBottom: "1.5px solid #ede8e3",
                background: hov ? "#fff0f2" : "transparent",
                cursor: "pointer", transition: "all .16s"
            }}>
            <span style={{
                fontFamily: "monospace", fontSize: ".72rem", fontWeight: 700,
                color: "#a0a0b0", width: 22, flexShrink: 0, paddingTop: 2
            }}>
                {String(idx).padStart(2, "0")}
            </span>
            <div style={{
                width: 6, height: 6, borderRadius: "50%", background: p.c,
                boxShadow: `0 0 5px ${p.c}88`, flexShrink: 0, marginTop: 5
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: ".83rem", fontWeight: 600, color: "#1a1a2e",
                    lineHeight: 1.35, marginBottom: 3,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                    {idea.name || "Untitled Idea"}
                </div>
                <div style={{
                    fontSize: ".67rem", color: "#a0a0b0", display: "flex",
                    alignItems: "center", gap: 6
                }}>
                    <span style={{
                        background: p.bg, color: p.c, padding: "1px 6px",
                        borderRadius: 4, fontSize: ".6rem", fontWeight: 700
                    }}>
                        {p.ab}
                    </span>
                    {fmtDate(idea.createdAt)}
                    {idea.status === "published" &&
                        <span style={{ color: "#16a34a", marginLeft: 4 }}>✓ Live</span>}
                </div>
            </div>
        </div>
    );
}

function PlatformDropdown({ current, onSelect }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{
            alignSelf: "flex-start",
            position: "relative", zIndex: 10, background: "#ffffff", border: "1.5px solid #ede8e3",
            borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column",
            justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }} onClick={() => setOpen(!open)}>
            <div style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#a0a0b0", marginBottom: 8, transition: "color .2s" }}>
                Filter by Platform
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-1px", color: current === "All" ? C.text : pOf(current).c, display: "flex", alignItems: "center", gap: 8 }}>
                {current !== "All" && pOf(current).icon && (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: pOf(current).bg, color: pOf(current).c, borderRadius: 8 }}>
                        {pOf(current).icon}
                    </span>
                )}
                {current === "All" ? "All Channels" : current}
                <span style={{ fontSize: ".9rem", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s cubic-bezier(0.34, 1.56, 0.64, 1)", marginLeft: "auto", color: "#a0a0b0" }}>▼</span>
            </div>

            {/* dropdown menu */}
            <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
                background: "#ffffff", border: "1.5px solid #ede8e3", borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                pointerEvents: open ? "all" : "none",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
                transformOrigin: "top center",
                transition: "all .25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                overflow: "hidden", zIndex: 20
            }}>
                {["All", ...Object.keys(P)].map((ch, i) => {
                    const active = ch === current;
                    const p = ch === "All" ? null : P[ch];
                    return (
                        <div key={ch}
                            onClick={(e) => { e.stopPropagation(); onSelect(ch); setOpen(false); }}
                            style={{
                                padding: "10px 16px", fontSize: ".82rem", fontWeight: 700,
                                color: active ? (p ? p.c : C.text) : "#6b6b80",
                                background: active ? (p ? p.bg : "#fdf6f0") : "transparent",
                                display: "flex", alignItems: "center", gap: 8,
                                cursor: "pointer", transition: "all .15s",
                                transform: open ? "translateX(0)" : "translateX(-15px)",
                                opacity: open ? 1 : 0,
                                transitionDelay: open ? `${i * 25}ms` : "0ms"
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#fff0f2"; e.currentTarget.style.color = C.text; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b6b80"; }}>
                            {p && p.icon ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: p.bg, color: p.c, borderRadius: 6, visibility: active ? "hidden" : "visible" }}>{p.icon}</span> : null}
                            {ch === "All" ? "All Channels" : ch}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
