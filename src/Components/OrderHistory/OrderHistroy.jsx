import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline, IoArrowBackCircle } from "react-icons/io5";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`http://localhost:8081/pharmacy/order/history?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
      });
  }, [userId]);

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
          {isBackHovered ? <IoArrowBackCircle /> : <IoArrowBackCircleOutline />}
        </div>
        <h2 className="order-title">Order History</h2>
        <div className="order-table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Ordered Products</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order.orderId || index}>
                    <td>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="bold">{order.name || "-"}</td>
                    <td>{order.email || "-"}</td>
                    <td>
                      <span className="product-link">
                       {Array.isArray(order.productNames) ? order.productNames.join(", ") : "-"}
                      </span>
                    </td>
                    <td className="bold">
                      {order.totalAmount !== undefined &&
                      order.totalAmount !== null &&
                      !isNaN(Number(order.totalAmount))
                        ? `$${Number(order.totalAmount).toFixed(2)}`
                        : order.totalPrice !== undefined &&
                          order.totalPrice !== null &&
                          !isNaN(Number(order.totalPrice))
                        ? `$${Number(order.totalPrice).toFixed(2)}`
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
