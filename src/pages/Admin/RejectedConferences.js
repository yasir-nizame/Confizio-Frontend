import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";


const RejectedConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rejected conferences from the backend
  useEffect(() => {
    const fetchRejectedConferences = async () => {
      try {
        const response = await axios.get(
          "/api/conference/rejected-conferences"
        );
        setConferences(response.data);
      } catch (error) {
        console.error("Error fetching rejected conferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedConferences();
  }, []);

  // Approve a rejected conference
  const approveConference = async (conferenceId) => {
    try {
      await axios.put(`/api/conference/approve/${conferenceId}`);
      // Remove the approved conference from the state
      setConferences(conferences.filter((conf) => conf._id !== conferenceId));
      toast.success("Conference approved successfully!"); // Success toast
    } catch (error) {
      console.error("Error approving conference:", error);
      toast.error("Error approving conference. Please try again."); // Error toast
    }
  };
  return (
    <Layout title={"Confizio - Rejected Conferences"}>
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Rejected Conferences</h1>

          {/* Loading message */}
          {loading ? (
            <p>Loading...</p>
          ) : conferences.length === 0 ? (
            <p>No rejected conferences found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-secondaryAlt-dark text-light">
                    <th className="py-2 px-4 border">Acronym</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Location</th>
                    <th className="py-2 px-4 border">Submission Deadline</th>
                    <th className="py-2 px-4 border">Start Date</th>
                    <th className="py-2 px-4 border">Topics</th>
                    <th className="py-2 px-4 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {conferences.map((conference) => (
                    <tr
                      key={conference._id}
                      className="text-center hover:bg-secondary hover:bg-opacity-20 transition-colors duration-300 py-2"
                    >
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
                      <td className="py-2 px-4 border">
                        <button
                          onClick={() => approveConference(conference._id)}
                          className="bg-green-500 text-white py-1 px-2 rounded"
                        >
                          Approve
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

export default RejectedConferences;
