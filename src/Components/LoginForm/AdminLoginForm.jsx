import "./LoginForm.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

const AdminLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Username and password are required.");
    } else {
      setError("");
    }
  };

  return (
    <div className="login-layout">
      <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
          <GiMedicines className="login-top-icon" />
          <p>Welcome back!</p>
          <p className="login-sub-topic">Sign in to your account.</p>
          <div className="login-input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="login-input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide password" : "Show password"}
              style={{ cursor: "pointer", marginLeft: "8px" }}
            >
              {showPassword ? (
                <FaEye className="icon" />
              ) : (
                <FaEyeSlash className="icon" />
              )}
            </span>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
