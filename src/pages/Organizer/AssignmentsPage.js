import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [conferenceName, setConferenceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id: conferenceId } = useParams();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/organizer/assigned-papers/${conferenceId}`
        );
        const data = response.data.data;
        console.log("data", data);
        setConferenceName(data.conferenceName || "");
        setAssignments(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch assignments.");
      } finally {
        setLoading(false);
      }
    };

    if (conferenceId) fetchAssignments();
  }, [conferenceId]);

  // Group assignments by paper ID
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    const paperId = assignment.paperId?._id;
    if (!acc[paperId]) {
      acc[paperId] = {
        title: assignment.paperId?.title || "No title available",
        keywords: assignment.paperId?.keywords || [],
        authors: assignment.paperId?.authors || "Unknown",
        reviewers: [],
      };
    }
    acc[paperId].reviewers.push({
      name: assignment.reviewerId?.name || "Unknown",
      email: assignment.reviewerId?.email || "Unknown",
    });
    return acc;
  }, {});

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Paper Assignments
            </h1>
            <p className="text-sm text-gray-600">
              Conference Name:{" "}
              <span className="font-medium">{conferenceName}</span>
            </p>
            <p className="text-sm text-gray-600">
              Conference ID: <span className="font-medium">{conferenceId}</span>
            </p>
          </div>
          <div className="p-6">
            {loading && (
              <p className="text-center text-gray-600">
                Loading assignments...
              </p>
            )}
            {error && (
              <p className="text-center text-red-600 font-semibold">{error}</p>
            )}
            {!loading && !error && assignments.length === 0 && (
              <p className="text-center text-gray-600">
                No assignments found for this conference.
              </p>
            )}
            {!loading && assignments.length > 0 && (
              <div className="space-y-4">
                {Object.values(groupedAssignments).map((paper, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      {paper.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      <strong>Keywords:</strong>{" "}
                      {Array.isArray(paper.keywords)
                        ? paper.keywords.join(", ")
                        : "No keywords"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Authors:</strong> {paper.authors}
                    </p>
                    <div className="mt-4 text-gray-700">
                      <h3 className="font-medium">Reviewer Details:</h3>
                      {paper.reviewers.map((reviewer, i) => (
                        <div key={i} className="ml-4 mb-2">
                          <p>
                            <strong>Name:</strong> {reviewer.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {reviewer.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AssignmentsPage;
