import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserManagement from "./user-management";
import BlogManagement from "./blog-management";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const isAdmin = localStorage.getItem("role") === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-gray-800 text-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
              }}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeTab === "blogs"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            Manage Blogs
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">User Management</h2>
              <UserManagement />
            </div>
          )}
          {activeTab === "blogs" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Management</h2>
              <BlogManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
