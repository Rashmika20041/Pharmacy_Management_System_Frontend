import "./CartForm.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QuantityAdjuster } from "./QuantityAdjuster";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";

const CartForm = () => {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchCart() {
      try {
        const { data } = await axios.post(
          "http://localhost:8081/api/pharmacy/order/viewCart",
          {
            userId: userId,
          }
        );
        if (isMounted) {
          setCartItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) alert("Failed to fetch cart");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCart();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemoveItem = async (productId) => {
    setRemovingItemId(productId);

    setTimeout(async () => {
      try {
        await axios.delete(
          `http://localhost:8081/api/pharmacy/order/cart/delete/${productId}?userId=${userId}`
        );
        setCartItems((items) =>
          items.filter((item) => item.productId !== productId)
        );
      } catch (err) {
        alert("Failed to remove item from cart");
      } finally {
        setRemovingItemId(null);
      }
    }, 300);
  };

  const handleQuantityChange = async (userId, productId, newQty) => {
    if (!userId) {
      alert("User ID missing!");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8081/api/pharmacy/order/cart/update/${productId}?quantity=${newQty}&userId=${userId}`
      );
      setCartItems((items) =>
        items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQty,
                totalPrice:
                  (item.unitPrice ??
                    (item.totalPrice && item.quantity
                      ? item.totalPrice / item.quantity
                      : 0)) * newQty,
              }
            : item
        )
      );
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );

  if (loading) return <div>Loading...</div>;

  if (!cartItems.length) {
    return (
      <div className="page-background">
        <div className="cart-form">
          <div
            className="cart-back-btn"
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
          <h1 className="cart-header">🛒 Shopping Cart</h1>
          <div className="empty-cart-message">No products added to cart.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-background">
      <div className="cart-form">
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
          {isBackHovered ? <IoArrowBackCircle /> : <IoArrowBackCircleOutline />}
        </div>
        <h1 className="cart-header">🛒 Shopping Cart</h1>
        <div className="cart-table">
          <div className="cart-row cart-header-row">
            <div className="cart-col image-col">Product</div>
            <div className="cart-col name-col">Name</div>
            <div className="cart-col delete-col">Remove</div>
            <div className="cart-col qty-col">Quantity</div>
            <div className="cart-col price-col">Price</div>
          </div>
          {cartItems.map((item, idx) => (
            <div
              className={`cart-row ${
                removingItemId === item.productId ? "removing" : ""
              }`}
              key={item?.cartId ?? `${item.productId}_${idx}`}
            >
              <div className="cart-col image-col">
                {item?.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName || "Product"}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image-placeholder">No Image</div>
                )}
              </div>
              <div className="cart-col name-col">
                {item?.productName || "Unknown"}
              </div>

              <div className="cart-col delete-col">
                <button
                  className="delete-btn"
                  onClick={() => handleRemoveItem(item?.productId)}
                >
                  Remove
                </button>
              </div>
              <div className="cart-col qty-col">
                <QuantityAdjuster
                  className="quantity-adjuster"
                  initialValue={
                    typeof item.quantity === "number" && !isNaN(item.quantity)
                      ? item.quantity
                      : 1
                  }
                  min={1}
                  max={99}
                  onChange={(value) =>
                    handleQuantityChange(userId, item?.productId, value)
                  }
                />
              </div>
              <div className="cart-col price-col">
                $
                {typeof item.totalPrice === "number" &&
                typeof item.quantity === "number" &&
                item.quantity > 0
                  ? (item.totalPrice / item.quantity).toFixed(2)
                  : "0.00"}
              </div>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-footer-total">
            <b>Total:</b>{" "}
            <span className="total-value">${total.toFixed(2)}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => {
              localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
              navigate("/checkout");
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartForm;
