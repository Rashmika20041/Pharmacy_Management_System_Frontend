import "./CheckoutForm.css";
import React, { useState, useEffect } from "react";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutForm = () => {
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch("http://localhost:8083/api/pharmacy/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser({
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("User fetch error:", err);
        setError("Failed to load user data.");
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (location.state?.mode === "buyNow" && location.state.product) {
      setCartProducts([location.state.product]);
    } else {
      const storedCart = localStorage.getItem("checkoutCart");
      if (storedCart) {
        setCartProducts(JSON.parse(storedCart));
      }
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if(!cartProducts || cartProducts.length === 0) {
      alert("Your cart is empty. Please add items to your cart before checking out.");
      return;
    }

    try {
      const backendRes = await fetch(
        `http://localhost:8081/api/pharmacy/order/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            products: cartProducts.map((item) => ({
              productId: item.productId || item.id,
              quantity: item.quantity || 1,
              totalPrice: item.totalPrice,
            })),
            totalPrice: total,
            buyNow: location.state?.mode === "buyNow"
          }),
        }
      );

      if (!backendRes.ok) {
        const errorText = await backendRes.text();
        console.error("Backend Error:", errorText);
        throw new Error(`❌ Checkout failed: ${errorText}`);
      }

      const formData = {
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.mobileNumber,
        total: `$${total.toFixed(2)}`,
        cart: cartProducts
          .map((item) => {
            const productName = item.productName || item.name || 'Unknown Product';
            const quantity = item.quantity || 1;
            const price = item.totalPrice || item.price || 0;
            return `${productName} (x${quantity}) - $${price.toFixed(2)}`;
          })
          .join("\n"),
      };

      await fetch("https://formspree.io/f/xblyebzo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setShowSuccessPopup(true);

      if (location.state?.mode !== "buyNow") {
        localStorage.removeItem("checkoutCart");
      }

      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/userDashboard");
      }, 2000);
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message || "❌ Something went wrong during checkout.");
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
                  readOnly
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
                  readOnly
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
                  readOnly
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
                  readOnly
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
          <div className="total-price">Total: ${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
