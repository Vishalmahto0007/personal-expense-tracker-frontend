import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../store/slices/authSlice";
import { useForm } from "react-hook-form";
import "../styles/Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isLoading = useSelector((state) => state.auth.isLoading);

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    shouldUnregister: true,
    mode: "onTouched",
  });

  useEffect(() => {
    console.log("Login component mounted");
  }, []);

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      const resultAction = await dispatch(login(data));
      if (login.fulfilled.match(resultAction)) {
        const apiMessage =
          resultAction?.payload?.message || "Login successful!";
        toast.success(apiMessage);
        navigate(from, { replace: true });
      } else {
        const apiError = resultAction?.payload || "Login failed";
        toast.error(apiError);
        setSubmitError(apiError);
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
      setSubmitError("Unexpected error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Sign in to your <strong>&#8377; ExpenseTracker</strong> account
          </p>
        </div>

        <div className="login-form-card">
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="signup-link">
            <p>
              Don't have an account?
              <Link to="/register" className="link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
