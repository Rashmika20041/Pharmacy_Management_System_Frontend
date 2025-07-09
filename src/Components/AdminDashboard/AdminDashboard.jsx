import React, { useState } from "react";
import "./AdminDashboard.css";
import DashboardContent from "./DashboardContent";
import AddAdminForm from "./AddAdminForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav>
          <ul>
            <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li onClick={() => setActiveTab("addAdmin")}>Add Admins</li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        {activeTab === "dashboard" && <DashboardContent />}
        {activeTab === "addAdmin" && <AddAdminForm />}
      </main>
    </div>
  );
};

export default AdminDashboard;
