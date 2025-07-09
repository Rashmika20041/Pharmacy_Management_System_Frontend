import UserLoginForm from "./Components/LoginForm/UserLoginForm";
import AdminLoginForm from "./Components/LoginForm/AdminLoginForm";
import RegisterForm from "./Components/RegisterForm/RegisterForm";
import ProfileView from "./Components/ProfileView/ProfileView";
import CartForm from "./Components/CartForm/CartForm";
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
import SearchResults from "./Components/CustomerDashboard/SearchResults";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./Components/LoginForm/ProtectedRoute";
import CheckoutForm from "./Components/CheckoutForm/CheckoutForm";
import OrderHistory from "./Components/OrderHistory/OrderHistroy";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";


function App() {
  const [cart, setCart] = useState([]);
  const handleAddToCart = (product) => setCart([...cart, product]);
  const handleBuyNow = (product) => alert(`Buying ${product.name} now!`);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/user" element={<UserLoginForm />} />
          <Route path="/admin" element={<AdminLoginForm />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userDashboard"
            element={
              <ProtectedRoute>
                <Dashboard>
                  <NavigationBar />
                  <ProductGrid
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                </Dashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartForm />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutForm />
            </ProtectedRoute>
          } />
          <Route path="/orderHistory" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/user" replace={true} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
