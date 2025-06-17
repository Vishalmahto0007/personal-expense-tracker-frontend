import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, IndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { register as registerThunk } from "../store/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isLoading = useSelector((state) => state.auth.isLoading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitError("");
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      setSubmitError("Passwords do not match");
      return;
    }
    try {
      const resultAction = await dispatch(
        registerThunk({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      );
      console.log("resultAction", resultAction.payload);
      if (registerThunk.fulfilled.match(resultAction)) {
        const apiMessage =
          resultAction?.payload ||
          resultAction.payload ||
          "Registration successful! Please login.";
        toast.success(apiMessage);
        navigate("/login");
      } else {
        const apiError =
          resultAction && resultAction.payload && resultAction.payload;
        toast.error(apiError);
        setSubmitError(apiError);
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
      setSubmitError("Unexpected error occurred");
    }
  };

  return (
    <div className="register-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="register-wrapper">
        <div className="register-header">
          <h2 className="register-title">Create your account</h2>
          <p className="register-subtitle">
            Start tracking your expenses today{" "}
            <strong>&#8377; ExpenseTracker</strong>
          </p>
        </div>

        <div className="form-card">
          <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            {submitError && <div className="error-message">{submitError}</div>}

            <div>
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <User className="icon" />
                </div>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <Mail className="icon" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <Lock className="icon" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="icon" />
                  ) : (
                    <Eye className="icon" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <div className="input-group">
                <div className="input-icon">
                  <Lock className="icon" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="icon" />
                  ) : (
                    <Eye className="icon" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="signin-link">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
