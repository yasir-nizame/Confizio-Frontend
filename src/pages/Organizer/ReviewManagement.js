import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const ReviewManagement = () => {
  const [tableData, setTableData] = useState([]);

  const { id: conferenceId } = useParams();
  const [conferenceName, setConferenceName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/organizer/review-management/${conferenceId}`
        );
        console.log("response,", response);
        setConferenceName(
          Array.isArray(response.data) && response.data.length > 0
            ? response.data[0].conferenceName || ""
            : ""
        );
        setTableData(response.data);
      } catch (error) {
        console.error("Error fetching review management data:", error);
      }
    };

    fetchData();
  }, [conferenceId]);

  const handleDecision = async (paperId, decision) => {
    try {
      const response = await axios.post("/api/organizer/update-decision", {
        paperId,
        decision,
      });

      if (response.data.message === "Decision updated successfully.") {
        toast.success("Paper decision updated successfully.");
        setTableData((prev) =>
          prev.map((paper) =>
            paper.paperId === paperId ? { ...paper, decision: decision } : paper
          )
        );
      } else {
        console.warn("Update decision response:", response.data.message);
        toast.error(
          response.data.message ||
            "Failed to update decision. Please try again."
        );
        // Refetch to ensure sync
        try {
          const fetchResponse = await axios.get(
            `/api/organizer/review-management/${conferenceId}`
          );
          setTableData(fetchResponse.data);
        } catch (fetchError) {
          console.error("Error refetching data:", fetchError);
          toast.error("Failed to refresh data.");
        }
      }
    } catch (error) {
      console.error("Error updating decision:", error);
      toast.error("Failed to update decision. Please try again.");
      try {
        const fetchResponse = await axios.get(
          `/api/organizer/review-management/${conferenceId}`
        );
        setTableData(fetchResponse.data);
      } catch (fetchError) {
        console.error("Error refetching data:", fetchError);
        toast.error("Failed to refresh data.");
      }
    }
  };
  return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Review Management</h1>
        <h1 className="text-xl font-bold mb-4">Conference: {conferenceName}</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border  border-gray-300">
            <thead>
              <tr className="bg-secondary/90 text-white ">
                <th className="border border-gray-300 p-2">S.No</th>
                <th className="border border-gray-300 p-2 ">Title</th>
                <th className="border border-gray-300 p-2">Authors</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Decision</th>
                <th className="border border-gray-300 p-2">Reviewers</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((paper, index) => (
                <tr key={paper.paperId} className="bg-white">
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {paper.title}
                    {paper.status === "resubmitted" && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Resubmitted
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {paper.authors.map((author, index) => (
                      <div key={index}>
                        <span className="font-semibold">{author.name}</span>
                        <br />
                        <span className="text-sm text-gray-600">
                          {author.email}
                        </span>
                      </div>
                    ))}
                  </td>

                  <td className="border border-gray-300 p-2 text-center">
                    {paper.overallstatus}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {paper.decision || "pending"}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {paper.reviewers.map((reviewer, index) => (
                      <div key={index} className="flex flex-col">
                        <span>{reviewer.name}</span>
                        <span
                          className={`text-sm ${
                            reviewer.status === "reviewed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {reviewer.status}
                        </span>
                        <span className="">{reviewer.recommendation}</span>
                        <Link
                          to={`/userdashboard/reviews?paperId=${encodeURIComponent(
                            paper.paperId
                          )}`}
                          className="text-primary rounded float-end underline"
                        >
                          Reviews
                        </Link>
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {/* {(!paper.decision ||
                      (paper.decision === "pending" &&
                        paper.status === "resubmitted")) && (
                      <div className="flex flex-col gap-2">
             
                        <p className="text-lg font-semibold w-full">
                          Average Technical Score: {paper.avgTechConfidence}
                        </p>
                        <p className="text-lg font-semibold w-full">
                          IEEE Compliance Score:{" "}
                          {paper.complianceScore != null
                            ? `${paper.complianceScore}%`
                            : "Not Available"}
                        </p>
                        <p className="text-lg font-semibold w-full">
                          Plagiarism Score:{" "}
                          {paper.plagiarismReport &&
                          paper.plagiarismReport.score != null
                            ? `${paper.plagiarismReport.score}%`
                            : "Not Available"}
                        </p>

                        <p className="text-md font-semibold w-full">
                          Recommendation:{" "}
                          <span
                            className={`${
                              paper.avgTechConfidence > 6
                                ? "text-green-600"
                                : paper.avgTechConfidence > 4
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {paper.avgTechConfidence > 6
                              ? "Accept"
                              : paper.avgTechConfidence > 4
                              ? "Modification Required"
                              : "Reject"}
                          </span>
                        </p>

         
                        <div className="flex gap-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() =>
                              handleDecision(paper.paperId, "Accepted")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() =>
                              handleDecision(paper.paperId, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>

                
                        {paper.status !== "resubmitted" && (
                          <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded w-max"
                            onClick={() =>
                              handleDecision(
                                paper.paperId,
                                "Modification Required"
                              )
                            }
                          >
                            Modifications Required
                          </button>
                        )}
                      </div>
                    )} */}
                    {(paper.decision === null ||
                      paper.decision === undefined ||
                      paper.decision === "pending") && (
                      <div className="flex flex-col gap-2 p-4">
                        {/* Scores and Recommendation */}
                        <p className="text-sm font-semibold w-full">
                          Average Technical Score: {paper.avgTechConfidence}
                        </p>
                        <p className="text-sm font-semibold w-full">
                          IEEE Compliance Score:{" "}
                          {paper.complianceScore != null
                            ? `${paper.complianceScore}%`
                            : "Not Available"}
                        </p>
                        <p className="text-sm font-semibold w-full">
                          Plagiarism Score:{" "}
                          {paper.plagiarismReport?.score != null
                            ? `${paper.plagiarismReport.score.toFixed(2)}%`
                            : "Not Available"}
                        </p>
                        <p className="text-sm font-semibold w-full">
                          AI Generated:{" "}
                          {paper.plagiarismReport?.isAIGenerated != null
                            ? `${paper.plagiarismReport.isAIGenerated}`
                            : "Not Available"}
                        </p>
                        <p className="text-sm font-semibold w-full">
                          Recommendation:{" "}
                          <span
                            className={`${
                              paper.avgTechConfidence > 6
                                ? "text-green-600"
                                : paper.avgTechConfidence > 4
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {paper.avgTechConfidence > 6
                              ? "Accept"
                              : paper.avgTechConfidence > 4
                              ? "Modification Required"
                              : "Reject"}
                          </span>
                        </p>

                        {/* Accept and Reject Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() =>
                              handleDecision(paper.paperId, "Accepted")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() =>
                              handleDecision(paper.paperId, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>

                        {/* Show Modifications Required only if NOT resubmitted */}
                        {paper.status !== "resubmitted" && (
                          <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded w-max"
                            onClick={() =>
                              handleDecision(
                                paper.paperId,
                                "Modification Required"
                              )
                            }
                          >
                            Modifications Required
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ReviewManagement;
