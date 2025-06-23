import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/Auth";

function AuthorForm({ conferenceName }) {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [paper, setPaper] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmittingMessage, setShowSubmittingMessage] = useState(false);
  const { acronym, id } = useParams();
  const [fetchedConferenceName, setFetchedConferenceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const fileInputRef = useRef(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [abstractWordCount, setAbstractWordCount] = useState(0);

  const removeFile = () => {
    setSelectedFile(null);
    setPaper(null);
    setComplianceReport(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [authors, setAuthors] = useState([
    {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      affiliation: "",
      webPage: "",
      corresponding: false,
    },
  ]);

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const response = await axios.get(
          `/api/conference/get-conference/${id}`
        );
        setFetchedConferenceName(response.data.conferenceName);
      } catch (error) {
        console.error("Error fetching conference:", error);
      }
    };

    fetchConference();
  }, [id]);

  useEffect(() => {
    if (auth?.user) {
      setAuthors([
        {
          firstName: "",
          lastName: "",
          email: auth?.user?.email || "",
          country: "",
          affiliation: "",
          webPage: "",
          corresponding: true,
        },
      ]);
      setLoading(false);
    }
  }, [auth]);

  const addAuthor = () => {
    if (authors.length >= 3) {
      toast.error("You can add up to 2 authors only.");
      return;
    }
    const newAuthors = [
      ...authors,
      {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        affiliation: "",
        webPage: "",
        corresponding: false,
      },
    ];
    setAuthors(newAuthors);
    console.log("Updated authors:", newAuthors); // Debugging
  };
  const removeAuthor = (index) => {
    if (index === 0) return; // Prevent removing the first author
    const updatedAuthors = authors.filter((_, i) => i !== index);
    setAuthors(updatedAuthors);
  };

  const handleInputChange = (index, event) => {
    const { name, value, checked } = event.target;
    const newAuthors = [...authors];
    newAuthors[index][name] = name === "corresponding" ? checked : value;
    setAuthors(newAuthors);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      setPaper(null);
      setSelectedFile(null);
      setComplianceReport(null);
      toast.error("Please upload a PDF file only.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    setPaper(file);
    setComplianceReport(null);
    setComplianceLoading(true);

    try {
      const formData = new FormData();
      formData.append("paper", file);

      const response = await axios.post(
        "/api/author/check-compliance",
        formData
      );
      setComplianceReport(response.data.complianceReport);
      toast.success("Compliance check completed.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error performing compliance check."
      );
    } finally {
      setComplianceLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const abstractWordCount = abstract.trim().split(/\s+/).length;
    if (abstractWordCount < 100 || abstractWordCount > 300) {
      toast.error("Abstract must be between 100 and 300 words.");
      return;
    }

    const titleWordCount = title.trim().split(/\s+/).length;
    if (titleWordCount < 3) {
      toast.error("Title must be at least 3 words.");
      return;
    }

    const keywordsArray = keywords.split(",").map((kw) => kw.trim());
    if (keywordsArray.length > 8) {
      toast.error("Keywords should not be more than 8.");
      return;
    }

    const validAuthor = authors.find(
      (author) => author.firstName && author.email
    );
    if (!validAuthor) {
      toast.error("At least one author must have mandatory details filled.");
      return;
    }

    const isInvalidRoleForSubmission = auth?.roles?.some(
      (role) =>
        ["organizer", "reviewer"].includes(role.role) &&
        role.conferenceId?.toString() === id?.toString()
    );
    if (isInvalidRoleForSubmission) {
      toast.error(
        "Paper submission is not allowed for organizers or reviewers"
      );
      return;
    }

    if (complianceReport && complianceReport.percentage < 60) {
      setShowModal(true);
      return;
    }

    await submitForm();
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setSubmissionStatus("Submitting...");
    setShowSubmittingMessage(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("keywords", keywords);
      formData.append("paper", paper);
      formData.append("authors", JSON.stringify(authors));
      formData.append("conferenceId", id);
      formData.append("conferenceAcronym", acronym);
      formData.append("conferenceName", fetchedConferenceName);
      formData.append("userId", auth?.user?._id);

      const response = await axios.post("/api/author/submit-paper", formData);

      setSubmissionStatus("Submission successful!");
      toast.success(response.data.message);

      // Reset form fields
      setTitle("");
      setAbstract("");
      setKeywords("");
      setPaper(null);
      setSelectedFile(null);
      setAuthors([
        {
          firstName: "",
          lastName: "",
          email: auth?.user?.email || "",
          country: "",
          affiliation: "",
          webPage: "",
          corresponding: true,
        },
      ]);
      setComplianceReport(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setSubmissionStatus("Submission failed due to an error.");
      toast.error(
        error.response?.data?.message || "Error while submitting your paper"
      );
    }
  };

  const handleModalConfirm = async () => {
    setShowModal(false);
    await submitForm();
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <Layout title={"Confizio - Submit paper"}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader">Loading....</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={"Confizio - Submit paper"}>
      <div className="flex flex-col items-center bg-gray-100 min-h-screen p-8">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            New Submission for {conferenceName || fetchedConferenceName}
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Follow the instructions, step by step, and then use the "Submit"
            button at the bottom of the form.
          </p>

          <form onSubmit={handleSubmit}>
            {authors.map((author, index) => (
              <div
                key={index}
                className="relative mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50"
              >
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                    title="Remove this author"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                    </svg>{" "}
                  </button>
                )}

                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Author {index + 1}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={author.firstName}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={author.lastName}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={author.email}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                      disabled={index === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="country"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={author.country}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Affiliation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="affiliation"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={author.affiliation}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Web page</label>
                    <input
                      type="url"
                      name="webPage"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={author.webPage}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="corresponding"
                    className="mr-2"
                    checked={index === 0}
                    onChange={(e) => handleInputChange(index, e)}
                    disabled={index === 0}
                  />
                  <label className="text-gray-700">Corresponding author</label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAuthor}
              className="w-full py-2 px-4 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-200 mb-6"
              // disabled={authors.length >= 3}
            >
              Add another author
            </button>

            <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h2 className="text-lg font-medium text-gray-700 mb-4">
                Title and Abstract
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="abstract"
                  rows="4"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={abstract}
                  onChange={(e) => {
                    setAbstract(e.target.value);
                    const words = e.target.value
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean);
                    setAbstractWordCount(words.length);
                  }}
                  required
                />
                <p
                  className={`text-sm mt-1 ${
                    abstractWordCount < 100
                      ? "text-yellow-600"
                      : abstractWordCount > 300
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {abstractWordCount} words –{" "}
                  {abstractWordCount < 100
                    ? `Add ${100 - abstractWordCount} more word(s)`
                    : abstractWordCount > 300
                    ? `Remove ${abstractWordCount - 300} word(s)`
                    : "Looks good!"}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Keywords <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="keywords"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  required
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
                    ref={fileInputRef}
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
            </div>
            {submissionStatus && (
              <p className="text-center text-gray-700 mb-4">
                {submissionStatus}
              </p>
            )}
            {complianceLoading && (
              <p className="text-center text-gray-700 mb-4">
                Checking compliance...
              </p>
            )}
            {complianceReport && (
              <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Compliance Report
                </h2>
                <p>Compliance Score: {complianceReport.percentage}%</p>
                <ul className="list-disc pl-5">
                  {complianceReport.details.map((detail, index) => (
                    <li key={index} className="mb-2">
                      <strong>{detail.rule}:</strong> {detail.message}
                      {detail.suggestion && (
                        <p className="text-red-600">
                          Suggestion: {detail.suggestion}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-accentAlt-dark ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Paper"}
            </button>
            {showSubmittingMessage && (
              <p className="text-primary text-center mt-2">
                Your paper is being submitted. Please wait...
              </p>
            )}
          </form>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border-l-4 border-red-600">
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
                    Compliance Warning
                  </h2>
                </div>

                <p className="text-gray-700 mb-6">
                  The{" "}
                  <span className="font-semibold text-red-600">
                    IEEE compliance report
                  </span>{" "}
                  of your paper is below{" "}
                  <span className="font-semibold">60%</span>. There is a high
                  risk of rejection. Please review your submission carefully
                  before proceeding.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleModalCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Submit Anyway
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AuthorForm;
