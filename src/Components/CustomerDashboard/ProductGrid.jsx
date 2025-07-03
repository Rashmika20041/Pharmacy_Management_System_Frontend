import Product from "./Product";
import "./ProductGrid.css";


const ProductGrid = ({ products = [], onAddToCart, onBuyNow }) => {
  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="product-grid">
      {safeProducts.map(product => (
        <Product
          key={product.id || product.productId}
          product={product}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />
      ))}
    </div>
  );
};

export default ProductGrid;