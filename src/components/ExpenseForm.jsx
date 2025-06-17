import React, { useState } from "react";
import { format } from "date-fns";
import { Save, X } from "lucide-react";
import "../styles/ExpenseForm.css";

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Business",
  "Other",
];

const ExpenseForm = ({ expense, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    amount: expense?.amount || "",
    category: expense?.category || "",
    description: expense?.description || "",
    date: expense
      ? format(new Date(expense.date), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit({
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="expense-form-card">
      <div className="expense-form-header">
        <h2>{expense ? "Edit Expense" : "Add New Expense"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="expense-form-body">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <div className="input-wrapper">
              <span className="input-prefix">&#8377;</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? "input-error" : ""}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="error-text">{errors.amount}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? "input-error" : ""}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? "input-error" : ""}
          />
          {errors.date && <p className="error-text">{errors.date}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "input-error" : ""}
            placeholder="Enter a description..."
          />
          {errors.description && (
            <p className="error-text">{errors.description}</p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            <Save className="icon" />
            <span>{isLoading ? "Saving..." : expense ? "Update" : "Save"}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            <X className="icon" />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
