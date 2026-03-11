import IdeaCard from "./IdeaCard";

function KanbanBoard({ ideas, onStatusChange, onDelete }) {

  const ideaItems = ideas.filter((i) => i.status === "idea");
  const draftItems = ideas.filter((i) => i.status === "draft");
  const publishedItems = ideas.filter((i) => i.status === "published");

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      alignItems: "start",
    }}>
      <Column
        title="Ideas"
        color="#a78bfa"
        items={ideaItems}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        emptyText="No ideas yet. Click '+ New Idea' to get started."
      />
      <Column
        title="Draft"
        color="#fbbf24"
        items={draftItems}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        emptyText="Move ideas here when you start drafting."
      />
      <Column
        title="Published"
        color="#34d399"
        items={publishedItems}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        emptyText="Published ideas will appear here."
      />
    </div>
  );
}

function Column({ title, color, items, onStatusChange, onDelete, emptyText }) {
  return (
    <div style={{
      background: "var(--cream-dark)",
      border: "1.5px solid var(--border)",
      borderRadius: "20px",
      padding: "18px",
    }}>

      {/* Column Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.82rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          color: "var(--text-secondary)",
        }}>
          <div style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}88`,
          }} />
          {title}
        </div>

        <div style={{
          fontSize: "0.72rem",
          fontWeight: 600,
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          borderRadius: "50px",
          padding: "2px 10px",
          color: "var(--text-muted)",
        }}>
          {items.length}
        </div>
      </div>

      {/* Cards */}
      {items.length === 0 ? (
        <div style={{
          border: "2px dashed var(--border)",
          borderRadius: "14px",
          padding: "28px 16px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          lineHeight: 1.5,
        }}>
          {emptyText}
        </div>
      ) : (
        items.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

export default KanbanBoard;
