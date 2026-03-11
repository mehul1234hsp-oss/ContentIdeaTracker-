// frontend/src/components/ViewIdeaPage.js
// Read-only idea viewer — mirrors EditIdeaPage layout but zero editable fields.

const C = {
    bg: "#fdf6f0", surface: "#ffffff", surf2: "#f5ece4", border: "#ede8e3",
    text: "#1a1a2e", muted: "#a0a0b0", muted2: "#6b6b80", accent: "#E8334A",
};

/* ── platform colours (mirrors EditIdeaPage) ─────────────────────────── */
const P = {
    Instagram: { c: "#e1306c",  bg: "rgba(225,48,108,0.12)"  },
    LinkedIn:  { c: "#0a66c2",  bg: "rgba(10,102,194,0.12)"  },
    Twitter:   { c: "#1d9bf0",  bg: "rgba(29,155,240,0.12)"  },
    YouTube:   { c: "#ff3b30",  bg: "rgba(255,59,48,0.12)"   },
    Facebook:  { c: "#1877f2",  bg: "rgba(24,119,242,0.12)"  },
    TikTok:    { c: "#25f4ee",  bg: "rgba(37,244,238,0.12)"  },
    WhatsApp:  { c: "#25d366",  bg: "rgba(37,211,102,0.12)"  },
};
const pOf = ch => P[ch] || { c: "#888899", bg: "rgba(136,136,153,0.12)" };

/* ── status colour map ───────────────────────────────────────────────── */
const STATUS_COLOR = {
    idea:      { c: "#E8334A", bg: "rgba(232,51,74,0.10)"  },
    draft:     { c: "#2563eb", bg: "rgba(37,99,235,0.10)"  },
    published: { c: "#16a34a", bg: "rgba(22,163,74,0.10)"  },
};

/* ── tiny shared style helper ────────────────────────────────────────── */
const btn = (extra = {}) => ({
    border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif",
    fontWeight: 700, borderRadius: 8, transition: "all 0.18s", ...extra,
});

/* ── label above each field ─────────────────────────────────────────── */
function FieldLabel({ children }) {
    return (
        <div style={{
            fontSize: ".72rem", fontWeight: 700, color: C.muted2,
            textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8,
        }}>
            {children}
        </div>
    );
}

/* ── readonly display block (replaces <input> / <textarea>) ──────────── */
function ReadonlyBlock({ children, minHeight, style = {} }) {
    return (
        <div style={{
            width: "100%", padding: "14px 16px",
            background: C.surf2, border: `1.5px solid ${C.border}`,
            borderRadius: 12, fontFamily: "Inter,sans-serif",
            fontSize: "1rem", color: C.text, lineHeight: 1.6,
            minHeight: minHeight || "auto", whiteSpace: "pre-wrap",
            wordBreak: "break-word", boxSizing: "border-box",
            ...style,
        }}>
            {children || <span style={{ color: C.muted }}>—</span>}
        </div>
    );
}

/* ── date formatter ──────────────────────────────────────────────────── */
const fmtDate = d =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ── link normalizer ─────────────────────────────────────────────────── *
 *  Handles the case where multiple URLs were accidentally stored as a    *
 *  single space-separated string in one array slot. Flattens them so    *
 *  every entry rendered is exactly one URL.                              */
const normalizeLinks = (links = []) =>
    links.flatMap(lnk => lnk.trim().split(/\s+/).filter(Boolean));

/* ════════════════════════════════════════════════════════════════════════
   ViewIdeaPage
   Props:
     idea      — the full idea object
     onBack    — called when user clicks ← Back
     onEdit    — called when user clicks ✏ Edit (passes idea)
════════════════════════════════════════════════════════════════════════ */
export default function ViewIdeaPage({ idea, onBack, onEdit }) {
    if (!idea) return null;

    const plat   = pOf(idea.channel);
    const status = STATUS_COLOR[idea.status] || STATUS_COLOR.idea;
    const statusLabel = idea.status
        ? idea.status.charAt(0).toUpperCase() + idea.status.slice(1)
        : "Idea";

    return (
        <div style={{
            minHeight: "100vh", display: "flex", flexDirection: "column",
            background: C.bg, color: C.text, fontFamily: "Inter,sans-serif",
        }}>

            {/* ── Glassmorphic nav strip ── */}
            <nav style={{
                height: 64, flexShrink: 0,
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                borderBottom: "1px solid rgba(237,232,227,0.9)",
                display: "flex", alignItems: "center",
                padding: "0 28px", gap: 16,
                position: "sticky", top: 0, zIndex: 10,
            }}>
                {/* Back */}
                <button
                    onClick={onBack}
                    style={btn({
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 18px", borderRadius: 999,
                        background: "rgba(255,255,255,0.7)",
                        border: "1.5px solid rgba(180,170,160,0.5)",
                        color: "#3a3a5c",
                        fontSize: ".82rem", letterSpacing: ".2px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    })}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#b4aaa0"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(180,170,160,0.5)"; }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back
                </button>

                <div style={{ flex: 1, textAlign: "center", fontWeight: 800, fontSize: "1.25rem", color: C.text, letterSpacing: "-.4px" }}>
                    View Idea
                </div>

                {/* Edit — crimson gradient capsule */}
                <button
                    onClick={() => onEdit(idea)}
                    style={btn({
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 22px", borderRadius: 999,
                        background: "linear-gradient(135deg, #E8334A, #ff6347)",
                        color: "#fff", fontSize: ".82rem", letterSpacing: ".3px",
                        boxShadow: "0 4px 18px rgba(232,51,74,0.38), 0 1px 4px rgba(232,51,74,0.2)",
                        border: "none",
                    })}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,51,74,0.5), 0 2px 6px rgba(232,51,74,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,51,74,0.38), 0 1px 4px rgba(232,51,74,0.2)"; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                </button>
            </nav>

            {/* ── Main content ────────────────────────────────────────── */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "30px 20px", overflowY: "auto" }}>
                <div style={{
                    width: "100%", maxWidth: "700px", background: C.surface,
                    border: `1px solid ${C.border}`, borderRadius: 16,
                    padding: "30px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                    display: "flex", flexDirection: "column", gap: 24,
                }}>

                    {/* ── Idea Name ──────────────────────────────────── */}
                    <div>
                        <FieldLabel>Idea Name</FieldLabel>
                        <ReadonlyBlock style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                            {idea.name || "Untitled Idea"}
                        </ReadonlyBlock>
                    </div>

                    {/* ── Idea Content ───────────────────────────────── */}
                    <div>
                        <FieldLabel>Idea Content</FieldLabel>
                        <ReadonlyBlock minHeight="140px">
                            {idea.text}
                        </ReadonlyBlock>
                    </div>

                    {/* ── Platform + Status row ──────────────────────── */}
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

                        {/* Platform */}
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <FieldLabel>Platform</FieldLabel>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "8px 16px", borderRadius: 999,
                                background: plat.bg, border: `1.5px solid ${plat.c}40`,
                                fontWeight: 700, fontSize: ".9rem", color: plat.c,
                            }}>
                                {/* coloured dot */}
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: plat.c, display: "inline-block" }} />
                                {idea.channel || "—"}
                            </div>
                        </div>

                        {/* Status */}
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <FieldLabel>Status</FieldLabel>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "8px 16px", borderRadius: 999,
                                background: status.bg, border: `1.5px solid ${status.c}40`,
                                fontWeight: 700, fontSize: ".9rem", color: status.c,
                            }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: status.c, boxShadow: `0 0 6px ${status.c}88`, display: "inline-block" }} />
                                {statusLabel}
                            </div>
                        </div>
                    </div>

                    {/* ── Links ──────────────────────────────────────── */}
                    {idea.links?.length > 0 && (() => {
                        const links = normalizeLinks(idea.links);
                        return (
                        <div>
                            <FieldLabel>Links · {links.length}</FieldLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {links.map((lnk, i) => {
                                    const href = lnk.startsWith("http") ? lnk : `https://${lnk}`;
                                    let hostname = lnk;
                                    try { hostname = new URL(href).hostname.replace(/^www\./, ""); } catch {}
                                    return (
                                        <a
                                            key={i}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                display: "flex", alignItems: "center", gap: 14,
                                                padding: "14px 16px", borderRadius: 12,
                                                background: C.surf2,
                                                border: `1.5px solid ${C.border}`,
                                                borderLeft: `4px solid ${C.accent}`,
                                                textDecoration: "none",
                                                transition: "all .18s",
                                                cursor: "pointer",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = "#fff0f2";
                                                e.currentTarget.style.borderColor = `${C.accent}`;
                                                e.currentTarget.style.boxShadow = `0 4px 16px ${C.accent}18`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = C.surf2;
                                                e.currentTarget.style.borderColor = C.border;
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            {/* Numbered badge */}
                                            <span style={{
                                                width: 28, height: 28, borderRadius: 8,
                                                background: `${C.accent}15`,
                                                border: `1px solid ${C.accent}30`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: ".7rem", fontWeight: 800, color: C.accent,
                                                flexShrink: 0,
                                            }}>
                                                {i + 1}
                                            </span>

                                            {/* Link info */}
                                            <div style={{ flex: 1, overflow: "hidden" }}>
                                                {/* Domain — large and bold */}
                                                <div style={{
                                                    fontWeight: 700, fontSize: ".95rem",
                                                    color: C.text, whiteSpace: "nowrap",
                                                    overflow: "hidden", textOverflow: "ellipsis",
                                                }}>
                                                    {hostname}
                                                </div>
                                                {/* Full URL — small, muted, truncated */}
                                                <div style={{
                                                    fontSize: ".75rem", color: C.muted2,
                                                    marginTop: 2, whiteSpace: "nowrap",
                                                    overflow: "hidden", textOverflow: "ellipsis",
                                                }}>
                                                    {lnk}
                                                </div>
                                            </div>

                                            {/* External link arrow */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                <polyline points="15 3 21 3 21 9"/>
                                                <line x1="10" y1="14" x2="21" y2="3"/>
                                            </svg>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                        );
                    })()}

                    {/* ── Images ─────────────────────────────────────── */}
                    {idea.images?.length > 0 && (
                        <div>
                            <FieldLabel>Images</FieldLabel>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                                {idea.images.map((img, i) => (
                                    <a key={i} href={img} target="_blank" rel="noreferrer">
                                        <img
                                            src={img}
                                            alt={`Attachment ${i + 1}`}
                                            style={{
                                                width: 100, height: 100, borderRadius: 12,
                                                objectFit: "cover",
                                                border: `2px solid ${C.border}`,
                                                cursor: "pointer", transition: "transform .15s",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Created date ───────────────────────────────── */}
                    <div style={{
                        paddingTop: 8, borderTop: `1px solid ${C.border}`,
                        fontSize: ".78rem", color: C.muted,
                        display: "flex", alignItems: "center", gap: 6,
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        Created on {fmtDate(idea.createdAt)}
                    </div>

                </div>
            </div>
        </div>
    );
}
