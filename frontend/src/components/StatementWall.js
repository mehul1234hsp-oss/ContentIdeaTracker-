import { useEffect, useRef } from "react";
import "./StatementWall.css";

// ── Data ──────────────────────────────────────────────────────────────────
const LINES = [
    { text: ["For the ", "fitness coach", " posting workout tips at 5am before the world wakes up."], card: "ig1" },
    { text: ["For the ", "educator", " turning LinkedIn threads into courses and reels into lessons."], card: "li" },
    { text: ["For the ", "food creator", " who can cook anything but couldn't survive without fresh ideas."], card: "tk" },
    { text: ["For the ", "business founder", " who has a story to tell but no time to plan it."], card: "tw" },
    { text: ["For the ", "travel vlogger", " capturing the world one post at a time."], card: "ig2" },
    { text: ["Capture the spark. ", "Publish the fire."], card: "ig2" },
];

// Chapters 0-4: fitness coach → travel vlogger. 
const CHAPTERS = LINES.length - 1; // 5
// Increased back to 2.0 so it doesn't skip instantly to the end
const SENTINEL_VH = 2.0;

// ── Tiny SVG icons ────────────────────────────────────────────────────────
const IH = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const IC = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const IS = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const IB = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>;

const igRing = "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)";

// Base style for each card (all stacked absolutely, only active one is visible)
const CARD_BASE = {
    position: "absolute", inset: 0,
    borderRadius: 18, overflow: "hidden",
    boxShadow: "0 24px 70px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.05)",
    opacity: 0,
    transform: "translateY(20px) rotate(2.5deg) scale(0.96)",
    transition: "opacity 0.35s ease, transform 0.38s cubic-bezier(0.34,1.4,0.64,1)",
    willChange: "opacity, transform",
};

// ── Social post cards ─────────────────────────────────────────────────────
function SocialCards({ refs }) {
    return (
        <div style={{ position: "relative", width: "100%", height: 490 }}>

            {/* Instagram – Fitness */}
            <div data-cid="ig1" ref={el => refs.current.ig1 = el} className="post-card">
                <div className="ig-card h-full rounded-[18px]">
                    <div className="ig-topbar">
                        <div className="ig-av-wrap">
                            <div className="ig-av-inner flex items-center justify-center font-[800] text-white" style={{ background: "linear-gradient(135deg,#ff6b6b,#ee5a24)" }}>FC</div>
                        </div>
                        <div className="ig-meta">
                            <div className="ig-username">fitcoach_daily <span style={{ color: "#0095f6" }}>✓</span></div>
                            <div className="ig-location">📍 London, UK</div>
                        </div>
                        <div className="ig-dots">···</div>
                    </div>
                    <img src="/ig_fitness.png" alt="" className="ig-photo" onError={e => { e.currentTarget.style.display = "none"; }} />
                    <div className="ig-actions"><IH /><IC /><IS /><div className="ig-spacer" /><IB /></div>
                    <div className="ig-likes">2,847 likes</div>
                    <div className="ig-caption">
                        <strong>fitcoach_daily</strong> Morning pull-up routine 💪 Idea captured at 5am, posted by 7am. <span className="hashtag">#fitness #workout #morningroutine</span>
                    </div>
                    <div className="ig-time">2 hours ago</div>
                </div>
            </div>

            {/* LinkedIn – Educator */}
            <div data-cid="li" ref={el => refs.current.li = el} className="post-card">
                <div className="li-card h-full rounded-[18px]">
                    <div className="li-topbar">
                        <div className="li-av">SC</div>
                        <div style={{ flex: 1 }}>
                            <div className="li-name">Sarah Chen <span style={{ color: "#0077b5" }}>✓</span></div>
                            <div className="li-title">Educator & Course Creator · 12,432 followers</div>
                            <div className="li-meta">2h · <span className="li-globe">🌐</span></div>
                        </div>
                        <div style={{ color: "#0077b5", fontSize: "0.8rem", fontWeight: 700 }}>+ Follow</div>
                    </div>
                    <div className="li-body">
                        I turned a <strong>single LinkedIn idea</strong> into a course that generated $40k.<br /><br />
                        The thread took 20 mins to write.<br />The course took 3 weeks to build.<br />The idea took 2 seconds to capture.<br /><br />
                        <strong>That's the part most creators miss.</strong>
                    </div>
                    <div className="li-reactions">
                        <div className="li-reaction-icons">
                            {[{ bg: "like", icon: "👍" }, { bg: "celebrate", icon: "🎉" }, { bg: "insightful", icon: "💡" }].map((r, i) => (
                                <div key={i} className={`li-ri ${r.bg}`}>{r.icon}</div>
                            ))}
                        </div>
                        <span className="li-reaction-count">847 · <span style={{ color: "#0077b5" }}>234 comments</span></span>
                    </div>
                    <div className="li-actions-bar">
                        {["👍 Like", "💬 Comment", "↗️ Repost", "✉️ Send"].map(a => (
                            <div key={a} className="li-action-btn">{a}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TikTok – Food */}
            <div data-cid="tk" ref={el => refs.current.tk = el} className="post-card">
                <div className="tk-card h-full">
                    <div className="tk-video-bg">
                        <img src="/tiktok_food.png" alt="" onError={e => { e.currentTarget.style.display = "none"; }} />
                    </div>
                    <div className="tk-gradient" />
                    <div className="tk-right-panel">
                        <div>
                            <div className="tk-av-follow">FS</div>
                            <div className="tk-plus">+</div>
                        </div>
                        {[["❤️", "48.2K"], ["💬", "1.2K"], ["🔖", "8.9K"], ["↗️", "Share"]].map(([icon, count]) => (
                            <div key={icon} className="tk-action">
                                <span className="tk-action-icon">{icon}</span>
                                <span className="tk-action-count">{count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="tk-bottom">
                        <div className="tk-user">@foodwithsophie 🍳</div>
                        <div className="tk-caption-text">The 10-min pasta that broke my FYP 👀 <span>#cooking #foodtok #easyrecipes</span></div>
                    </div>
                    <div className="tk-sound-bar">
                        <div className="tk-disc">🎵</div>
                    </div>
                </div>
            </div>

            {/* Twitter/X – Business founder */}
            <div data-cid="tw" ref={el => refs.current.tw = el} className="post-card">
                <div className="tw-card h-full rounded-[18px]">
                    <div className="tw-topbar">
                        <div className="tw-av">MR</div>
                        <div style={{ flex: 1 }}>
                            <div className="tw-name-row"><span className="tw-name">Marcus Reid</span><span className="tw-verified">✓</span></div>
                            <span className="tw-handle">@marcusreid · 2h</span>
                        </div>
                        <div className="tw-dot">···</div>
                    </div>
                    <div className="tw-body">
                        {`We went from 0 → 10k followers in `}<span className="blue">90 days</span>.{`\n\nNo ads. No viral moment. Just a consistent content pipeline.\n\nHere's the exact system we used 🧵\n\n`}<span className="tag">#BuildInPublic</span>
                    </div>
                    <div className="tw-actions">
                        {[["💬", "241"], ["🔁", "892"], ["❤️", "3.2K"], ["📊", "41K"], ["↗️", ""]].map(([icon, count]) => (
                            <div key={icon} className="tw-act">
                                {icon}{count && <span style={{ color: "#e7e9ea" }}>{count}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Instagram – Travel */}
            <div data-cid="ig2" ref={el => refs.current.ig2 = el} className="post-card">
                <div className="ig-card h-full rounded-[18px]">
                    <div className="ig-topbar">
                        <div className="ig-av-wrap" style={{ background: "linear-gradient(45deg,#4facfe,#00f2fe)" }}>
                            <div className="ig-av-inner flex items-center justify-center font-[800] text-white" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>TA</div>
                        </div>
                        <div className="ig-meta">
                            <div className="ig-username">travelwith_alex <span style={{ color: "#0095f6" }}>✓</span></div>
                            <div className="ig-location">📍 Santorini, Greece</div>
                        </div>
                        <div className="ig-dots">···</div>
                    </div>
                    <img src="/ig_travel.png" alt="" className="ig-photo" onError={e => { e.currentTarget.style.display = "none"; }} />
                    <div className="ig-actions"><IH /><IC /><IS /><div className="ig-spacer" /><IB /></div>
                    <div className="ig-likes">11,204 likes</div>
                    <div className="ig-caption">
                        <strong>travelwith_alex</strong> That 4am idea in Santorini? Captured instantly. Posted 3 days later. 47k reach. 🌅 <span className="hashtag">#travel #santorini #contentcreator</span>
                    </div>
                    <div className="ig-time">4 hours ago</div>
                </div>
            </div>

        </div>
    );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function StatementWall() {
    const wrapperRef = useRef(null);
    const rafRef = useRef(null);
    const lineRefs = useRef([]);
    const cardRefs = useRef({});
    const prevChapter = useRef(-99);

    useEffect(() => {
        // applyChapter: only updates colours + card visibility, never touches position
        function applyChapter(chapter) {
            if (chapter === prevChapter.current) return;
            prevChapter.current = chapter;

            // Update line colours (last line is always dark — skip it)
            lineRefs.current.forEach((el, i) => {
                if (!el || i === LINES.length - 1) return;
                const active = i === chapter;
                el.style.color = active ? "#111111" : "#b8b8c8";
                el.style.fontWeight = active ? "600" : "400";
            });

            // Swap card
            const targetId = LINES[chapter]?.card || "";
            Object.entries(cardRefs.current).forEach(([cid, el]) => {
                if (!el) return;
                const on = cid === targetId;
                if (on) {
                    el.classList.add("active");
                } else {
                    el.classList.remove("active");
                }
            });
        }

        // rAF: only reads scroll progress → drives chapter.
        // Position is handled 100% by CSS position:sticky — zero JS lag.
        function tick() {
            const wrapper = wrapperRef.current;
            if (wrapper) {
                const rt = wrapper.getBoundingClientRect().top;
                const viewH = window.innerHeight;
                const scrollRoom = wrapper.offsetHeight - viewH; // CHAPTERS × viewH

                if (rt <= 0 && rt >= -scrollRoom) {
                    // Pinned phase: sticky child is locked at top:0
                    const progress = Math.min(1, Math.max(0, -rt / scrollRoom));
                    applyChapter(Math.min(Math.floor(progress * CHAPTERS), CHAPTERS - 1));
                } else if (rt > 0) {
                    // Entry phase: approaching from above, show first chapter
                    applyChapter(0);
                } else {
                    // Exit phase: lock on travel vlogger — stays highlighted, photo stays
                    applyChapter(CHAPTERS - 1);
                }
            }
            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        // Tall sentinel. White background so no cream bleeds through during entry.
        <div ref={wrapperRef} style={{ height: `${SENTINEL_VH * 100}vh`, background: "#ffffff", position: "relative", zIndex: 2, isolation: "isolate" }}>

            {/* FORCE WHITE BACKGROUND HERE TO OVERRIDE DARK CSS */}
            <div className="statement-wall" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", backgroundColor: "#ffffff" }}>
                <div className="wall-layout">
                    {/* LEFT: all lines always rendered */}
                    <div className="wall-left">
                        {LINES.map((line, i) => (
                            <div
                                key={i}
                                ref={el => { lineRefs.current[i] = el; }}
                                style={{
                                    // SHRUNK TITLE FONT SO IT DOESN'T GET CUT OFF (from 3.8rem to 2.8rem)
                                    fontSize: i === LINES.length - 1 ? "2.8rem" : "clamp(1.05rem,1.4vw,1.20rem)",
                                    fontWeight: i === LINES.length - 1 ? 800 : 400,
                                    color: i === LINES.length - 1 ? "#111111" : "#b8b8c8",
                                    letterSpacing: i === LINES.length - 1 ? "-1.5px" : "normal",
                                    lineHeight: i === LINES.length - 1 ? 1.05 : 1.6,
                                    // REDUCED PADDING SO EVERY LINE FITS PRECISELY ON SCREEN
                                    padding: i === LINES.length - 1 ? "14px 0 0 24px" : "8px 0",
                                    marginTop: i === LINES.length - 1 ? 12 : 0,
                                    borderLeft: i === LINES.length - 1 ? "4px solid #E8334A" : "none",
                                    borderBottom: i < LINES.length - 1 ? "1px solid #ebebf2" : "none",
                                    transition: "color 0.3s ease, font-weight 0.25s ease",
                                    cursor: "default",
                                }}
                            >
                                {i === LINES.length - 1 ? (
                                    <>
                                        <span style={{ display: "block", paddingBottom: "4px" }}>{line.text[0]}</span>
                                        <span style={{ display: "block", color: "#E8334A" }}>{line.text[1]}</span>
                                    </>
                                ) : line.text.map((part, j) =>
                                    j === 1
                                        ? <strong key={j} style={{ color: "#E8334A", fontWeight: 700 }}>{part}</strong>
                                        : <span key={j}>{part}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: social post cards */}
                    <div className="wall-right">
                        <SocialCards refs={cardRefs} />
                    </div>
                </div>
            </div>
        </div>
    );
}
