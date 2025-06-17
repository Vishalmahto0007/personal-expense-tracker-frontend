import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { expenseService } from "../services/api";
import CategoryChart from "../components/CategoryChart";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const { data } = await expenseService.getAnalytics();
      const expenses = data.expenses || [];

      const monthlyTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      const categoryMap = {};
      expenses.forEach((exp) => {
        if (!categoryMap[exp.category]) {
          categoryMap[exp.category] = { total: 0, count: 0 };
        }
        categoryMap[exp.category].total += exp.amount;
        categoryMap[exp.category].count += 1;
      });

      const categoryBreakdown = Object.entries(categoryMap).map(
        ([cat, value]) => ({
          _id: cat,
          total: value.total,
          count: value.count,
        })
      );

      const recentExpenses = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      const month =
        expenses.length > 0
          ? format(new Date(expenses[0].date), "MMMM yyyy")
          : "";

      setAnalytics({
        monthlyTotal,
        categoryBreakdown,
        recentExpenses,
        month,
      });
    } catch (error) {
      console.error("Analytics error:", error);
      setError("Failed to fetch analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Track your expenses and financial insights
          </p>
        </div>
        <Link to="/add-expense" className="btn-add-expense">
          + Add Expense
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p>This Month</p>
          <h2>&#8377;{analytics?.monthlyTotal.toFixed(2)}</h2>
          <span>{analytics?.month}</span>
        </div>
        <div className="stat-card">
          <p>Categories</p>
          <h2>{analytics?.categoryBreakdown.length || 0}</h2>
          <span>Active categories</span>
        </div>
        <div className="stat-card">
          <p>Recent</p>
          <h2>{analytics?.recentExpenses.length || 0}</h2>
          <span>Latest expenses</span>
        </div>
        <div className="stat-card">
          <p>Average</p>
          <h2>
            &#8377;
            {analytics?.categoryBreakdown.length
              ? (
                  analytics.categoryBreakdown.reduce(
                    (sum, cat) => sum + cat.total,
                    0
                  ) /
                  analytics.categoryBreakdown.reduce(
                    (sum, cat) => sum + cat.count,
                    0
                  )
                ).toFixed(2)
              : "0.00"}
          </h2>
          <span>Per transaction</span>
        </div>
      </div>

      <div className="dashboard-content">
        <CategoryChart data={analytics?.categoryBreakdown || []} />

        <div className="recent-expenses">
          <div className="recent-expenses-header">
            <h3>Recent Expenses</h3>
            <Link to="/expenses">View all</Link>
          </div>
          <div>
            {analytics?.recentExpenses.length > 0 ? (
              analytics.recentExpenses.map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div>
                    <p className="expense-desc">{expense.description}</p>
                    <p className="expense-meta">
                      {expense.category} •{" "}
                      {format(new Date(expense.date), "MMM dd")}
                    </p>
                  </div>
                  <p className="expense-amount">
                    &#8377;{expense.amount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <div className="empty-expenses">
                <p>No recent expenses</p>
                <Link to="/add-expense">Add your first expense</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
