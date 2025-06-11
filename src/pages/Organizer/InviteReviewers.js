import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";

const InviteReviewers = () => {
  const [emails, setEmails] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conferenceName, setConferenceName] = useState("");
  const [conferenceId, setConferenceId] = useState("");

  const location = useLocation();

  // Parse query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setConferenceName(queryParams.get("conferenceName") || "");
    setConferenceId(queryParams.get("conferenceId") || "");
  }, [location.search]);

  const handleInvite = async () => {
    if (!emails.trim()) {
      toast.error("Please provide at least one email.");
      return;
    }

    const emailList = emails.split(",").map((email) => email.trim());
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/email/invite-reviewers",
        {
          reviewerEmails: emailList,
          conferenceId,
          conferenceName,
          additionalMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Invitations sent successfully.");
      setEmails("");
      setAdditionalMessage("");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to send invitations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Confizio - Invite Reviewers">
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">
            Invite Reviewers
          </h1>

          <textarea
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Enter reviewer emails separated by commas"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          ></textarea>

          <textarea
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Add an additional message to reviewers (optional)"
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
          ></textarea>

          <button
            onClick={handleInvite}
            className={`w-1/4 py-2 text-white font-bold rounded ${
              loading ? "bg-gray-400" : "bg-accent hover:bg-accentAlt-dark"
            } transition-colors duration-300`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invitations"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default InviteReviewers;
