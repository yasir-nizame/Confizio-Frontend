import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

// PaperCard Component
const PaperCard = ({ paper, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Status and decision styling based on values
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "reviewed":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-purple-100 text-purple-800";
      case "resubmitted":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // Handle delete modal actions
  const handleDeleteConfirm = () => {
    onDelete(paper._id);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const getDecisionClass = (decision) => {
    switch (decision) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {paper.title}
      </h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {paper.keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
          >
            {keyword}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Submitted on: {new Date(paper.createdAt).toLocaleString()}
      </p>
      <div className="flex gap-2 mb-3">
        {paper.finaldecision === "pending" &&
          (paper.status === "resubmitted" && (
            <span
              className={`px-2 py-1 rounded text-sm ${getStatusClass(
                paper.status
              )}`}
            >
              Status: {paper.status}
            </span>
          ))}
        <span
          className={`px-2 py-1 rounded text-sm ${getDecisionClass(
            paper.finaldecision
          )}`}
        >
          Decision: {paper.finaldecision}
        </span>
      </div>
      <a
        href={paper.paperFilePath}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primaryAlt-dark hover:underline mb-4 block"
      >
        View Paper
      </a>
      <div className="flex gap-2 mb-4 relative group">
        {/* ✅ Show buttons only if not reviewed */}
        {paper.status !== "reviewed" &&
          paper.status !== "resubmitted" &&
          (paper.finaldecision === "pending" ||
            paper.finaldecision === "Modification Required") && (
            <>
              <a
                href={
                  paper.status === "assigned"
                    ? "#"
                    : `/userdashboard/update-paper?paperId=${paper._id}` +
                      (paper.finaldecision === "Modification Required"
                        ? "&resubmit=true"
                        : "")
                }
                onClick={(e) => {
                  if (paper.status === "assigned") e.preventDefault();
                }}
                className={`px-3 py-1 rounded-md text-white transition ${
                  paper.status === "assigned"
                    ? "bg-blue-200 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {paper.finaldecision === "Modification Required"
                  ? "Resubmit"
                  : "Edit"}
              </a>

              {paper.finaldecision !== "Modification Required" && (
                <button
                  onClick={() => {
                    if (paper.status !== "assigned") setShowDeleteModal(true);
                  }}
                  disabled={paper.status === "assigned"}
                  className={`px-3 py-1 rounded-md text-white transition ${
                    paper.status === "assigned"
                      ? "bg-red-200 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Delete
                </button>
              )}
            </>
          )}

        {/* 🧠 Tooltip for Assigned Status */}
        {paper.status === "assigned" && paper.finaldecision === "pending" && (
          <div className="absolute bottom-full left-0 mb-2 bg-red-100 border border-red-300 text-sm text-red-800 p-2 rounded-md w-max opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-20">
            <div className="flex items-start gap-1">
              <svg
                className="w-4 h-4 mt-0.5 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <span>
                <span className="font-semibold">Note:</span> This paper is
                assigned. You cannot edit or delete it.
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border-l-4 border-red-600">
            {/* Header with Warning Icon */}
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M12 5c.8 0 1.6.2 2.3.6.7.4 1.3 1 1.7 1.7.4.7.6 1.5.6 2.3s-.2 1.6-.6 2.3a4.98 4.98 0 01-1.7 1.7c-.7.4-1.5.6-2.3.6s-1.6-.2-2.3-.6a4.98 4.98 0 01-1.7-1.7c-.4-.7-.6-1.5-.6-2.3s.2-1.6.6-2.3a4.98 4.98 0 011.7-1.7c.7-.4 1.5-.6 2.3-.6z"
                />
              </svg>
              <h2 className="text-lg font-bold text-red-700">
                Confirm Deletion
              </h2>
            </div>

            {/* Warning Message */}
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the paper{" "}
              <span className="font-semibold text-red-600">
                "{paper.title}"
              </span>
              ? This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Details Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-primaryAlt-dark hover:underline"
      >
        {isExpanded ? "Less Details" : "More Details"}
      </button>

      {isExpanded && (
        <div className="mt-4 border-t pt-4 text-gray-700">
          <h4 className="font-semibold mb-1">Abstract</h4>
          <p className="mb-3">{paper.abstract}</p>

          <h4 className="font-semibold mb-1">Authors</h4>
          <ul className="list-disc pl-5 mb-3">
            {paper.authors.map((author, index) => (
              <li key={index}>
                {author.firstName} {author.lastName}
                {author.correspondingAuthor && " (Corresponding Author)"}
                <br />
                Email: {author.email}
                {author.affiliation && (
                  <>
                    <br />
                    Affiliation: {author.affiliation}
                  </>
                )}
                {author.country && (
                  <>
                    <br />
                    Country: {author.country}
                  </>
                )}
              </li>
            ))}
          </ul>

          <h4 className="font-semibold mb-1">Compliance Report</h4>
          <p>Percentage: {paper.complianceReport.percentage}%</p>
          {/* <ul className="list-disc pl-5 mb-3">
            {paper.complianceReport.details.map((detail, index) => (
              <li key={index}>
                <strong>Rule:</strong> {detail.rule}
                <br />
                <strong>Passed:</strong> {detail.passed ? "Yes" : "No"}
                <br />
                <strong>Message:</strong> {detail.message}
                <br />
                {detail.suggestion && (
                  <>
                    <strong>Suggestion:</strong> {detail.suggestion}
                    <br />
                  </>
                )}
              </li>
            ))}
          </ul> */}

          <h4 className="font-semibold mb-1">Reviews</h4>
          <ul className="list-disc pl-5 mb-3">
            {paper.reviews.map((review, index) => (
              <li key={index}>
                <strong>Reviewer:</strong>{" "}
                {review.reviewerId?.name || "Anonymous"} (
                {review.reviewerId?.email || "No email provided"})<br />
                {/* <strong>Originality:</strong> {review.originality}/10
                <br />
                <strong>Technical Quality:</strong> {review.technicalQuality}/10
                <br />
                <strong>Significance:</strong> {review.significance}/10
                <br />
                <strong>Clarity:</strong> {review.clarity}/10
                <br />
                <strong>Relevance:</strong> {review.relevance}/10
                <br /> */}
                {/* <strong>Recommendation:</strong> {review.overallRecommendation} */}
                <br />
                <strong>Technical Confidence:</strong>{" "}
                {review.technicalConfidence}/10
                <br />
                {review.commentsForAuthors && (
                  <>
                    <strong>Comments for Authors:</strong>{" "}
                    {review.commentsForAuthors}
                    <br />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Main Component
const AllPapersOfAuthor = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const conferenceId = queryParams.get("conferenceId");
  const conferenceName = queryParams.get("conferenceName");
  const [papers, setPapers] = useState([]);
  const [auth] = useAuth();
  const userId = auth.user._id;

  useEffect(() => {
    const fetchConferenceData = async () => {
      try {
        const response = await axios.get(
          `/api/author/${userId}/${conferenceId}/papers`
        );
        const data = response.data;
        setPapers(data.papers || []);
      } catch (error) {
        console.error("Error fetching conference data:", error);
      }
    };

    fetchConferenceData();
  }, [conferenceId, userId]);

  const handleDelete = async (paperId) => {
    try {
      await axios.delete(`/api/author/delete-paper/${paperId}/${conferenceId}`);
      setPapers((prevPapers) =>
        prevPapers.filter((paper) => paper._id !== paperId)
      );
      toast.success("Paper deleted successfully!");
      console.log(`Paper with ID: ${paperId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting paper:", error);
      toast.error("Failed to delete the paper. Please try again.");
    }
  };

  return (
    <Layout title={"Confizio - Submissions"}>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Title: <span className="text-primaryAlt-dark">{conferenceName}</span>
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Paper Submissions
        </h2>
        {papers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <PaperCard
                key={paper._id}
                paper={paper}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10 text-lg">
            No papers found for this conference.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllPapersOfAuthor;
