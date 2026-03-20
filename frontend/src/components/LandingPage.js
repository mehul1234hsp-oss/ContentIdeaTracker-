import { useEffect, useRef } from "react";
import ParticleSection from "./ParticleSection";
import StatementWall from "./StatementWall";

const PLATFORMS = [
  { emoji: "🔵", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", name: "LinkedIn", label: "Career tips", color: "#2563eb" },
  { emoji: "🐦", logo: "https://cdn.simpleicons.org/x/000000", name: "Twitter", label: "Thread ideas", color: "#374151" },
  { emoji: "📸", logo: "https://cdn.simpleicons.org/instagram/E4405F", name: "Instagram", label: "Reel concepts", color: "#db2777" },
  { emoji: "👍", logo: "https://cdn.simpleicons.org/facebook/1877F2", name: "Facebook", label: "Community post", color: "#1877f2" },
  { emoji: "🎵", logo: "https://cdn.simpleicons.org/tiktok/000000", name: "TikTok", label: "Trending audio", color: "#16a34a" },
  { emoji: "▶️", logo: "https://cdn.simpleicons.org/youtube/FF0000", name: "YouTube", label: "Tutorial video", color: "#dc2626" },
  { emoji: "💬", logo: "https://cdn.simpleicons.org/whatsapp/25D366", name: "WhatsApp", label: "Status update", color: "#15803d" },
];

export default function LandingPage({ onGetStarted, onSignIn }) {
  const orbitRef = useRef(null);
  const animFrameRef = useRef(null);
  const fadeRefs = useRef([]);

  // DECREASED RADIUS FURTHER TO 240
  const RADIUS = 240;
  const TOTAL = PLATFORMS.length;
  const DURATION = 24000;

  // Handles the rotating orbit animation for the new Hero section
  useEffect(() => {
    const cards = orbitRef.current?.querySelectorAll(".lp-orbit-card");
    if (!cards || cards.length === 0) return;

    const animate = () => {
      const elapsed = performance.now();
      const angleDeg = (elapsed / DURATION) * 360;

      cards.forEach((card, i) => {
        const cardAngleDeg = i * (360 / TOTAL) + angleDeg;
        const cardAngleRad = ((cardAngleDeg - 90) * Math.PI) / 180;

        const x = RADIUS * Math.cos(cardAngleRad);
        const y = RADIUS * Math.sin(cardAngleRad);

        // Keep icons upright while rotating. Adjusted translation for smaller 120px cards
        card.style.transform = `translate(${x - 60}px, ${y - 60}px)`;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Handles fade-in elements further down the page
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("lp-visible");
      }),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const addFadeRef = (el) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  return (
    // FIX: Removed overflowX: "hidden" right here so that the child Statement Wall can use position: "sticky"
    <div style={{ fontFamily: "Inter, sans-serif", background: "#ffffff" }}>

      <style>{`
        .lp-fade { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .lp-visible { opacity: 1 !important; transform: translateY(0) !important; }

        .lp-btn-primary {
          padding: 14px 32px; border-radius: 999px; border: none;
          background: #e8334a; color: white;
          font-family: "Nunito", sans-serif; font-weight: 800; font-size: 0.95rem;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(232,51,74,0.2);
        }
        .lp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(232,51,74,0.3); }

        .lp-orbit-card {
          position: absolute; 
          width: 120px;          /* SHRUNK BY Roughly 15% */
          height: 120px;         /* SHRUNK BY Roughly 15% */
          background: #ffffff; 
          border-radius: 35px;   /* Adjusted radius for smaller size */
          display: flex; 
          justify-content: center;
          align-items: center; 
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
          cursor: pointer; 
          transition: box-shadow 0.3s ease;
          will-change: transform;
        }

        .lp-orbit-card:hover { 
          box-shadow: 0 20px 45px rgba(0,0,0,0.12); 
        }

        .lp-cta-btn {
          padding: 15px 44px; border-radius: 999px; border: none;
          background: white; color: #e8334a;
          font-family: "Nunito", sans-serif; font-weight: 900; font-size: 1rem;
          cursor: pointer; transition: all 0.2s; position: relative; z-index: 1;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14);
        }
        .lp-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }
      `}</style>

      {/* MINIMAL NAVBAR (fourmula.ai style) */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 100,
        height: "100px", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 60px",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#E8334A,#ff6b35)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(232,51,74,0.35)" }}>
            <span style={{ color: "#fff", fontSize: 16, lineHeight: 1 }}>✦</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button style={{ background: "transparent", border: "1px solid #ddd", borderRadius: "999px", padding: "10px 24px", fontWeight: 700, cursor: "pointer", color: "#666" }} onClick={onSignIn}>Sign In</button>
          <button className="lp-btn-primary" onClick={onGetStarted}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO SECTION (White Background, Centered Icons, Bottom Left Text) */}
      <section style={{
        height: "100vh", width: "100%", display: "flex",
        flexDirection: "column", position: "relative",
        overflow: "hidden", background: "#ffffff",
      }}>

        {/* CENTERED ROTATING ICONS OVER EMPTY MIDDLE */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div ref={orbitRef} style={{ position: "relative", width: "1px", height: "1px" }}>
            {PLATFORMS.map((p) => (
              <div key={p.name} className="lp-orbit-card">
                {/* LOGO SIZE SET TO 55px */}
                <img src={p.logo} alt={p.name} style={{ width: "55px", height: "55px", objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </div>

        {/* EXACT LOCATION TEXT (Bottom Left) */}
        <div style={{
          position: "absolute", bottom: "100px", left: "60px",
          zIndex: 10, maxWidth: "800px"
        }}>
          {/* FONT SIZE DECREASED FURTHER TO 4.2rem */}
          <h1 style={{
            fontFamily: "Nunito, sans-serif", fontSize: "4.2rem",
            fontWeight: 900, color: "#111", lineHeight: 0.9, letterSpacing: "-3px"
          }}>
            From<br />
            <span style={{ color: "#e8334a" }}>chaos</span>,<br />
            to Clarity.
          </h1>
        </div>


      </section>

      {/* 
        -------------------------------------------------------------
        YOUR EXISTING ANIMATIONS ARE PLACED RIGHT AFTER THE FIRST UI 
        -------------------------------------------------------------
      */}
      <ParticleSection />
      <StatementWall />

      {/* COMBINED — HOW IT WORKS + CTA */}
      <section style={{ background: "#ffffff", padding: "40px 80px 0", position: "relative", zIndex: 2 }}>


        {/* Label + Heading */}
        <p ref={addFadeRef} className="lp-fade" style={{ textAlign: "center", fontSize: "0.78rem", fontWeight: 700, color: "#E8334A", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "14px" }}>
          How It Works
        </p>
        <h2 ref={addFadeRef} className="lp-fade" style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.8rem", fontWeight: 900, color: "#111", textAlign: "center", letterSpacing: "-1.5px", marginBottom: "24px", lineHeight: 1.15 }}>
          From idea to published —<br />
          <span style={{ color: "#E8334A" }}>in 3 steps.</span>
        </h2>

        {/* Hover animation style */}
        <style>{`
          .step-card { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: default; }
          .step-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 28px 60px rgba(0,0,0,0.13) !important; }
          .step-card-dark:hover { box-shadow: 0 28px 60px rgba(232,51,74,0.28) !important; }
        `}</style>

        {/* Bento Cards */}
        <div ref={addFadeRef} className="lp-fade" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", alignItems: "stretch", maxWidth: "1100px", margin: "0 auto" }}>

          {/* Card 1 — white */}
          <div className="step-card" style={{ background: "#fff", border: "1.5px solid #efefef", borderRadius: 20, padding: "24px 28px", boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E8334A", color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>1</div>
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "#111", marginBottom: 10, letterSpacing: "-0.5px" }}>Add Your Idea</h3>
            <p style={{ fontSize: "0.88rem", color: "#777", lineHeight: 1.7, margin: 0 }}>Click New Idea, write your content concept and pick your platform. Done in seconds.</p>
            <div style={{ marginTop: 24, height: 3, width: 40, background: "#E8334A", borderRadius: 2 }} />
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px", color: "#E8334A", fontSize: "1.6rem", fontWeight: 900 }}>→</div>

          {/* Card 2 — BLACK (highlighted) */}
          <div className="step-card step-card-dark" style={{ background: "#111", border: "1.5px solid #111", borderRadius: 20, padding: "24px 28px", boxShadow: "0 16px 48px rgba(0,0,0,0.22)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #E8334A", color: "#E8334A", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>2</div>
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "#fff", marginBottom: 10, letterSpacing: "-0.5px" }}>Move to Draft</h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>When you're ready to work on it, move it to Draft. Your board stays clean and organized.</p>
            <div style={{ marginTop: 24, height: 3, width: 40, background: "#E8334A", borderRadius: 2 }} />
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px", color: "#E8334A", fontSize: "1.6rem", fontWeight: 900 }}>→</div>

          {/* Card 3 — white */}
          <div className="step-card" style={{ background: "#fff", border: "1.5px solid #efefef", borderRadius: 20, padding: "24px 28px", boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E8334A", color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>3</div>
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "#111", marginBottom: 10, letterSpacing: "-0.5px" }}>Mark as Published</h3>
            <p style={{ fontSize: "0.88rem", color: "#777", lineHeight: 1.7, margin: 0 }}>Once your content is live, mark it published. Track your consistency over time.</p>
            <div style={{ marginTop: 24, height: 3, width: 40, background: "#E8334A", borderRadius: 2 }} />
          </div>
        </div>

        {/* Black CTA strip — flush at the bottom of the section */}
        <div style={{ background: "#111", marginTop: 40, padding: "24px 80px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2rem", fontWeight: 900, color: "#fff", letterSpacing: "-1px", marginBottom: 6 }}>Ready to organize your content?</h2>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>Join creators who never lose a content idea again.</p>
          </div>
          <button className="lp-cta-btn" onClick={onGetStarted} style={{ whiteSpace: "nowrap" }}>Get Started Free →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a0a", padding: "16px 80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>Plan. Draft. Publish. Repeat.</div>
      </footer>

    </div>
  );
}
