import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    originality: 1,
    technicalQuality: 1,
    significance: 1,
    clarity: 1,
    relevance: 1,
    overallRecommendation: "",
    commentsForAuthors: "",
    commentsForOrganizers: "",
  });

  const [paper, setPaper] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [title, setTitle] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reviewer = queryParams.get("reviewerId") || "";
    const paper = queryParams.get("paperId") || "";
    const title = queryParams.get("title") || "";

    setPaper(paper);
    setReviewer(reviewer);
    setTitle(title);
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderRadioButtons = (name) => (
    <div className="flex justify-between gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
        <div key={score} className="flex flex-col items-center">
          <label className="text-xs text-gray-500">{score}</label>
          <input
            type="radio"
            name={name}
            value={score}
            checked={Number(formData[name]) === score}
            onChange={handleChange}
            className="w-4 h-4 secondaryAlt-light"
          />
        </div>
      ))}
    </div>
  );

  const validateForm = () => {
    if (!formData.overallRecommendation) {
      toast.error("Please select an overall recommendation.");
      return false;
    }
    if (!formData.commentsForAuthors.trim()) {
      toast.error("Comments for authors are required.");
      return false;
    }
    if (!formData.commentsForOrganizers.trim()) {
      toast.error("Comments for organizers are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("/api/reviewer/submit-reviewform", {
        ...formData,
        paperId: paper,
        reviewerId: reviewer,
      });
      toast.success(response.data.message || "Review submitted successfully!");

      setFormData({
        originality: 1,
        technicalQuality: 1,
        significance: 1,
        clarity: 1,
        relevance: 1,
        overallRecommendation: "",
        commentsForAuthors: "",
        commentsForOrganizers: "",
      });

      navigate("/userdashboard/all-assigned-papers");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <Layout title={"Confizio - Review Form"}>
      <form
        className="bg-white p-6 rounded-lg my-8 shadow-md space-y-6 max-w-3xl mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Review Form</h2>
        <h4 className="text-lg font-bold mb-4 text-left">Title: {title}</h4>

        <div className="space-y-2">
          {[
            { name: "originality", label: "Originality" },
            { name: "technicalQuality", label: "Technical Quality" },
            { name: "significance", label: "Significance" },
            { name: "clarity", label: "Clarity" },
            { name: "relevance", label: "Relevance" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block font-medium mb-2">{label}</label>
              <div className="bg-gray-100 p-3 rounded-lg">
                {renderRadioButtons(name)}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium mb-2">
            Overall Recommendation
          </label>
          <div className="flex items-center justify-around bg-gray-100 p-3 rounded-lg">
            {["Accept", "Accept with minor correction", "Reject"].map(
              (option) => (
                <label key={option} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name="overallRecommendation"
                    value={option}
                    checked={formData.overallRecommendation === option}
                    onChange={handleChange}
                    className="w-4 h-4 mb-1"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Comments for Authors</label>
          <textarea
            name="commentsForAuthors"
            value={formData.commentsForAuthors}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary"
            placeholder="Enter comments for authors"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Comments for Organizers
          </label>
          <textarea
            name="commentsForOrganizers"
            value={formData.commentsForOrganizers}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary"
            placeholder="Enter comments for organizers"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-accent text-white font-medium py-2 px-6 rounded-lg hover:bg-accentAlt-dark"
          >
            Submit Review
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default ReviewForm;
