// BuyNowModal.js
import "./BuyNowModal.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BuyNowModal = ({
  product,
  quantity,
  setQuantity,
  onClose,
  onProceed,
}) => {
  const navigate = useNavigate();

  if (!product) return null;

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        mode: "buyNow",
        product: {
          ...product,
          quantity,
          totalPrice: product.price * quantity,
        },
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Buy Now</h2>
        <p>
          <strong>{product.name || product.productName}</strong>
        </p>
        <p>Price: ${product.price}</p>

        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="proceed" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
