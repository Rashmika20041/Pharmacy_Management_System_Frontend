import "./RegisterForm.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    email: "",
    mobileNumber: "",
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8083/api/pharmacy/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };
  return (
    <div className="register-layout">
    <div className='register-wrapper'>
      <form onSubmit={handleSubmit}>
        <GiMedicines className='register-top-icon' />
        <h2>Create An Account</h2>

        <div className="register-input-box">
          <input type="text" placeholder="Name" value={form.name} onChange={handleChange} name="name" required />
        </div>
        <div className="register-input-box">
          <input type="text" placeholder="Age" value={form.age} onChange={handleChange} name="age" required />
        </div>
        <div className="register-input-box">
          <input type="text" placeholder="Address" value={form.address} onChange={handleChange} name="address" required />
        </div>
        <div className="register-input-box">
          <input type="text" placeholder="Email" value={form.email} onChange={handleChange} name="email" required />
        </div>
        <div className="register-input-box">
          <input type="text" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} name="mobileNumber" required />
        </div>
        <div className="register-input-box">
          <input type="text" placeholder="Username" value={form.userName} onChange={handleChange} name="userName" required />
        </div>
        <div className="register-input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            name="password"
            required
          />
          <span
            className="password-toggle-register"
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "Hide password" : "Show password"}
            style={{ cursor: "pointer", marginLeft: "8px" }}
          >
            {showPassword ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
          </span>
        </div>
        {error && <div className="register-error">{error}</div>}
        <button type='submit'>Register</button>

        <div className="register-register-link">
            <p>
                Already have an account?  <Link to="/login">Sign In.</Link>
            </p>
        </div>
      </form>
    </div>
    </div>
  );
};

export default RegisterForm;
