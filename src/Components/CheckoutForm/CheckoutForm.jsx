import "./CheckoutForm.css";
import React, { useState, useEffect } from "react";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const checkoutForm = () => {
  const [user, setUser] = useState({
    name: "",
    address: "",
    email: "",
    mobileNumber: "",
  });
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartProducts, setCartProducts] = useState([]);
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
        setUser({
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
        });
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("checkoutCart");
    if (storedCart) {
      setCartProducts(JSON.parse(storedCart));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.mobileNumber,
      total: `$${total}`,
      cart: cartProducts
        .map(
          (item) =>
            `${item.productName} (x${item.quantity}) - $${item.totalPrice}`
        )
        .join("\n"),
    };

    try {
      const response = await fetch("https://formspree.io/f/xblyebzo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/userDashboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Formspree error:", err);
      alert("❌ Network error. Try again.");
    }
  };

  const total = cartProducts.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user found.</div>;

  return (
    <div className="page-background">
      <div className="checkout-form">
        <div
          className="checkout-back-btn"
          onClick={() => navigate(-1)}
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
          style={{
            cursor: "pointer",
            position: "absolute",
            left: -10,
            top: 50,
            fontSize: 40,
            zIndex: 10,
          }}
          title="Go back"
        >
          {isBackHovered ? <IoArrowBackCircle /> : <IoArrowBackCircleOutline />}
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <h4>Contact Details</h4>

            {showSuccessPopup && (
              <div className="popup-overlay">
                <div className="popup-message">
                  ✅ Order placed! Confirmation email sent.
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="checkout-form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>
              <div className="checkout-form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="checkout-form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div className="checkout-form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="mobileNumber"
                  value={user.mobileNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="button-container">
              <button className="checkout-button" type="submit">
                Checkout
              </button>
            </div>
          </form>
        </div>

        <div className="product-container">
          <h2>Review Order Details</h2>
          <div className="product-scroll-area">
            <ul className="product-list">
              {cartProducts.map((item, index) => (
                <li key={index} className="product-item">
                  <img src={item.imageUrl} alt={item.productName} />
                  <div className="product-info">
                    <span className="name">{item.productName}</span>
                    <span className="price">$ {item.totalPrice}</span>
                    <span className="qty">Qty: {item.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="total-price">Total: ${total}</div>
        </div>
      </div>
    </div>
  );
};

export default checkoutForm;
