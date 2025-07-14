import { useDraggable } from "@dnd-kit/core";
import TransactionCard from "./TransactionCard";

const DraggableTransaction = ({ transaction }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: transaction.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-2 cursor-move"
    >
      <TransactionCard transaction={transaction} showCategory={false} />
    </div>
  );
};

export default DraggableTransaction;
