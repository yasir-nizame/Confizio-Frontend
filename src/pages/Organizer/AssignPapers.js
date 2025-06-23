import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";

const AssignPapersPage = () => {
  const [conferenceName, setConferenceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [papers, setPapers] = useState([]);
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [availableReviewers, setAvailableReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [assignedReviewersCount, setAssignedReviewersCount] = useState(0);
  const [assignedReviewers, setAssignedReviewers] = useState([]);
  const [assignmentsByPaper, setAssignmentsByPaper] = useState({});

  const { id: conferenceId } = useParams();

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const response = await axios.get(
          `/api/conference/get-conference/${conferenceId}`
        );
        const conference = response.data;
        setConferenceName(conference.conferenceName);
        setPapers(conference.papers || []);
      } catch (error) {
        console.error("Error fetching conference data:", error);
      }
    };

    if (conferenceId) {
      fetchConference();
    }
  }, [conferenceId]);

  const handleAssignPapers = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!conferenceId) {
      setErrorMessage("Conference ID is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `/api/organizer/assign-papers/${conferenceId}`,
        {
          conferenceId,
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        // Update assignmentsByPaper with new assignments from API
        if (response.data.assignmentsByPaper) {
          setAssignmentsByPaper((prev) => ({
            ...prev,
            ...response.data.assignmentsByPaper,
          }));
        }
        // Update paper status to 'assigned' for affected papers
        setPapers((prevPapers) =>
          prevPapers.map((paper) =>
            paper.status === "pending" &&
            response.data.assignmentsByPaper?.[paper._id]
              ? { ...paper, status: "assigned" }
              : paper
          )
        );
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      console.error("Error assigning papers:", error);
      setErrorMessage(
        error.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!conferenceId) return;
    const fetchConferenceData = async () => {
      try {
        // Fetch conference details, including populated papers
        const response = await axios.get(
          `/api/conference/get-conference/${conferenceId}`
        );
        const conference = response.data;

        setConferenceName(conference.conferenceName);
        setPapers(conference.papers || []); // Papers are already populated
      } catch (error) {
        console.error("Error fetching conference data:", error);
      }
    };

    fetchConferenceData();
  }, [conferenceId]);

  const handleGetAssignmentsForAllPapers = async () => {
    if (papers.length === 0) {
      toast.error("No papers available.");
      return;
    }

    const paperIds = papers.map((paper) => paper._id);

    try {
      const response = await axios.post(
        "/api/organizer/papers/assigned-reviewers",
        {
          paperIds, // Send an array of paper IDs
        }
      );
      setAssignmentsByPaper(response.data.assignmentsByPaper || {});
      // toast.success("Fetched assignments successfully.");
    } catch (error) {
      console.error("Error fetching assignments:", error);
      // toast.error("Failed to fetch assignments.");
    }
  };

  useEffect(() => {
    if (papers.length > 0) {
      handleGetAssignmentsForAllPapers();
    }
  }, [papers]);

  const handleManualAssignClick = async (paperId) => {
    setSelectedPaperId(paperId);
    try {
      const response = await axios.get(
        `/api/reviewer/${conferenceId}/reviewers`
      );

      setAvailableReviewers(response.data.data || []);
      // Fetch assigned reviewers count for this paper
      const assignmentResponse = await axios.get(
        `/api/organizer/paper/${paperId}/assigned-reviewers`
      );
      setAssignedReviewersCount(assignmentResponse.data.assignedCount);
      setAssignedReviewers(assignmentResponse.data.assignedReviewers || []); // Store assigned reviewers
    } catch (error) {
      console.error("Error fetching reviewers:", error);
    }
  };

  const handleManualAssignSubmit = async () => {
    if (assignedReviewersCount >= 3) {
      toast.error("A paper cannot have more than 3 reviewers.");
      return;
    }
    if (!selectedReviewer || selectedReviewer.trim() === "") {
      toast.error("Please select a reviewer.");
      return;
    }

    try {
      const response = await axios.post("/api/organizer/assign-paper-manual", {
        paperId: selectedPaperId,
        reviewerId: selectedReviewer,
        conferenceId: conferenceId,
      });
      if (response.data.success) {
        toast.success("Paper assigned successfully!");
        setAssignedReviewersCount((prevCount) => prevCount + 1);
        setAssignedReviewers((prev) => [...prev, selectedReviewer]);

        // Update assignmentsByPaper to reflect the new assignment
        setAssignmentsByPaper((prev) => ({
          ...prev,
          [selectedPaperId]: {
            assignedCount: (prev[selectedPaperId]?.assignedCount || 0) + 1,
            reviewers: [
              ...(prev[selectedPaperId]?.reviewers || []),
              availableReviewers.find((r) => r.userId._id === selectedReviewer)
                ?.userId,
            ].filter(Boolean),
          },
        }));

        setSelectedPaperId(null);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error assigning paper:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            {conferenceName || "Conference"}
          </h1>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Assign Papers to Reviewers
          </h1>

          <div className="mb-4">
            <label
              htmlFor="conferenceId"
              className="block text-sm font-medium text-gray-700 "
            >
              Conference ID
            </label>
            <input
              type="text"
              id="conferenceId"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              value={conferenceId}
              readOnly
            />
          </div>

          <button
            onClick={handleAssignPapers}
            className={`w-full bg-primary hover:bg-primaryAlt-dark text-white font-bold py-2 px-4 rounded ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Assigning..." : "Assign Papers Automatically"}
          </button>

          {successMessage && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-secondaryAlt-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  S.No
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Title
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Keywords
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Authors
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Submission Time
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Assigned to reviewers
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Paper (File)
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Manual Assignment
                </th>
              </tr>
            </thead>
            <tbody>
              {papers.filter((paper) => paper.finaldecision === "pending")
                .length > 0 ? (
                papers
                  .filter((paper) => paper.finaldecision === "pending")
                  .map((paper, index) => (
                    <tr
                      key={paper._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-secondary hover:bg-opacity-20 transition-colors duration-300 ease-in-out`}
                    >
                      <td className="border-b px-6 py-3 text-center text-gray-800">
                        {index + 1}
                      </td>
                      <td className="border-b px-6 py-3 text-gray-800">
                        {paper.title}
                      </td>
                      <td className="border-b px-6 py-3 text-gray-600">
                        {paper.keywords.join(", ")}
                      </td>
                      <td className="border-b px-6 py-3 text-gray-600">
                        {paper.authors.map((author, i) => (
                          <div key={i} className="text-sm">
                            {author.firstName}{" "}
                            <span className="text-primaryAlt-dark">
                              ({author.email})
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="border-b px-6 py-3 text-center text-gray-600">
                        {new Date(paper.createdAt).toLocaleString()}
                      </td>
                      <td className="border-b px-6 py-3 text-gray-800">
                        {paper.status}
                      </td>
                      <td className="border-b px-6 py-3 text-gray-800">
                        {assignmentsByPaper[paper._id]?.assignedCount || "0"}/3
                      </td>
                      <td className="border-b px-6 py-3 text-center">
                        <a
                          href={paper.paperFilePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primaryAlt-dark hover:underline"
                        >
                          View Paper
                        </a>
                      </td>
                      {/* Show "Assign Manually" button only if paper status is "PENDING" */}
                      {/* <td className="border-b px-6 py-3 text-center">
                      {paper?.status?.toLowerCase().trim() === "pending" ? (
                        <button
                          onClick={() => handleManualAssignClick(paper._id)}
                          className="bg-secondary text-white px-2 py-2 rounded hover:bg-secondaryAlt-dark"
                        >
                          Assign Manually
                        </button>
                      ) : (
                        "-"
                      )}
                    </td> */}
                      <td className="border-b px-6 py-3 text-center">
                        {(assignmentsByPaper[paper._id]?.assignedCount ?? 0) <
                        3 ? (
                          <button
                            onClick={() => handleManualAssignClick(paper._id)}
                            className="bg-secondary text-white px-2 py-2 rounded hover:bg-secondaryAlt-dark"
                          >
                            Assign Manually
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border px-6 py-4 text-center text-gray-600"
                  >
                    No papers found for this conference.
                  </td>
                </tr>
              )}
            </tbody>
            {papers.filter((paper) => paper.finaldecision === "pending")
              .length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No papers with pending final decision.
                </td>
              </tr>
            )}
          </table>
          {selectedPaperId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  Assign Paper Manually
                </h2>
                <select
                  value={selectedReviewer}
                  onChange={(e) => setSelectedReviewer(e.target.value)}
                  className="border p-2 w-full rounded"
                >
                  <option value="">Select a Reviewer</option>
                  {availableReviewers.map((reviewer) => (
                    // <option
                    //   key={reviewer.userId._id}
                    //   value={reviewer.userId._id}
                    // >
                    //   {reviewer.userId?.name || "Unknown"} (
                    //   {reviewer.userId?.email || "No Email"})
                    // </option>
                    <option
                      key={reviewer.userId._id}
                      value={reviewer.userId._id}
                      // disabled={assignedReviewers.includes(reviewer.userId._id)} // Disable if already assigned
                    >
                      {reviewer.userId.name} ({reviewer.name}{" "}
                      {assignedReviewers.includes(reviewer._id)
                        ? "(Assigned)"
                        : ""}
                      {reviewer.userId?.email || "No Email"})
                      {assignedReviewers.includes(reviewer.userId._id)
                        ? "(Assigned)"
                        : ""}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setSelectedPaperId(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleManualAssignSubmit}
                    className="bg-secondary  hover:bg-secondaryAlt-dark  text-white px-4 py-2 rounded"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default AssignPapersPage;
