import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
