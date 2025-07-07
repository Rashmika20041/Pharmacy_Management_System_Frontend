import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";
import "./OrderHistory.css";

const dummyOrders = [
  {
    orderDate: "2024-06-01",
    name: "John Doe",
    email: "john@example.com",
    products: "Paracetamol, Ibuprofen",
    totalAmount: 25.5,
  },
  {
    orderDate: "2024-06-05",
    name: "Jane Smith",
    email: "jane@example.com",
    products: "Aspirin",
    totalAmount: 10.0,
  },
  {
    orderDate: "2024-06-05",
    name: "Jane Smith",
    email: "jane@example.com",
    products: "Aspirin",
    totalAmount: 10.0,
  },
  {
    orderDate: "2024-06-05",
    name: "Jane Smith",
    email: "jane@example.com",
    products: "Aspirin",
    totalAmount: 10.0,
  },
  {
    orderDate: "2024-06-05",
    name: "Jane Smith",
    email: "jane@example.com",
    products: "Aspirin",
    totalAmount: 10.0,
  },
];

const OrderHistory = () => {
     const [isBackHovered, setIsBackHovered] = useState(false);
    const navigate = useNavigate();


  return (
    <div className="order-history-background">
      <div className="order-container">
        <div
            className="orderHistory-back-btn"
            onClick={() => navigate(-1)}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              cursor: "pointer",
              position: "absolute",
              left: -10,
              top: 0,
              fontSize: 40,
              zIndex: 10,
            }}
            title="Go back"
          >
            {isBackHovered ? (
              <IoArrowBackCircle />
            ) : (
              <IoArrowBackCircleOutline />
            )}
          </div>
        <h2 className="order-title">Order History</h2>
        <div className="order-table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>📅 Order Date</th>
                <th>👤 Name</th>
                <th>📧 Email</th>
                <th>🛒 Ordered Products</th>
                <th>💰 Total</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderDate}</td>
                  <td className="bold">{order.name}</td>
                  <td>{order.email}</td>
                  <td>
                    <span className="product-link">{order.products}</span>
                  </td>
                  <td className="bold">${order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
