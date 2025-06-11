import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";

const ConferenceRequests = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending conferences from the backend
  useEffect(() => {
    const fetchPendingConferences = async () => {
      try {
        const response = await axios.get("/api/conference/pending");
        setConferences(response.data);
      } catch (error) {
        console.error("Error fetching pending conferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingConferences();
  }, []);
  // Handle Approve and Reject actions
  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/conference/approve/${id}`);
      setConferences(conferences.filter((conf) => conf._id !== id));
      toast.success("Conference approved successfully!"); // Success toast
    } catch (error) {
      console.error("Error approving conference:", error);
      toast.error("Error approving conference."); // Error toast
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/conference/reject/${id}`);
      setConferences(conferences.filter((conf) => conf._id !== id));
      toast.success("Conference rejected successfully!"); // Success toast
    } catch (error) {
      console.error("Error rejecting conference:", error);
      toast.error("Error rejecting conference."); // Error toast
    }
  };

  return (
    <Layout title={"Confizio - Conference Requests"}>
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">
            Pending Conference Requests
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : conferences.length === 0 ? (
            <p>No pending conference requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-secondaryAlt-dark text-light">
                    <th className="py-2 px-4 border">Acronym</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Location</th>
                    <th className="py-2 px-4 border">Deadline</th>
                    <th className="py-2 px-4 border">Start Date</th>
                    <th className="py-2 px-4 border">Topics</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conferences.map((conference, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border">{conference.acronym}</td>
                      <td className="py-2 px-4 border">
                        {conference.conferenceName}
                      </td>
                      <td className="py-2 px-4 border">
                        {conference.city}, {conference.country}
                      </td>
                      <td className="py-2 px-4 border">
                        {conference.submissionDeadline
                          ? conference.submissionDeadline.slice(0, 10)
                          : "-"}
                      </td>
                      <td className="py-2 px-4 border">
                        {conference.startDate
                          ? conference.startDate.slice(0, 10)
                          : "-"}
                      </td>
                      <td className="py-2 px-4 border">
                        {conference.topics && conference.topics.join(", ")}
                      </td>
                      <td className="py-2 px-4 border flex">
                        <button
                          onClick={() => handleApprove(conference._id)}
                          className="bg-green-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-green-600 mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(conference._id)}
                          className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ConferenceRequests;
