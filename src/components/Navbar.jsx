import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  DollarSign,
  Home,
  Plus,
  IndianRupee,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import "../styles/Navbar.css";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="logo-link">
          <div className="logo-icon">
            <IndianRupee className="icon-white" />
          </div>
          <span className="logo-text">ExpenseTracker</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <Home className="nav-icon" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/expenses"
            className={`nav-item ${isActive("/expenses") ? "active" : ""}`}
          >
            <IndianRupee className="nav-icon" />
            <span>Expenses</span>
          </Link>
          <Link
            to="/add-expense"
            className={`nav-item ${isActive("/add-expense") ? "active" : ""}`}
          >
            <Plus className="nav-icon" />
            <span>Add Expense</span>
          </Link>
        </div>

        <div className="user-section">
          <div className="user-info">
            <User className="nav-icon" />
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="mobile-nav">
        <Link
          to="/dashboard"
          className={`mobile-item ${isActive("/dashboard") ? "active" : ""}`}
        >
          <Home className="nav-icon" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/expenses"
          className={`mobile-item ${isActive("/expenses") ? "active" : ""}`}
        >
          <DollarSign className="nav-icon" />
          <span>Expenses</span>
        </Link>
        <Link
          to="/add-expense"
          className={`mobile-item ${isActive("/add-expense") ? "active" : ""}`}
        >
          <Plus className="nav-icon" />
          <span>Add</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
