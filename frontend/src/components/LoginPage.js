import { useState } from "react";
import { login } from "../services/cognito";
import ScrollingBackground from "./ScrollingBackground";

/* ── INSTAGRAM POST ────────────────────────────────────── */
function InstagramCard({ photo, username, avatar, caption, likes, comments, timeAgo }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.22)", flexShrink: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#000", fontFamily: "system-ui" }}>{username}</div>
          <div style={{ fontSize: ".62rem", color: "#8e8e8e", fontFamily: "system-ui" }}>{timeAgo}</div>
        </div>
        <div style={{ fontSize: 16, color: "#262626" }}>···</div>
      </div>
      {/* Photo */}
      <img src={photo} alt="post" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} loading="lazy" />
      {/* Actions */}
      <div style={{ padding: "8px 12px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>🤍</span>
          <span style={{ fontSize: 20 }}>💬</span>
          <span style={{ fontSize: 20 }}>↗</span>
          <span style={{ marginLeft: "auto", fontSize: 20 }}>🔖</span>
        </div>
        <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#000", fontFamily: "system-ui", marginBottom: 3 }}>{likes} likes</div>
        <div style={{ fontSize: ".72rem", color: "#000", fontFamily: "system-ui", marginBottom: 4 }}>
          <span style={{ fontWeight: 700 }}>{username} </span>{caption}
        </div>
        <div style={{ fontSize: ".65rem", color: "#737373", fontFamily: "system-ui", marginBottom: 6 }}>View all {comments} comments</div>
      </div>
    </div>
  );
}

/* ── YOUTUBE CARD ──────────────────────────────────────── */
function YouTubeCard({ thumb, title, channel, views, duration, avatar, timeAgo }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.22)", flexShrink: 0 }}>
      {/* Thumbnail */}
      <div style={{ position: "relative" }}>
        <img src={thumb} alt="thumb" style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }} loading="lazy" />
        <div style={{ position: "absolute", bottom: 6, right: 8, background: "rgba(0,0,0,0.82)", color: "#fff", fontSize: ".62rem", fontWeight: 700, borderRadius: 4, padding: "2px 5px", fontFamily: "system-ui" }}>{duration}</div>
      </div>
      {/* Info */}
      <div style={{ display: "flex", gap: 10, padding: "10px 12px 12px" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#ff0000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 700, fontFamily: "system-ui", flexShrink: 0 }}>{avatar}</div>
        <div>
          <div style={{ fontSize: ".73rem", fontWeight: 700, color: "#0f0f0f", lineHeight: 1.35, fontFamily: "system-ui", marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: ".65rem", color: "#606060", fontFamily: "system-ui" }}>{channel} · {views} views · {timeAgo}</div>
        </div>
      </div>
    </div>
  );
}

/* ── LINKEDIN CARD ─────────────────────────────────────── */
function LinkedInCard({ photo, name, headline, content, reactions, timeAgo, avatar }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", marginBottom: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.22)", flexShrink: 0, border: "1px solid #e0e0e0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", padding: "12px 14px 10px", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 8, background: "#0a66c2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700, fontFamily: "system-ui", flexShrink: 0 }}>{avatar}</div>
        <div>
          <div style={{ fontSize: ".75rem", fontWeight: 700, color: "rgba(0,0,0,0.9)", fontFamily: "system-ui" }}>{name}</div>
          <div style={{ fontSize: ".63rem", color: "rgba(0,0,0,0.6)", fontFamily: "system-ui", lineHeight: 1.3 }}>{headline}</div>
          <div style={{ fontSize: ".6rem", color: "rgba(0,0,0,0.45)", fontFamily: "system-ui", marginTop: 1 }}>{timeAgo} · 🌐</div>
        </div>
      </div>
      {/* Content text */}
      <div style={{ padding: "0 14px 10px", fontSize: ".72rem", color: "rgba(0,0,0,0.85)", fontFamily: "system-ui", lineHeight: 1.5 }}>{content}</div>
      {/* Optional photo */}
      {photo && <img src={photo} alt="post" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} loading="lazy" />}
      {/* Reactions */}
      <div style={{ padding: "8px 14px", borderTop: "1px solid #e0e0e0" }}>
        <div style={{ fontSize: ".62rem", color: "rgba(0,0,0,0.6)", fontFamily: "system-ui", marginBottom: 6 }}>👍 ❤️ 💡 {reactions}</div>
        <div style={{ display: "flex", gap: 4 }}>
          {["👍 Like", "💬 Comment", "↗ Share"].map(a => (
            <div key={a} style={{ flex: 1, textAlign: "center", fontSize: ".62rem", fontWeight: 600, color: "rgba(0,0,0,0.6)", padding: "4px 0", borderRadius: 4, fontFamily: "system-ui" }}>{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TWITTER/X CARD ────────────────────────────────────── */
function TwitterCard({ photo, name, handle, content, likes, retweets, replies, timeAgo, avatar }) {
  return (
    <div style={{ background: "#000", borderRadius: 14, overflow: "hidden", marginBottom: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.22)", flexShrink: 0, border: "1px solid #2f3336" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", padding: "12px 14px 8px", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#1d9bf0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700, fontFamily: "system-ui", flexShrink: 0 }}>{avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#fff", fontFamily: "system-ui" }}>{name}</span>
            <span style={{ fontSize: ".62rem", color: "#1d9bf0" }}>✓</span>
          </div>
          <div style={{ fontSize: ".65rem", color: "#71767b", fontFamily: "system-ui" }}>{handle} · {timeAgo}</div>
        </div>
        <div style={{ color: "#71767b", fontSize: 14, fontWeight: 700 }}>𝕏</div>
      </div>
      {/* Tweet */}
      <div style={{ padding: "0 14px 10px", fontSize: ".75rem", color: "#e7e9ea", fontFamily: "system-ui", lineHeight: 1.5 }}>{content}</div>
      {/* Photo */}
      {photo && <img src={photo} alt="tweet" style={{ width: "100%", height: 160, objectFit: "cover", display: "block", borderRadius: "0 0 12px 12px" }} loading="lazy" />}
      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 14px", borderTop: "1px solid #2f3336" }}>
        {[["💬", replies], ["🔁", retweets], ["❤️", likes], ["📤", ""]].map(([icon, count]) => (
          <div key={icon} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".62rem", color: "#71767b", fontFamily: "system-ui" }}>{icon} {count}</div>
        ))}
      </div>
    </div>
  );
}

/* ── All cards data ────────────────────────────────────── */
const CARDS = [
  <InstagramCard key="ig1" photo="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&fit=crop" username="fitnessbyara" avatar="A" caption="Day 30 challenge complete ✅ No excuses, just results 💪🔥 #fitness #transformation" likes="12,847" comments="342" timeAgo="2h" />,
  <YouTubeCard key="yt1" thumb="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&fit=crop&h=220" title="M3 MacBook Pro vs M4 — Which One Should You Buy in 2024?" channel="TechWithMike" views="1.2M" duration="14:32" avatar="M" timeAgo="3 days ago" />,
  <LinkedInCard key="li1" photo="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&fit=crop&h=180" name="Priya Sharma" headline="Product Marketing @ Google · Ex-Swiggy" content="Just hit 50K followers on LinkedIn 🎉 Here are the 5 strategies that worked..." reactions="2,340 reactions" timeAgo="4h" avatar="PS" />,
  <TwitterCard key="tw1" photo={null} name="Nikhil Builds" handle="@nikhil_builds" content="Hot take: Your personal brand is the best investment you'll ever make. No cap. 🔥" likes="8.4K" retweets="2.1K" replies="394" timeAgo="1h" avatar="N" />,
  <InstagramCard key="ig2" photo="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop" username="healthyfoodlover" avatar="H" caption="Açaí bowl = the only breakfast that matters 🍇 Full recipe saved to highlights!" likes="6,231" comments="189" timeAgo="5h" />,
  <YouTubeCard key="yt2" thumb="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&fit=crop&h=220" title="I Built a Full AI SaaS in 24 Hours — Here's Everything I Used" channel="DevWithKaran" views="890K" duration="22:14" avatar="K" timeAgo="1 week ago" />,
  <InstagramCard key="ig3" photo="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&fit=crop" username="wanderlust.riya" avatar="R" caption="Santorini sunsets hit completely different 🌅✨ Swipe for more →" likes="24,190" comments="831" timeAgo="1d" />,
  <LinkedInCard key="li2" photo={null} name="Arjun Mehta" headline="Founder @ BuildFast · YC W24" content="We just closed our $2M seed round 🎉 Here's the exact pitch deck slide that got investors excited (thread)..." reactions="5,124 reactions" timeAgo="6h" avatar="AM" />,
  <TwitterCard key="tw2" photo="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&fit=crop&h=160" name="Divya Nair" handle="@divya_grows" content="Your audience doesn't want perfection. They want authenticity. A reminder for all creators today 💛" likes="14.2K" retweets="6.8K" replies="1.1K" timeAgo="3h" avatar="D" />,
  <InstagramCard key="ig4" photo="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&fit=crop" username="stylebyneha" avatar="N" caption="GRWM for a coffee date ☕✨ Outfit details all tagged! #ootd #fashion #style" likes="18,443" comments="562" timeAgo="8h" />,
  <YouTubeCard key="yt3" thumb="https://images.unsplash.com/photo-1546213290-e1b492ab3eee?w=400&fit=crop&h=220" title="30 Day Korean Skincare Challenge — Honest Before & After Results 🌿" channel="GlowWithTanya" views="2.4M" duration="18:07" avatar="T" timeAgo="2 weeks ago" />,
  <LinkedInCard key="li3" photo="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&fit=crop&h=160" name="Rohan Kapoor" headline="Growth Lead @ Razorpay" content="The creator economy is now a $250 billion industry. And most brands still don't have a content strategy. That's the opportunity." reactions="3,892 reactions" timeAgo="12h" avatar="RK" />,
  <InstagramCard key="ig5" photo="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&fit=crop" username="yogasoul.ritika" avatar="R" caption="Morning flow before the chaos begins 🧘‍♀️ Your mat is your sanctuary. #yoga #wellness" likes="9,072" comments="214" timeAgo="7h" />,
  <TwitterCard key="tw3" photo="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&fit=crop&h=160" name="Ananya Travels" handle="@backpack.ananya" content="Just did Himachal Pradesh for ₹8,000. Total. 10 days. Here's how 🧵👇" likes="31.6K" retweets="12.4K" replies="2.8K" timeAgo="2d" avatar="AT" />,
];

// Duplicate for infinite scroll
const DOUBLED = [...CARDS, ...CARDS.map((c, i) => ({ ...c, key: `${c.key}_2` }))];

// Split into 4 columns
const col = [0, 1, 2, 3].map(ci => DOUBLED.filter((_, i) => i % 4 === ci));

function ScrollColumn({ cards, direction, duration }) {
  return (
    <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
      <div style={{
        display: "flex", flexDirection: "column",
        animation: `${direction === "up" ? "scrollUp" : "scrollDown"} ${duration}s linear infinite`,
        willChange: "transform",
      }}>
        {cards}
      </div>
    </div>
  );
}

export default function LoginPage({ onLogin, onGoToSignUp, onGoToLanding }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await login(email, password); onLogin(); }
    catch (err) { setError(err.message || "Login failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ height: "100vh", width: "100%", overflow: "hidden", position: "relative", fontFamily: "Nunito, sans-serif" }}>
      <style>{`
        @keyframes scrollUp   { from { transform: translateY(0);    } to { transform: translateY(-50%); } }
        @keyframes scrollDown { from { transform: translateY(-50%); } to { transform: translateY(0);    } }
      `}</style>

      {/* LAYER 1 — Scrolling real social media post cards */}
      <div style={{ position: "absolute", inset: 0, display: "flex", gap: 10, padding: 10, overflow: "hidden", background: "#060610" }}>
        <ScrollColumn cards={col[0]} direction="up" duration={32} />
        <ScrollColumn cards={col[1]} direction="down" duration={26} />
        <ScrollColumn cards={col[2]} direction="up" duration={38} />
        <ScrollColumn cards={col[3]} direction="down" duration={30} />
      </div>

      {/* LAYER 2 — Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,6,20,0.6)", backdropFilter: "blur(1px)" }} />

      {/* Floating Back to Home button — top left */}
      <button
        type="button"
        onClick={onGoToLanding}
        style={{
          position: "absolute", top: 18, left: 20, zIndex: 20,
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: 8, padding: "7px 16px",
          fontSize: ".85rem", fontWeight: 700, color: "#fff",
          cursor: "pointer", fontFamily: "Nunito, sans-serif",
          backdropFilter: "blur(8px)",
          transition: "background 0.15s",
        }}
      >
        ← Back to Home
      </button>

      {/* LAYER 3 — Sign-in form (no navbar) */}
      <div style={{ position: "relative", zIndex: 10, height: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 24, padding: "44px 50px", width: "100%", maxWidth: 440, boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1a1a2e", marginBottom: 28, fontFamily: "Nunito, sans-serif", letterSpacing: "-0.5px", textAlign: "center" }}>
              Sign <span style={{ color: "#E8334A" }}>In</span>
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 7 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid #ede8e3", fontSize: ".95rem", color: "#1a1a2e", outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", background: "#fdf6f0" }} />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 7 }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid #ede8e3", fontSize: ".95rem", color: "#1a1a2e", outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", background: "#fdf6f0" }} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 15px", marginBottom: 16, color: "#dc2626", fontSize: ".88rem" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#f9a3ae" : "#E8334A", color: "#fff", border: "none", borderRadius: 12, fontSize: ".95rem", fontWeight: 800, fontFamily: "Nunito, sans-serif", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 8px 28px rgba(232,51,74,0.45)", transition: "all 0.2s" }}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 22, color: "#6b6b80", fontSize: ".88rem" }}>
              Don't have an account?{" "}
              <span onClick={onGoToSignUp} style={{ color: "#E8334A", fontWeight: 700, cursor: "pointer" }}>Sign Up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}