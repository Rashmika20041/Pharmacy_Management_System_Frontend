import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { IoLogOut, IoLogOutOutline } from "react-icons/io5";
import logo from "../Assets/logo.png";
import "./NavigationBar.css";

const NavigationBar = ({ profileImage }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/userDashboard")}>
        <img src={logo} alt="Company Logo" className="company-logo" />
      </div>
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="navbar-search-btn">
          Search
        </button>
      </form>
      <div className="navbar-right">
        <button
          className="navbar-orders-btn"
          onClick={() => navigate("/orders")}
        >
          View Orders
        </button>
        <span
          className="navbar-cart-icon"
          onClick={() => navigate("/cart")}
          title="Cart"
        >
          <FaCartPlus />
        </span>
        <img
          src={profileImage}
          alt="Profile"
          className="navbar-profile-photo"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
          title="Profile"
        />
        <span
          className="navbar-logout"
          onClick={handleLogout}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          style={{ cursor: "pointer", marginRight: "10px", fontSize: "1.6rem" }}
          title="Logout"
        >
          {isLogoutHovered ? (
            <IoLogOut className="logout-icon" />
          ) : (
            <IoLogOutOutline className="logout-icon" />
          )}
        </span>
      </div>
    </nav>
  );
};

export default NavigationBar;
