import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/Auth";

const UpdatePaper = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const paperId = queryParams.get("paperId");
  const isResubmit = queryParams.get("resubmit") === "true";
  const [selectedFile, setSelectedFile] = useState(null);

  const removeFile = () => {
    setSelectedFile(null);
    document.getElementById("file").value = ""; // Reset file input
  };

  const [paperDetails, setPaperDetails] = useState({
    title: "",
    abstract: "",
    keywords: "",
    conferenceName: "",
    conferenceAcronym: "",
    authors: [],
    file: null,
  });

  const [initialPaperDetails, setInitialPaperDetails] = useState({
    title: "",
    abstract: "",
    keywords: "",
    conferenceName: "",
    conferenceAcronym: "",
    authors: [],
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const response = await axios.get(
          `/api/author/research-paper/${paperId}`
        );
        setPaperDetails({
          title: response.data.data.title || "",
          abstract: response.data.data.abstract || "",
          keywords: response.data.data.keywords?.join(", ") || "",
          conferenceName: response.data.data.conferenceName || "",
          conferenceAcronym: response.data.data.conferenceAcronym || "",
          authors: response.data.data.authors || [],
        });

        setInitialPaperDetails({
          title: response.data.data.title || "",
          abstract: response.data.data.abstract || "",
          keywords: response.data.data.keywords?.join(", ") || "",
          conferenceName: response.data.data.conferenceName || "",
          conferenceAcronym: response.data.data.conferenceAcronym || "",
          authors: response.data.data.authors || [],
          file: response.data.data.file || null,
        });
      } catch (error) {
        setError("Failed to fetch paper details");
        console.error(error);
      }
    };

    if (paperId) {
      fetchPaperDetails();
    }
  }, [paperId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaperDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAuthorsChange = (e, index) => {
    const updatedAuthors = [...paperDetails.authors];
    updatedAuthors[index][e.target.name] = e.target.value;
    setPaperDetails({ ...paperDetails, authors: updatedAuthors });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPaperDetails({ ...paperDetails, file: e.target.files[0] });
    setSelectedFile(file); // <-- this is what was missing
  };

  const getChangedData = () => {
    const changedData = {};
    if (paperDetails.title !== initialPaperDetails.title)
      changedData.title = paperDetails.title;
    if (paperDetails.abstract !== initialPaperDetails.abstract)
      changedData.abstract = paperDetails.abstract;
    if (paperDetails.keywords !== initialPaperDetails.keywords)
      changedData.keywords = paperDetails.keywords;
    if (paperDetails.conferenceName !== initialPaperDetails.conferenceName)
      changedData.conferenceName = paperDetails.conferenceName;
    if (
      paperDetails.conferenceAcronym !== initialPaperDetails.conferenceAcronym
    )
      changedData.conferenceAcronym = paperDetails.conferenceAcronym;
    if (
      JSON.stringify(paperDetails.authors) !==
      JSON.stringify(initialPaperDetails.authors)
    )
      changedData.authors = paperDetails.authors;
    if (paperDetails.file !== initialPaperDetails.file)
      changedData.file = paperDetails.file;
    return changedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const changedData = getChangedData();

    if (Object.keys(changedData).length > 0) {
      const formData = new FormData();
      Object.entries(changedData).forEach(([key, value]) => {
        if (key === "authors") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "file") {
          formData.append("paper", value); // Use "paper" to match backend multer config
        } else {
          formData.append(key, value);
        }
      });
      formData.append("userId", auth?.user?.id);
      formData.append("isResubmit", isResubmit);

      try {
        const response = await axios.put(
          `/api/author/update-paper-details/${paperId}`,
          formData
        );

        toast.success("Paper updated successfully!");
        navigate("/userdashboard/author-dashboard");
      } catch (error) {
        toast.error("Error updating paper");
        console.error("Update Error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("No changes detected.");
      setLoading(false);
    }
  };

  return (
    <Layout title={"Confizio - Update Paper"}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Paper</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={paperDetails.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="abstract"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Abstract
              </label>
              <textarea
                id="abstract"
                name="abstract"
                value={paperDetails.abstract}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y"
                rows="5"
                required
              />
            </div>

            <div>
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Keywords
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={paperDetails.keywords}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="conferenceName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Conference Name
              </label>
              <input
                type="text"
                id="conferenceName"
                name="conferenceName"
                value={paperDetails.conferenceName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                required
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="conferenceAcronym"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Conference Acronym
              </label>
              <input
                type="text"
                id="conferenceAcronym"
                name="conferenceAcronym"
                value={paperDetails.conferenceAcronym}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                required
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Paper (PDF)
              </label>

              <div className="relative">
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-50 file:text-primary hover:file:bg-gray-100 transition duration-200 file:border-primary"
                />

                {selectedFile && (
                  <div className="flex items-center space-x-2 bg-white px-2 py-1 mt-2 rounded">
                    <span className="text-sm text-gray-700 truncate">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-800"
                      title="Remove file"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-accent text-white px-6 py-2 rounded-md hover:bg-accentAlt-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition duration-200 disabled:bg-accent"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Paper"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdatePaper;
