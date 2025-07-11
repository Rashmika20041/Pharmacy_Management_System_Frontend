import { useRef, useState, useEffect } from "react";
import "./DashboardContent.css";

const CLOUDINARY_UPLOAD_PRESET = "m0bxtsop";
const CLOUDINARY_CLOUD_NAME = "dtatrdtvo";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const DashboardContent = () => {
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    quantity: "",
    price: "",
    description: "",
    image: null,
    imagePreview: "",
    imageUrl: "",
  });
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef();

  useEffect(() => {
    fetch(`http://localhost:8080/pharmacy/inventory/medicines`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  // API: Add product
  const addProduct = async (inventory) => {
    const res = await fetch(
      `http://localhost:8080/pharmacy/inventory/medicines`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventory),
      }
    );
    return res.json();
  };

  // API: Update product
  const updateProduct = async (inventory) => {
    const res = await fetch(
      `http://localhost:8080/pharmacy/inventory/medicines`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventory),
      }
    );
    return res.json();
  };

  // API: Delete product
  const deleteProduct = async (productId) => {
    await fetch(
      `http://localhost:8080/pharmacy/inventory/medicines/${productId}`,
      {
        method: "DELETE",
      }
    );
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.secure_url || "",
      }));
    } catch (err) {
      alert("Image upload failed");
    }
    setUploading(false);
  };

  const handleImageBoxClick = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) {
      alert("Please wait for the image to finish uploading.");
      return;
    }
    const inventory = {
      productId: formData.productId,
      productName: formData.productName,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      description: formData.description,
      imageUrl: formData.imageUrl,
    };
    try {
      let savedProduct;
      if (editingId) {
        savedProduct = await updateProduct(inventory);
        setProducts(
          products.map((p) => (p.productId === editingId ? savedProduct : p))
        );
      } else {
        savedProduct = await addProduct(inventory);
        setProducts([...products, savedProduct]);
      }
      setFormData({
        productId: "",
        productName: "",
        quantity: "",
        price: "",
        description: "",
        image: null,
        imagePreview: "",
        imageUrl: "",
      });
      setEditingId(null);
    } catch (err) {
      alert("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      productId: product.productId,
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      description: product.description,
      image: null,
      imagePreview: product.imageUrl || "",
      imageUrl: product.imageUrl || "",
    });
    setEditingId(product.productId);
  };

  const handleDelete = async (productId) => {
    console.log("Trying to delete ID:", productId);
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p.productId !== productId));
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h2>Welcome to the Admin Dashboard</h2>
        <p>
          Manage your products here. Add, update, and remove products easily.
        </p>
      </div>

      <div className="product-form-container">
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Update Product" : "Add New Product"}</h3>
          <div className="form-group">
            <label>Product ID</label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              placeholder="Enter product ID"
              required
              disabled={!!editingId}
            />
          </div>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short product description"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Add Image</label>
            <div
              className={`image-upload-box${
                formData.imagePreview ? " has-image" : ""
              }`}
              onClick={handleImageBoxClick}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleImageBoxClick();
              }}
              role="button"
              aria-label="Add product image"
            >
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="product-image-preview"
                />
              ) : (
                <span className="image-placeholder-plus">
                  ＋<br />
                  Add Image
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
            {uploading && <div style={{ color: "#2196f3" }}>Uploading...</div>}
          </div>
          <button
            className="product-submit-btn"
            type="submit"
            disabled={uploading}
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="product-list-container">
        <h3>Product List</h3>
        {products.length === 0 ? (
          <p className="no-products">No products added yet.</p>
        ) : (
          <div className="admin-product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.productId}>
                <div className="product-image-box">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="product-card-image"
                    />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                <div className="product-card-details">
                  <h4>{product.productName}</h4>
                  <p className="product-desc">{product.description}</p>
                  <div className="card-info">
                    <span>Qty: {product.quantity}</span>
                    <span className="card-price">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="actions-row">
                    <button
                      className="update-btn"
                      onClick={() => handleEdit(product)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="product-delete-btn"
                      onClick={() => handleDelete(product.productId)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
