import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

function IdeaCard({ idea, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!idea) return null;

  const channelStyles = {
    LinkedIn:  { background: "#dbeafe", color: "#2563eb" },
    Twitter:   { background: "#f3f4f6", color: "#374151" },
    Instagram: { background: "#fce7f3", color: "#db2777" },
    Facebook:  { background: "#dbeafe", color: "#1877f2" },
    TikTok:    { background: "#f0fdf4", color: "#16a34a" },
    YouTube:   { background: "#fef2f2", color: "#dc2626" },
    WhatsApp:  { background: "#dcfce7", color: "#15803d" },
  };

  const statusFlow = {
    idea: "draft",
    draft: "published",
    published: null,
  };

  const moveLabel = {
    idea: "Move to Draft →",
    draft: "Move to Published →",
    published: null,
  };

  const channelStyle = channelStyles[idea.channel] || { background: "#f3f4f6", color: "#374151" };
  const nextStatus = statusFlow[idea.status];
  const moveLabelText = moveLabel[idea.status];

  const handleMove = async () => {
    if (!nextStatus) return;
    try {
      setUpdating(true);
      await onStatusChange(idea.id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (typeof onDelete !== "function") return;
    setShowDeleteModal(false);
    try {
      setDeleting(true);
      await onDelete(idea.id);
    } finally {
      setDeleting(false);
    }
  };

  const formattedDate = idea.createdAt
    ? new Date(idea.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "N/A";

  return (
    <>
      <DeleteConfirmModal
        show={showDeleteModal}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteModal(false)}
      />

      <div
        style={{
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "10px",
          transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = "#d0c8c0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >

        {/* Channel Badge */}
        <div style={{ marginBottom: "10px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "0.68rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            padding: "3px 10px",
            borderRadius: "50px",
            ...channelStyle,
          }}>
            {idea.channel}
          </span>
        </div>

        {/* Idea Text */}
        <p style={{
          fontSize: "0.9rem",
          fontWeight: 500,
          color: "var(--text-primary)",
          lineHeight: 1.55,
          marginBottom: "14px",
        }}>
          {idea.text || "Untitled Idea"}
        </p>

        {/* Footer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}>

          {/* Date */}
          <span style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}>
            {formattedDate}
          </span>

          {/* Actions */}
          <div style={{ display: "flex", gap: "6px" }}>

            {/* Move button */}
            {moveLabelText && (
              <button
                onClick={handleMove}
                disabled={updating || deleting}
                style={{
                  padding: "5px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border)",
                  background: "var(--cream)",
                  color: "var(--text-secondary)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: updating || deleting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  opacity: updating || deleting ? 0.5 : 1,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!updating && !deleting) {
                    e.currentTarget.style.background = "var(--accent-light)";
                    e.currentTarget.style.borderColor = "var(--accent-mid)";
                    e.currentTarget.style.color = "var(--accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--cream)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {updating ? "Moving..." : moveLabelText}
              </button>
            )}

            {/* Delete button */}
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting || updating}
              style={{
                padding: "5px 10px",
                borderRadius: "8px",
                border: "1.5px solid var(--border)",
                background: "var(--cream)",
                color: "var(--text-secondary)",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: deleting || updating ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                opacity: deleting || updating ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!deleting && !updating) {
                  e.currentTarget.style.background = "#fff0f0";
                  e.currentTarget.style.borderColor = "#fca5a5";
                  e.currentTarget.style.color = "#ef4444";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--cream)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {deleting ? "..." : "✕"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default IdeaCard;
