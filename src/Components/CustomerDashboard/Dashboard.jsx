import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import ProductGrid from "./ProductGrid";
import "./DashboardLayout.css";

const Dashboard = ({ onBuyNow }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/pharmacy/inventory/medicines")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => {
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

  useEffect(() => {
  if (user?.userId) {
    fetchCartAndSetCount();
  }
}, [user]);

function fetchCartAndSetCount() {
   if (!user?.userId) return;
  fetch("http://localhost:8081/api/pharmacy/order/viewCart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.userId }),
  })
    .then(res => res.json())
    .then(cartItems => setCartCount(cartItems.length))
    .catch(() => setCartCount(0));
}

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        <NavigationBar
          profileImage={
            user?.imgUrl ||
            "https://ui-avatars.com/api/?name=User&background=random&color=fff"
          }
          cartCount={cartCount}
        />
        <div className="dashboard-content">
          <ProductGrid
            products={products}
            userId={user?.userId}
            onAddToCart={fetchCartAndSetCount}
            onBuyNow={onBuyNow}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;