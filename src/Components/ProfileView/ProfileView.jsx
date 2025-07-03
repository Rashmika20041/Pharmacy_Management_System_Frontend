import "./ProfileView.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../CustomerDashboard/ProfileContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";

const ProfileView = () => {
  const { profileImage, updateProfileImage } = useProfile();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch("http://localhost:8083/api/pharmacy/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [navigate]);

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch("http://localhost:8083/api/pharmacy/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...user,
        imgUrl: profileImage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        updateProfileImage(
          data.imgUrl || "https://randomuser.me/api/portraits/women/44.jpg"
        );
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      })
      .catch(() => setError("Failed to update profile."));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user found.</div>;

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-page">
          <div className="profile-header">
            <div
              className="profile-back-btn"
              onClick={() => navigate(-1)}
              onMouseEnter={() => setIsBackHovered(true)}
              onMouseLeave={() => setIsBackHovered(false)}
              style={{
                cursor: "pointer",
                position: "absolute",
                left: 20,
                top: 30,
                fontSize: 40,
                zIndex: 10,
              }}
              title="Go back"
            >
              {isBackHovered ? (
                <IoArrowBackCircle />
              ) : (
                <IoArrowBackCircleOutline />
              )}
            </div>
            <div className="profile-bar">
              <div className="profile-left">
                <img
                  className="profile-picture"
                  src={profileImage}
                  alt="User"
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                  title="Click to change profile picture"
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                <div className="profile-name">
                  <h2>{user.name || user.name}</h2>
                </div>
              </div>
              <button className="save-btn" onClick={handleSave}>
                Save changes
              </button>
            </div>
          </div>

          <div className="profile-details">
            <h3>Personal details</h3>
            <div className="profile-form-grid">
              <div className="form-group">
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Mobile number</label>
                <input
                  type="text"
                  name="mobile"
                  value={user.mobileNumber || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={user.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={user.userName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password || ""}
                  onChange={handleChange}
                />
                <span
                  className="password-toggle-view"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide password" : "Show password"}
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                >
                  {showPassword ? (
                    <FaEye className="showicon" />
                  ) : (
                    <FaEyeSlash className="showicon" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="success-popup">Profile updated successfully!</div>
      )}
    </div>
  );
};

export default ProfileView;
