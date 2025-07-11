import axios from "axios";
import PropTypes from "prop-types";
import "./Product.css";
import BuyNowModal from "./BuyNowModal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Product = ({
  product = {},
  onAddToCart = () => {},
  onBuyNow = () => {},
  userId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!userId || !(product && (product.id || product.productId))) {
      alert("User or product information missing.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8081/pharmacy/order/addCart?userId=${userId}`,
        {
          productId: product.productId,
          quantity: 1,
        }
      );
      onAddToCart(product);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  const handleBuyNow = () => {
    setShowModal(true);
  };

  const handleProceedToCheckout = () => {
    setShowModal(false);
    window.location.href = `/checkout?productId=${product.productId}&quantity=${quantity}`;
  };

  return (
    <div className="product-layer">
      <img
        src={product.imageUrl || product.image || ""}
        className="product-image"
        alt={product.name || product.productName || "Product"}
      />
      <div className="product-name">
        {product.name || product.productName || "No Name"}
      </div>
      <div className="product-description">
        {product.description || "No Description"}
      </div>
      <div className="product-price">
        ${product.price !== undefined ? product.price : "N/A"}
      </div>
      <div className="product-buttons">
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleBuyNow}>Buy Now</button>
      </div>
      {showModal && (
        <BuyNowModal
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={() => setShowModal(false)}
          onProceed={handleProceedToCheckout}
        />
      )}
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.object,
  onAddToCart: PropTypes.func,
  onBuyNow: PropTypes.func,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Product;
