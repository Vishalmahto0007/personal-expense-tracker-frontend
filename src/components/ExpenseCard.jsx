import React from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Calendar, Tag } from "lucide-react";
import "../styles/ExpenseCard.css";

const categoryColors = {
  Groceries: "groceries",
  Transport: "transport",
  Shopping: "shopping",
  Entertainment: "entertainment",
  Utilities: "utilities",
  Healthcare: "healthcare",
  Travel: "travel",
  Education: "education",
  Business: "business",
  Other: "other",
};

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const categoryClass = categoryColors[expense?.category] || "other";

  return (
    <div className="expense-card">
      <div className="expense-card-content">
        <div className="expense-header">
          <div className="expense-meta">
            <span className={`category-tag ${categoryClass}`}>
              <Tag className="icon" />
              {expense?.category}
            </span>
            <span className="expense-date">
              <Calendar className="icon" />
              {expense?.date && format(new Date(expense.date), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="actions">
            <button onClick={() => onEdit(expense)} className="icon-btn">
              <Edit2 className="icon" />
            </button>
            <button onClick={() => onDelete(expense._id)} className="icon-btn">
              <Trash2 className="icon" />
            </button>
          </div>
        </div>
        <h3 className="expense-title">{expense.description}</h3>
        <p className="expense-amount">₹{expense.amount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ExpenseCard;
