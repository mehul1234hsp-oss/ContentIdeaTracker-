import { useEffect, useRef } from "react";
import "./ParticleSection.css";

// ─────────────────────────────────────────
//  Maths
// ─────────────────────────────────────────
const cl = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smt = t => { const c = cl(t); return c * c * c * (c * (c * 6 - 15) + 10); };
const inv = (s, e, v) => smt(cl((v - s) / (e - s)));

const N = 3600;
const RINGS = [30, 65, 108, 158, 214];

const PHASES = [
    { num: "01 / Capture", title0: "Every spark,", title1: "before it fades.", body: "Ideas are everywhere and nowhere at once. The moment inspiration strikes — for LinkedIn, Instagram, TikTok — capture it instantly. No friction. No forgetting.", line: "Raw ideas, instantly saved" },
    { num: "02 / Draft", title0: "Ideas taking", title1: "shape.", body: "Move your sparks through your pipeline. Idea → Draft → Ready to publish. See every piece of content exactly where it stands — focused, in motion.", line: "Scattered sparks → organised pipeline" },
    { num: "03 / Published", title0: "Ship like", title1: "clockwork.", body: "Mark it done and watch it go live. Build the habit that compounds — more content published, more growth, relentlessly.", line: "Your pipeline → content in the world" },
];

function makePt(i) {
    const isRed = Math.random() < 0.08;
    const phi0 = Math.random() * Math.PI * 2, cosT = 2 * Math.random() - 1;
    const r0 = 200 * Math.cbrt(Math.random());
    const gx = r0 * Math.sqrt(1 - cosT * cosT) * Math.cos(phi0), gy = r0 * cosT;
    const r1 = 70 + Math.random() * 300, a1 = Math.random() * Math.PI * 2;
    const s1x = Math.cos(a1) * r1, s1y = Math.sin(a1) * r1;
    const clust = i % 3, r2 = Math.random() * 55, a2 = Math.random() * Math.PI * 2;
    const s2x = Math.cos(a2) * r2, s2y = Math.sin(a2) * r2;
    const ring = i % RINGS.length;
    const ra = (i / (N / RINGS.length)) * Math.PI * 2 + Math.random() * 0.4;
    return {
        isRed, clust, ring, ra, gx, gy, s1x, s1y, s2x, s2y,
        sz: 0.28 + Math.random() * 0.80,
        alf: isRed ? 0.45 + Math.random() * 0.55 : 0.60 + Math.random() * 0.40,
        ph: Math.random() * Math.PI * 2, spd: 0.004 + Math.random() * 0.008,
        x: Math.random() * 1800 - 400, y: Math.random() * 400 + 800,
    };
}

const headlineStyle = {
    fontFamily: "Inter,sans-serif",
    fontSize: "clamp(3.5rem,8vw,7rem)",
    fontWeight: 900,
    letterSpacing: "-5px",
    color: "#fff",
    lineHeight: 0.92,
    textAlign: "center",
    whiteSpace: "nowrap",
};

export default function ParticleSection() {
    const wrapperRef = useRef(null);  // 420vh scroll sentinel
    const fixedRef = useRef(null);  // position:fixed full-screen panel
    const canvasRef = useRef(null);
    const introRef = useRef(null);  // text inside fixed panel
    const sentinelTxtRef = useRef(null); // text inside sentinel (visible during approach)
    const cardRefs = useRef([null, null, null]);
    const dotRefs = useRef([null, null, null]);


    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");

        let W = 0, H = 0, cx = 0, cy = 0, pts = [], prog = 0, raf = null, wasActive = false;
        const mouse = { x: -9999, y: -9999 };

        function init() {
            W = cvs.width = cvs.offsetWidth;
            H = cvs.height = cvs.offsetHeight;
            cx = W / 2; cy = H / 2;
            pts = Array.from({ length: N }, (_, i) => makePt(i));
        }

        function weights(p) {
            let w0, w1, w2, w3;
            if (p < 0.13) { w0 = 1; w1 = 0; w2 = 0; w3 = 0; }
            else if (p < 0.28) { const t = smt((p - 0.13) / 0.15); w0 = 1 - t; w1 = t; w2 = 0; w3 = 0; }
            else if (p < 0.42) { w0 = 0; w1 = 1; w2 = 0; w3 = 0; }
            else if (p < 0.57) { const t = smt((p - 0.42) / 0.15); w0 = 0; w1 = 1 - t; w2 = t; w3 = 0; }
            else if (p < 0.68) { w0 = 0; w1 = 0; w2 = 1; w3 = 0; }
            else if (p < 0.83) { const t = smt((p - 0.68) / 0.15); w0 = 0; w1 = 0; w2 = 1 - t; w3 = t; }
            else { w0 = 0; w1 = 0; w2 = 0; w3 = 1; }
            return { w0, w1, w2, w3 };
        }

        function updateUI(p) {
            // Intro headline fade (inside fixed panel only)
            if (introRef.current) {
                const ia = 1 - inv(0.04, 0.16, p);
                introRef.current.style.opacity = ia;
                introRef.current.style.marginTop = `${(1 - ia) * -26}px`;
            }
            // Phase cards
            [{ s: 0.14, e: 0.42 }, { s: 0.42, e: 0.68 }, { s: 0.68, e: 1.00 }].forEach(({ s: ps, e: pe }, i) => {
                const el = cardRefs.current[i], dot = dotRefs.current[i];
                const sp = pe - ps, ee = ps + sp * 0.32, xs = pe - sp * 0.26;
                let op, ty;
                if (p <= ps) { op = 0; ty = 50; }
                else if (p <= ee) { const t = smt((p - ps) / (ee - ps)); op = t; ty = 50 * (1 - t); }
                else if (p <= xs) { op = 1; ty = 0; }
                else if (p <= pe) { const t = smt((p - xs) / (pe - xs)); op = 1 - t; ty = -28 * t; }
                else { op = 0; ty = -28; }
                if (el) { el.style.opacity = op; el.style.transform = `translateY(calc(-50% + ${ty}px))`; }
                if (dot) { const on = p >= ps && p < pe; dot.style.background = on ? "#E8334A" : "#1a1a1a"; dot.style.transform = on ? "scale(2.2)" : "scale(1)"; }
            });
        }

        function tick() {
            const wrapper = wrapperRef.current;
            const fixed = fixedRef.current;
            const stxt = sentinelTxtRef.current;

            if (wrapper && fixed) {
                const rect = wrapper.getBoundingClientRect();
                const viewH = window.innerHeight;
                const total = wrapper.offsetHeight - viewH;

                const inThrough = rect.top <= 0 && rect.bottom >= viewH;
                const postSentinel = rect.top <= 0 && rect.bottom < viewH && rect.bottom > -viewH;

                if (stxt) stxt.style.visibility = inThrough ? "hidden" : "visible";

                if (inThrough) {
                    // Phase 1 — fully inside sentinel: full-screen particle animation
                    fixed.style.display = "block";
                    fixed.style.zIndex = "50";
                    if (!wasActive) {
                        wasActive = true;
                        init();
                        if (introRef.current) {
                            introRef.current.style.opacity = 1;
                            introRef.current.style.marginTop = "0px";
                        }
                    }
                    if (total > 0) {
                        const p = cl(-rect.top / total);
                        if (Math.abs(p - prog) > 0.0003) { prog = p; updateUI(p); }
                    }
                } else if (postSentinel) {
                    // Phase 2 — sentinel just exited: keep frozen last frame at z-index 1
                    // StatementWall (z-index 2) scrolls over the top of this naturally.
                    fixed.style.display = "block";
                    fixed.style.zIndex = "1";
                    if (wasActive) wasActive = false;
                } else {
                    // Phase 3 — fully past (or approaching from above)
                    fixed.style.display = "none";
                    fixed.style.zIndex = "50";
                    if (wasActive) wasActive = false;
                }
            }

            if (W === 0) { raf = requestAnimationFrame(tick); return; }

            const { w0, w1, w2, w3 } = weights(prog);
            const tm = smt(cl((prog - 0.10) / 0.22));
            const rCX = cx + W * 0.26;
            const cloudX = lerp(cx, rCX, tm), cloudY = cy, rCY = cy;

            ctx.fillStyle = "rgba(5,5,13,0.42)";
            ctx.fillRect(0, 0, W, H);

            const fogA = w0 * 0.09 + w1 * 0.055 + w2 * 0.065 + w3 * 0.035;
            if (fogA > 0.004) {
                const fog = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, 250);
                fog.addColorStop(0, `rgba(255,255,255,${fogA})`);
                fog.addColorStop(0.5, `rgba(255,255,255,${fogA * 0.25})`);
                fog.addColorStop(1, "rgba(255,255,255,0)");
                ctx.beginPath(); ctx.arc(cloudX, cloudY, 250, 0, Math.PI * 2); ctx.fillStyle = fog; ctx.fill();
            }

            if (w2 > 0.05) {
                const span = Math.min(H * 0.28, 148);
                [rCY - span, rCY, rCY + span].forEach(sy => {
                    ctx.beginPath(); ctx.arc(rCX, sy, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(232,51,74,${0.6 * w2})`; ctx.fill();
                });
            }
            if (w3 > 0.05) {
                RINGS.forEach(r => { ctx.beginPath(); ctx.arc(rCX, rCY, r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(255,255,255,${0.05 * w3})`; ctx.lineWidth = 0.5; ctx.stroke(); });
            }

            const span = Math.min(H * 0.28, 148), clY = [rCY - span, rCY, rCY + span];
            pts.forEach(p => {
                p.ph += p.spd;
                const t0x = cloudX + p.gx, t0y = cloudY + p.gy;
                const t1x = rCX + p.s1x, t1y = rCY + p.s1y;
                const t2x = rCX + p.s2x, t2y = clY[p.clust] + p.s2y;
                const t3x = rCX + Math.cos(p.ra) * RINGS[p.ring], t3y = rCY + Math.sin(p.ra) * RINGS[p.ring];
                const btx = t0x * w0 + t1x * w1 + t2x * w2 + t3x * w3;
                const bty = t0y * w0 + t1y * w1 + t2y * w2 + t3y * w3;
                const da = w0 * 8 + w1 * 13 + w2 * 5 + w3 * 1.5;
                const tx = btx + Math.sin(p.ph + p.gx * 0.006) * da;
                const ty = bty + Math.cos(p.ph * 0.8 + p.gy * 0.006) * da;
                p.x = lerp(p.x, tx, 0.18); p.y = lerp(p.y, ty, 0.18);
                const mdx = p.x - mouse.x, mdy = p.y - mouse.y, md = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
                if (md < 100) { const f = (100 - md) / 100 * 3.5; p.x += mdx / md * f; p.y += mdy / md * f; }
                if (p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) return;
                const tw = 0.55 + Math.sin(p.ph) * 0.45, a = p.alf * tw;
                if (a < 0.01) return;
                const R = p.isRed ? 232 : 255, G = p.isRed ? 51 : 255, B = p.isRed ? 74 : 255;
                const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.sz * 2.2);
                gr.addColorStop(0, `rgba(${R},${G},${B},${a})`);
                gr.addColorStop(0.45, `rgba(${R},${G},${B},${a * 0.55})`);
                gr.addColorStop(1, `rgba(${R},${G},${B},0)`);
                ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 2.2, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
            });

            raf = requestAnimationFrame(tick);
        }

        const onMouseMove = e => { const r = cvs.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
        const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
        const onResize = () => { if (wasActive) init(); };
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseleave", onMouseLeave);
        window.addEventListener("resize", onResize);
        raf = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("resize", onResize);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>

            {/*
        ══════════════════════════════════════════════════════════════════
        SCROLL SENTINEL — 420vh spacer in normal document flow.
        Background provides the black area visually.

        KEY: The "Content Ideas Tracker" headline LIVES HERE as a real
        DOM element. It scrolls at 100% native browser scroll speed,
        perfectly in sync with the black background — no JS lag, no
        glitching. It's positioned so that when sentinel top reaches
        the viewport top (rect.top=0), the heading is exactly at
        viewport center = same position as the fixed panel's heading.
        ══════════════════════════════════════════════════════════════════
      */}
            <div
                ref={wrapperRef}
                style={{ position: "relative", height: "280vh", background: "#05050d" }}
            >
                {/*
          top: 50vh within the sentinel = sentinel.offsetTop + 50vh in page coords.
          When rect.top=0 (fully scrolled in), viewport sees exactly 50vh from
          the sentinel top = dead center of viewport. Identical to fixed panel pos.
        */}
                <div ref={sentinelTxtRef} className="lp-sentinel-text" style={{ position: "absolute", top: "50vh", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 2 }}>
                    <h2>Content Ideas<br />Tracker</h2>
                </div>
            </div>

            {/*
        ══════════════════════════════════════════════════════════════════
        FIXED PANEL — only shown when rect.top ≤ 0 (fully inside sentinel)
        Takes over from sentinel text. Canvas + particles + phase panels.
        ══════════════════════════════════════════════════════════════════
      */}
            <div
                ref={fixedRef}
                style={{
                    display: "none",
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 50, overflow: "hidden", background: "#05050d",
                }}
            >
                <canvas ref={canvasRef}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
                />

                {/* Intro headline inside fixed panel — visible at prog=0, fades by prog=0.16 */}
                <div ref={introRef} className="lp-intro-panel" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 15 }}>
                    <h2>Content Ideas<br />Tracker</h2>
                </div>

                {/* Phase panels */}
                <div className="lp-pcard-wrapper">
                    {PHASES.map((ph, i) => (
                        <div key={i} ref={el => { cardRefs.current[i] = el; }} className="lp-pcard">
                            <p className="lp-pnum">{ph.num}</p>
                            <h3 className="lp-ptitle">
                                {ph.title0}<br />{ph.title1}
                            </h3>
                            <p className="lp-pbody">{ph.body}</p>
                            <div className="lp-pline">
                                <div className="lp-pline-bar" />
                                <span className="lp-pline-text">{ph.line}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress dots */}
                <div className="lp-spine">
                    {[0, 1, 2].map(i => (
                        <div key={i} ref={el => { dotRefs.current[i] = el; }} className="lp-sdot" />
                    ))}
                </div>
            </div>
        </>
    );
}
