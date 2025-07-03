import "./LoginForm.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

const UserLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Username and password are required");
    } else {
      setError("");
      try {
        const response = await fetch(
          "http://localhost:8083/api/pharmacy/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: username,
              password: password,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("userId", data.userId);
          navigate("/userDashboard");
        } else {
          setError("Invalid username or password!");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-layout">
      <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
          <GiMedicines className="login-top-icon" />
          <p>Welcome back!</p>
          <p className="login-sub-topic">
            Sign in to your account to continue.
          </p>
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

          <div className="login-register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLoginForm;