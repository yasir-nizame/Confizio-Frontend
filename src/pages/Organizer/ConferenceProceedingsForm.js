import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";

const ConferenceProceedingsForm = () => {
  const navigate = useNavigate();
  const { id: conferenceId } = useParams();

  const [formData, setFormData] = useState({
    proceedingsIntro: null,
  });
  const [errors, setErrors] = useState({});
  const [papers, setPapers] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [conferenceName, setConferenceName] = useState("");

  // Fetch accepted papers on mount
  useEffect(() => {
    if (!conferenceId) {
      setFetchError("Conference ID is missing");
      return;
    }

    const fetchPapers = async () => {
      try {
        const { data } = await axios.get(
          `/api/organizer/get-proceedings-data/${conferenceId}`
        );
        console.log("dataaa", data);
        setConferenceName(data.conferenceName || "");
        setPapers(data.papers || []);
      } catch (err) {
        setFetchError("Failed to load papers. Please try again.");
      }
    };

    fetchPapers();
  }, [conferenceId]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setErrors({ ...errors, [field]: "Only PDF files are allowed." });
      return;
    }
    setErrors({ ...errors, [field]: null });
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!conferenceId) {
      console.log("Conference ID is missing");
      return;
    }
    if (!formData.proceedingsIntro) {
      toast.error("Please upload a proceedings intro PDF");
      return;
    }

    try {
      const form = new FormData();
      form.append("proceedingsIntro", formData.proceedingsIntro);
      form.append("conferenceId", conferenceId);
      form.append("conferenceName", conferenceName);

      const { data } = await axios.post(
        `/api/organizer/upload-proceedings/${conferenceId}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Proceedings PDF uploaded and finalized!");
      navigate(
        `/view-proceedings/${encodeURIComponent(
          conferenceId
        )}/${encodeURIComponent(conferenceName)}`
      );
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error(
        "Failed to upload PDF: " +
          (error.response?.data?.error || "Unknown error")
      );
    }
  };

  return (
    <Layout title="Confizio - Proceedngs">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          {conferenceName || "Conference"} Proceedings
        </h1>

        {/* Accepted Papers Cards */}
        {fetchError ? (
          <p className="text-red-600 text-center mb-8">{fetchError}</p>
        ) : papers.length === 0 ? (
          <p className="text-gray-600 text-center mb-8">
            No accepted papers found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {papers.map((paper) => (
              <div
                key={paper._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {paper.title}
                </h2>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Authors:</p>
                  {paper.authors.map((author) => (
                    <div key={author._id} className="text-gray-600 mb-2">
                      <p>
                        <span className="font-medium">
                          {author.firstName} {author.lastName}
                        </span>
                      </p>
                      <p>{author.affiliation}</p>
                      <p>{author.country}</p>
                      <p className="text-blue-600">{author.email}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  <span className="font-medium">Abstract:</span>{" "}
                  {paper.abstract}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Upload Proceedings PDF
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proceedings Intro (PDF containing Title, Preface, Committees,
                Sponsors, and Table of Contents)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, "proceedingsIntro")}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.proceedingsIntro && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.proceedingsIntro}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={papers.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                papers.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-secondaryAlt-dark hover:bg-secondary"
              }`}
            >
              Upload and Finalize Proceedings
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ConferenceProceedingsForm;
