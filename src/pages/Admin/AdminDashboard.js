import React from "react";
import Sidebar from "../../components/AdminSidebar";
import Layout from "../../components/Layout";

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="relative flex min-h-screen">
        {/* Background Image */}
        <img
          src="/admin.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>

        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
          <h1 className="text-5xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-xl mb-10 text-gray-200 max-w-lg text-center">
            Welcome to the admin dashboard. Manage all your settings, users, and
            content from one place.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
