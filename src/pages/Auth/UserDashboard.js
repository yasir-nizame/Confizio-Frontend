import React from "react";
import Layout from "../../components/Layout";
import UserSidebar from "../../components/UserSidebar";

const UserDashboard = () => {
  return (
    <Layout>
      <div className="relative flex min-h-screen">
        {/* Background Image */}
        <img
          src="/user.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>

        {/* Sidebar */}
        <div className="lg:w-1/4 md:w-1/3 sm:w-full">
          <UserSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:px-8 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center">
            User Dashboard
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-200 max-w-md text-center">
            Welcome to the user dashboard. Manage all your settings, users, and content from one place.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
