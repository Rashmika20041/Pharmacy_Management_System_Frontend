import "./Product.css";

const Product = ({ product, onAddToCart, onBuyNow }) => {
  if (!product) {
    return <div className="product-layer">Product not found</div>;
  }
  return (
    <div className="product-layer">
      <img src={product.imageUrl || product.image} className="product-image" />
      <div className="product-name">{product.name || product.productName}</div>
      <div className="product-description">{product.description}</div>
      <div className="product-price">${product.price}</div>
      <div className="product-buttons">
        <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        <button onClick={() => onBuyNow(product)}>Buy Now</button>
      </div>
    </div>
  );
};

export default Product;
