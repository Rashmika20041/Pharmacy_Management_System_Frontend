import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from "./NavigationBar";
import ProductGrid from "./ProductGrid";
import { useProfile } from "../CustomerDashboard/ProfileContext";
import "./DashboardLayout.css";

const Dashboard = ({onAddToCart, onBuyNow }) => {
  const { profileImage } = useProfile();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/pharmacy/inventory/medicines')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        console.error("Failed to fetch inventory", err);
        setProducts([]);
      });
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        <img
          src={profileImage}
          alt="Profile"
          style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', position: 'absolute', top: 10, right: 10 }}
          onClick={handleProfileClick}
          title="View Profile"
        />
        <NavigationBar profileImage={profileImage} />
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