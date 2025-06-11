import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useLocation } from "react-router-dom";
import DonutChart from "../../components/DonutChart";

const ReviewDetails = () => {
  const [reviews, setReviews] = useState([]);
  const [paper, setPaper] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const paperId = query.get("paperId");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/organizer/reviews/${paperId}`);
        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch reviews.");
        setLoading(false);
      }
    };
    if (paperId) fetchReviews();
  }, [paperId]);

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/author/research-paper/${paperId}`
        );
        setPaper(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch papers.");
        setLoading(false);
      }
    };
    if (paperId) fetchPaperDetails();
  }, []);

  return (
    <Layout title={"Confizio - Reviews"}>
      <h2 className="text-4xl font-bold m-5 flex justify-center">
        {paper.conferenceName} ({paper.conferenceAcronym})
      </h2>
      <div className="p-6 bg-gray-50 space-y-6">
        {paper && (
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start flex-wrap gap-6">
              {/* Left: Paper Info */}
              <div className="flex-1 min-w-[250px]">
                <h3 className="text-2xl text-gray-700 font-semibold mb-2">
                  Paper: {paper.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  <span className="font-medium">Author(s):</span>{" "}
                  {paper.authors?.length > 0
                    ? paper.authors
                        .map(
                          (a) =>
                            `${a.firstName} ${a.lastName || ""} (${a.email})`
                        )
                        .join(", ")
                    : "N/A"}
                </p>
              </div>

              {/* Right: Donut Charts */}
              <div className="flex gap-10 items-center">
                {paper.complianceReport && (
                  <DonutChart
                    value={(paper.complianceReport?.percentage).toFixed(2) || 0}
                    label="IEEE Compliance"
                    color="#10b981" // green
                  />
                )}
                {paper.plagiarismReport && (
                  <DonutChart
                    value={(paper.plagiarismReport?.score).toFixed(2) || 0}
                    label="Plagiarism Score"
                    color="#ef4444" // red
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews (unchanged) */}
        <div>
          <h2 className="text-xl font-bold mb-4">Review Details</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-700">No reviews found for this paper.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 border rounded-lg shadow-sm bg-white"
                >
                  <h3 className="text-lg font-semibold">Reviewer:</h3>
                  <p className="text-gray-700">
                    Name: {review.reviewerId?.name || "N/A"}
                    <br />
                    Email: {review.reviewerId?.email || "N/A"}
                  </p>

                  <h4 className="mt-3 font-bold">Ratings:</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Originality: {review.originality}</li>
                    <li>Technical Quality: {review.technicalQuality}</li>
                    <li>Significance: {review.significance}</li>
                    <li>Clarity: {review.clarity}</li>
                    <li>Relevance: {review.relevance}</li>
                  </ul>

                  <p className="mt-3 text-gray-700">
                    <strong>Overall Recommendation:</strong>{" "}
                    {review.overallRecommendation}
                  </p>
                  <p className="mt-3 text-gray-700">
                    <strong>Technical confidence:</strong>{" "}
                    {review.technicalConfidence || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Comments for Authors:</strong>{" "}
                    {review.commentsForAuthors}
                  </p>
                  <p className="text-gray-700">
                    <strong>Comments for Organizers:</strong>{" "}
                    {review.commentsForOrganizers}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReviewDetails;
