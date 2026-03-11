import { useEffect } from "react";

function DeleteConfirmModal({ show, onConfirm, onCancel }) {

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    if (show) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [show, onCancel]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,46,0.35)",
        backdropFilter: "blur(6px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          borderRadius: "28px",
          padding: "36px",
          boxShadow: "0 32px 64px rgba(0,0,0,0.14)",
          position: "relative",
          margin: "0 16px",
        }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1.5px solid var(--border)",
            background: "var(--cream)",
            color: "var(--text-secondary)",
            fontSize: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Icon */}
        <div style={{
          width: "48px",
          height: "48px",
          background: "#fef2f2",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          marginBottom: "16px",
        }}>
          🗑️
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "1.4rem",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          color: "var(--text-primary)",
          marginBottom: "8px",
        }}>
          Delete this idea?
        </h2>
        <p style={{
          fontSize: "0.9rem",
          color: "var(--text-muted)",
          marginBottom: "28px",
          lineHeight: 1.6,
        }}>
          This action cannot be undone. The idea will be permanently removed from your board.
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "1.5px solid var(--border)",
              background: "var(--cream)",
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#d0c8c0";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontSize: "0.95rem",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ef4444";
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
