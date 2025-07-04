import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from "./NavigationBar";
import ProductGrid from "./ProductGrid";
import "./DashboardLayout.css";

const Dashboard = ({ onAddToCart, onBuyNow }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/pharmacy/inventory/medicines')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        console.error("Failed to fetch inventory", err);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch("http://localhost:8083/api/pharmacy/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        <NavigationBar profileImage={user?.imgUrl || "https://ui-avatars.com/api/?name=User&background=random&color=fff"} />
        <div className="dashboard-content">
          <ProductGrid
            products={products}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;