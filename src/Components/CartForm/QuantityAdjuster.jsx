import { useEffect, useState } from 'react';
import './QuantityAdjuster.css';

export const QuantityAdjuster = ({ min = 1, max = 99, onChange, initialValue = 1 }) => {
  const [quantity, setQuantity] = useState(initialValue);

  // ✅ Sync with prop changes
  useEffect(() => {
    setQuantity(initialValue);
  }, [initialValue]);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange && onChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange && onChange(newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
      onChange && onChange("");
      return;
    }
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      setQuantity(parsed);
      onChange && onChange(parsed);
    }
  };

  return (
    <div className="quantity-adjuster">
      <button
        className="quantity-btn decrease"
        onClick={handleDecrease}
        disabled={quantity <= min}
      >
        -
      </button>
      <input
        type="number"
        className="quantity-input"
        value={quantity === "" ? "" : quantity}
        min={min}
        max={max}
        onChange={handleInputChange}
      />
      <button
        className="quantity-btn increase"
        onClick={handleIncrease}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
};
