import React from "react";
import ReviewerSidebar from "../../components/ReviewerSidebar";
import Layout from "../../components/Layout";

const ReviewerDashboard = () => {
  return (
    <Layout title={"Confizio - Reviewer Dashboard"} t>
      <div className="relative flex min-h-screen">
        {/* Background Image */}
        <img
          src="/reviewer.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>

        {/* Sidebar */}
        <ReviewerSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
          <h1 className="text-5xl font-bold mb-6">Reviewer Dashboard</h1>
          <p className="text-xl mb-10 text-gray-200 max-w-lg text-center">
            Welcome to the Reviewer dashboard. Manage all your conferences from
            one place.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewerDashboard;
