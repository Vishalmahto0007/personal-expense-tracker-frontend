import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { createExpense } from "../store/slices/expenseSlice";
import ExpenseForm from "../components/ExpenseForm";
import "../styles/AddExpense.css";

const AddExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (expense) => {
    try {
      await dispatch(createExpense(expense)).unwrap();
      navigate("/expenses");
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  return (
    <div className="add-expense-container">
      <div className="add-expense-wrapper">
        <div className="add-expense-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft className="back-icon" />
          </button>
          <div>
            <h1 className="add-expense-title">Add New Expense</h1>
            <p className="add-expense-subtitle">Record your expense details</p>
          </div>
        </div>

        <ExpenseForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddExpense;
