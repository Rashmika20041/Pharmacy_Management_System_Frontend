import "./ProfileView.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      })
      .catch(() => {
        setError("Failed to load profile.");
        setLoading(false);
      });
  }, [navigate]);

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Image_Upload");
    data.append("cloud_name", "dtatrdtvo");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dtatrdtvo/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploadResult = await res.json();
      if (uploadResult.secure_url) {
        setUser((prev) => ({
          ...prev,
          imgUrl: uploadResult.secure_url,
        }));
      } else {
        setError("Image upload failed.");
      }
    } catch (err) {
      setError("Image upload failed.");
    }
    setUploading(false);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setError(null);
    fetch("http://localhost:8083/api/pharmacy/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
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
                  src={
                    user.imgUrl ||
                    "https://ui-avatars.com/api/?name=User&background=random&color=fff"
                  }
                  alt="User"
                  style={{
                    cursor: uploading ? "wait" : "pointer",
                    opacity: uploading ? 0.5 : 1,
                  }}
                  onClick={handleImageClick}
                  title={
                    uploading
                      ? "Uploading..."
                      : "Click to change profile picture"
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {uploading && (
                  <div style={{ color: "#888", fontSize: 12 }}>
                    Uploading...
                  </div>
                )}
                <div className="profile-name">
                  <h2>{user.name || user.userName || "User"}</h2>
                </div>
              </div>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={uploading}
              >
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
                  name="mobileNumber"
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
                  name="userName"
                  value={user.userName || ""}
                  onChange={handleChange}
                  readOnly
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
