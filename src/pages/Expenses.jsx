import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Filter, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ExpenseCard from "../components/ExpenseCard";
import ExpenseForm from "../components/ExpenseForm";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/Expenses.css";

import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  clearError,
  selectExpenses,
  selectIsLoading,
  selectError,
  selectTotal,
  resetExpenses,
} from "../store/slices/expenseSlice";

const categories = [
  "All Categories",
  "Groceries",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Business",
  "Other",
];

const LIMIT = 9;

const Expenses = () => {
  const dispatch = useDispatch();
  const observer = useRef();
  const loadingMore = useRef(false);

  const expenses = useSelector(selectExpenses);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const total = useSelector(selectTotal);

  const [editingExpense, setEditingExpense] = useState(null);
  const [addingExpense, setAddingExpense] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getFilters = () => {
    const filters = {};
    if (selectedCategory !== "All Categories")
      filters.category = selectedCategory;
    if (debouncedSearchTerm.trim()) filters.search = debouncedSearchTerm.trim();
    return filters;
  };

  const loadExpenses = async (newSkip = skip) => {
    const result = await dispatch(
      fetchExpenses({ skip: newSkip, limit: LIMIT, filters: getFilters() })
    );
    const fetched = result.payload?.expenses || [];
    if (fetched.length < LIMIT) setHasMore(false);
    else setHasMore(true);
  };

  useEffect(() => {
    const resetAndFetch = async () => {
      dispatch(resetExpenses());
      setSkip(0);
      setHasMore(true);
      await loadExpenses(0);
    };
    resetAndFetch();
  }, [debouncedSearchTerm, selectedCategory, dispatch]);

  const lastExpenseRef = useCallback(
    (node) => {
      if (isLoading || loadingMore.current || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore.current) {
          loadingMore.current = true;
          setSkip((prev) => prev + LIMIT);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (skip !== 0) {
      loadExpenses(skip).finally(() => {
        loadingMore.current = false;
      });
    }
  }, [skip]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleAddExpense = async (expenseData) => {
    try {
      await dispatch(createExpense(expenseData)).unwrap();
      toast.success("Expense added successfully!");
      setAddingExpense(false);
      dispatch(resetExpenses());
      setSkip(0);
      setHasMore(true);
      await loadExpenses(0);
    } catch {
      toast.error("Failed to add expense");
    }
  };

  const handleUpdate = async (updatedExpense) => {
    try {
      await dispatch(
        updateExpense({ id: editingExpense._id, data: updatedExpense })
      ).unwrap();
      toast.success("Expense updated successfully!");
      setEditingExpense(null);
      dispatch(resetExpenses());
      setSkip(0);
      setHasMore(true);
      await loadExpenses(0);
    } catch {
      toast.error("Failed to update expense");
    }
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteExpense(deleteExpenseId)).unwrap();
      toast.success("Expense deleted successfully!");
      setDeleteExpenseId(null);
      dispatch(resetExpenses());
      setSkip(0);
      setHasMore(true);
      await loadExpenses(0);
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="expenses-page">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="expenses-container">
        <div className="expenses-header">
          <div>
            <h1 className="expenses-title">Expenses</h1>
            <p className="expenses-subtitle">
              Manage your expenses and track spending
            </p>
          </div>
          <button
            className="btn add-expense-btn"
            onClick={() => setAddingExpense(true)}
          >
            <Plus className="icon" />
            <span>Add Expense</span>
          </button>
        </div>

        {addingExpense && (
          <div className="modal-overlay">
            <div className="modal">
              <ExpenseForm
                onSubmit={handleAddExpense}
                onCancel={() => setAddingExpense(false)}
              />
            </div>
          </div>
        )}

        {editingExpense && (
          <div className="modal-overlay">
            <div className="modal">
              <ExpenseForm
                expense={editingExpense}
                onSubmit={handleUpdate}
                onCancel={() => setEditingExpense(null)}
              />
            </div>
          </div>
        )}

        {deleteExpenseId && (
          <div className="modal-overlay">
            <div
              className="modal"
              style={{ maxWidth: 400, textAlign: "center" }}
            >
              <h3>Delete Expense</h3>
              <p>Are you sure you want to delete this expense?</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 24,
                }}
              >
                <button
                  className="btn"
                  style={{ background: "#ef4444", color: "#fff" }}
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className="btn"
                  onClick={() => setDeleteExpenseId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="filter-box">
          <div className="search-filter">
            <div className="search-bar">
              <div className="search-icon">
                <Search className="icon" />
              </div>
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                onKeyDown={(e) => e.key === "Enter" && setSkip(0)}
              />
            </div>
            <div className="filter-buttons">
              <button onClick={() => setShowFilters((s) => !s)} className="btn">
                <Filter className="icon" />
                <span>Filters</span>
              </button>
              {showFilters && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="summary">
            Showing {expenses.length} of {total} expenses
          </div>
        </div>

        {expenses.length > 0 ? (
          <div className="expenses-grid">
            {expenses.map((expense, idx) => (
              <div
                ref={idx === expenses.length - 1 ? lastExpenseRef : null}
                key={expense._id}
              >
                <ExpenseCard
                  expense={expense}
                  onEdit={setEditingExpense}
                  onDelete={setDeleteExpenseId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-box">
            <div className="empty-text">
              <p className="title">No expenses found</p>
              <p>Try adjusting your filters or add a new expense</p>
            </div>
          </div>
        )}

        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default Expenses;
