import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";
import ProductGrid from "./ProductGrid";
import bgImage from "../Assets/dashboard.jpg";
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isBackHovered, setIsBackHovered] = useState(false);
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(
      `http://localhost:8080/api/pharmacy/inventory/medicines/search?productName=${encodeURIComponent(
        searchTerm
      )}`
    )
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "68px 90px",
      }}
    >
      <div
        className="profile-back-icon"
        onClick={() => navigate(-1)}
        onMouseEnter={() => setIsBackHovered(true)}
        onMouseLeave={() => setIsBackHovered(false)}
        style={{
          cursor: "pointer",
          position: "absolute",
          left: 20,
          right: 20,
          top: 30,
          fontSize: 50,
          zIndex: 5,
        }}
        title="Go back"
      >
        {isBackHovered ? <IoArrowBackCircle /> : <IoArrowBackCircleOutline />}
      </div>
      {!searchTerm && <div>Please enter a search term.</div>}
      {loading && <div>Loading...</div>}
      {!loading && results.length === 0 && (
        <div>No products found for "{searchTerm}"</div>
      )}
      {!loading && results.length > 0 && <ProductGrid products={results} />}
    </div>
  );
};

export default SearchResults;
