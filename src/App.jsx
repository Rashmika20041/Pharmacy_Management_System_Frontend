import UserLoginForm from "./Components/LoginForm/UserLoginForm";
import AdminLoginForm from "./Components/LoginForm/AdminLoginForm";
import RegisterForm from "./Components/RegisterForm/RegisterForm";
import ProfileView from "./Components/ProfileView/ProfileView";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import NavigationBar from "./Components/CustomerDashboard/NavigationBar";
import ProductGrid from "./Components/CustomerDashboard/ProductGrid";
import Dashboard from "./Components/CustomerDashboard/Dashboard";
import { ProfileProvider } from "./Components/CustomerDashboard/ProfileContext";
import SearchResults from "./Components/CustomerDashboard/SearchResults";

function App() {
  const [cart, setCart] = useState([]);
  const [profileImage] = useState(localStorage.getItem("profileImage"));
  const handleAddToCart = (product) => setCart([...cart, product]);
  const handleBuyNow = (product) => alert(`Buying ${product.name} now!`);

  return (
    <Router>
      <ProfileProvider>
        <Routes>
          <Route path="/user" element={<UserLoginForm />} />
          <Route path="/admin" element={<AdminLoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/userDashboard"
            element={
              <Dashboard>
                <NavigationBar profileImage={profileImage} />
                <ProductGrid
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              </Dashboard>
            }
          />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="*" element={<Navigate to="/user" replace={true} />} />
        </Routes>
      </ProfileProvider>
    </Router>
  );
}

export default App;
