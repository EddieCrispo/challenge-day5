import { useDroppable } from "@dnd-kit/core";

const DroppableCategory = ({ id, categoryName, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 border rounded-md mb-6 transition-all dark:text-white ${
        isOver
          ? "bg-green-50 border-green-400 dark:bg-green-500/19 dark:border-green-700"
          : "bg-slate-50 dark:bg-gray-800 dark:border-gray-700 border-slate-200"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">{categoryName}</h3>
      {children.length === 0 ? (
        <p className="text-slate-500 italic">
          No transactions in this category.
        </p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
};

export default DroppableCategory;
