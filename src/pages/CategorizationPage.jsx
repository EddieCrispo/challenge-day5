import { DndContext } from "@dnd-kit/core";
import { useEffect, useMemo } from "react";
import DraggableTransaction from "../components/DraggableTransactions";
import DroppableCategory from "../components/DroppableCategory";
import { useAuth } from "../contexts/AuthContext";
import { useCategoryStore } from "../stores/categoryStore";
import { useTransactionStore } from "../stores/transactionStore";
import TransactionCardList from "../components/TransactionCardList";
import { toast } from "react-toastify";

const CategorizationPage = () => {
  const {
    transactions,
    fetchTransactions,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    loading,
    updateTransactions,
  } = useTransactionStore();

  const { user } = useAuth();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (user?.id) {
      fetchTransactions(user.id);
      fetchCategories();
    }
  }, [user]);

  const otherCategory = useMemo(() => {
    return categories.find((cat) => cat.name.toLowerCase() === "other");
  }, [categories]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());

      const isFilterCategory = categories.find((item) => item.id === filter);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "income"
          ? tx.receiverUserId === user.id
          : filter === "expense"
          ? tx.receiverUserId !== user.id
          : filter === "internal"
          ? tx.type === "internal"
          : filter === "external"
          ? tx.type === "external"
          : isFilterCategory
          ? tx.categoryId === filter
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filter, user.id, categories]);

  // Pisahkan ke Other dan Bukan Other
  const { categoryTransactions, otherTransactions } = useMemo(() => {
    if (!otherCategory)
      return { categoryTransactions: [], otherTransactions: [] };

    const categoryTx = filteredTransactions.filter(
      (tx) => tx.categoryId !== otherCategory.id
    );
    const otherTx = filteredTransactions.filter(
      (tx) => tx.categoryId === otherCategory.id
    );

    return {
      categoryTransactions: categoryTx,
      otherTransactions: otherTx,
    };
  }, [filteredTransactions, otherCategory]);

  // Kelompokkan categoryTransactions berdasarkan categoryId
  const groupedByCategory = useMemo(() => {
    const group = {};

    // Filter out "Other" category (will be shown separately)
    const nonOtherCategories = categories.filter(
      (cat) => cat.id !== otherCategory?.id
    );

    nonOtherCategories.forEach((cat) => {
      group[cat.id] = [];
    });

    categoryTransactions.forEach((tx) => {
      if (!group[tx.categoryId]) {
        group[tx.categoryId] = [];
      }
      group[tx.categoryId].push(tx);
    });

    return group;
  }, [categoryTransactions, categories, otherCategory?.id]);

  const updateTransactionCategory = (transactionId, newCategoryId) => {
    // update store atau panggil API
    try {
      const selectedTransactions = transactions.find(
        (tx) => tx.id === transactionId
      );

      const categoryName = categories.find(
        (item) => item.id === newCategoryId
      )?.name;

      const updatedTransactions = transactions.map((tx) =>
        tx?.id === transactionId ? { ...tx, categoryId: newCategoryId } : tx
      );

      useTransactionStore.setState({ transactions: updatedTransactions });
      updateTransactions({
        ...selectedTransactions,
        categoryId: newCategoryId || "",
        categoryName: categoryName || "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update category");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    const transactionId = active.id;
    const newCategoryId = over.id;

    updateTransactionCategory(transactionId, newCategoryId);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600 w-full px-4 py-3 border border-slate-300 rounded-lg transition-all focus:ring-2 focus:border-transparent`}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600 w-[20rem] px-4 py-3 border border-slate-300 rounded-lg transition-all focus:ring-2 focus:border-transparent`}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
        </div>

        <hr className="border-slate-200 dark:border-gray-600 my-4" />

        {filteredTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 dark:text-white">
            {/* LEFT COLUMN */}
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-bold mb-4">
                Transaction Log By Category
              </h2>

              {Object.entries(groupedByCategory).map(([categoryId, txs]) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId
                );

                return (
                  <DroppableCategory
                    key={categoryId}
                    id={categoryId}
                    categoryName={category?.name}
                  >
                    {txs.map((tx) => (
                      <DraggableTransaction key={tx.id} transaction={tx} />
                    ))}
                  </DroppableCategory>
                );
              })}
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-bold mb-4">
                Uncategorized Transaction
              </h2>

              <DroppableCategory
                id={otherCategory?.id || "other"}
                categoryName=""
              >
                {otherTransactions.map((tx) => (
                  <DraggableTransaction key={tx.id} transaction={tx} />
                ))}
              </DroppableCategory>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default CategorizationPage;
