function Hero({ ideas }) {
  const ideaCount = ideas.filter((i) => i.status === "idea").length;
  const draftCount = ideas.filter((i) => i.status === "draft").length;
  const publishedCount = ideas.filter((i) => i.status === "published").length;

  return (
    <div style={{
      background: "linear-gradient(135deg, #fff5f6 0%, #fdf6f0 50%, #fff8f0 100%)",
      borderBottom: "1px solid var(--border)",
      padding: "52px 48px 44px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Decorative background blobs */}
      <div style={{
        position: "absolute",
        top: "-60px", right: "-60px",
        width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(232,51,74,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-40px", left: "30%",
        width: "200px", height: "200px",
        background: "radial-gradient(circle, rgba(255,160,50,0.07) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      {/* Inner content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "40px",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Left — Text */}
        <div>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--accent-light)",
            border: "1px solid var(--accent-mid)",
            borderRadius: "50px",
            padding: "5px 14px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--accent)",
            marginBottom: "16px",
            letterSpacing: "0.3px",
          }}>
            ✦ Your Content Pipeline
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            fontWeight: 900,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            color: "var(--text-primary)",
            marginBottom: "14px",
          }}>
            Track every idea,{" "}
            <span style={{ color: "var(--accent)" }}>
              from spark to publish
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: 1.6,
            maxWidth: "440px",
          }}>
            Manage your LinkedIn, Twitter, and Instagram content ideas
            all in one place. Move them from idea → draft → published.
          </p>
        </div>

        {/* Right — Stat Cards */}
        <div style={{
          display: "flex",
          gap: "16px",
          flexShrink: 0,
        }}>
          <StatCard label="Ideas" value={ideaCount} color="var(--accent)" />
          <StatCard label="Draft" value={draftCount} color="#d97706" />
          <StatCard label="Published" value={publishedCount} color="#059669" />
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid var(--border)",
      borderRadius: "20px",
      padding: "22px 28px",
      textAlign: "center",
      boxShadow: "var(--shadow-card)",
      minWidth: "100px",
    }}>
      <div style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "2.2rem",
        fontWeight: 900,
        color: color,
        lineHeight: 1,
        marginBottom: "6px",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: "0.72rem",
        color: "var(--text-muted)",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        {label}
      </div>
    </div>
  );
}

export default Hero;
