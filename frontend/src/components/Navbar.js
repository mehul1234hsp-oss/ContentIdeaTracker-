import { useState } from "react";

function StatPill({ number, label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "var(--white)",
      border: "1.5px solid var(--border)",
      borderRadius: "999px",
      padding: "5px 14px",
    }}>
      <span style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 800,
        fontSize: "0.95rem",
        color: "var(--accent)",
      }}>
        {number}
      </span>
      <span style={{
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        fontWeight: 500,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function Navbar({ ideas, onNewIdea, onLogout }) {
  const total = ideas.length;
  const draft = ideas.filter((i) => i.status === "draft").length;
  const published = ideas.filter((i) => i.status === "published").length;

  const [hovering, setHovering] = useState(false);
  const [hoveringLogout, setHoveringLogout] = useState(false);

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--white)",
      boxShadow: "0 1px 0 var(--border)",
      height: "64px",
      display: "flex",
      alignItems: "center",
      padding: "0 32px",
      gap: "16px",
    }}>

      {/* Left — Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <StatPill number={total} label="Total" />
        <StatPill number={draft} label="Draft" />
        <StatPill number={published} label="Published" />
      </div>

      {/* Center — Title */}
      <div style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{ fontSize: "1.3rem" }}>💡</span>
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          fontSize: "1.1rem",
          color: "var(--accent)",
          letterSpacing: "-0.5px",
          whiteSpace: "nowrap",
        }}>
          Content Ideas Tracker
        </span>
      </div>

      {/* Right — Buttons */}
      <div style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <button
          onClick={onNewIdea}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            background: hovering ? "var(--accent-hover)" : "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: "999px",
            padding: "8px 20px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          + New Idea
        </button>

        <button
          onClick={onLogout}
          onMouseEnter={() => setHoveringLogout(true)}
          onMouseLeave={() => setHoveringLogout(false)}
          style={{
            background: "transparent",
            color: hoveringLogout ? "var(--accent)" : "var(--text-muted)",
            border: "1.5px solid var(--border)",
            borderRadius: "999px",
            padding: "8px 20px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          Logout
        </button>
      </div>

    </nav>
  );
}
