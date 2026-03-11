import IdeaCard from "./IdeaCard";

function IdeaList({ ideas = [], onStatusChange, onDelete }) {
  if (!ideas.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 text-base">No ideas yet.</p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-1
        xl:grid-cols-2
        2xl:grid-cols-2
        gap-5
      "
    >
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default IdeaList;
