import React from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import UserSidebar from "../../components/UserSidebar";
import { useAuth } from "../../context/Auth";

function ConferenceCreationForm() {
  const [auth] = useAuth();

  // Initial form state
  const initialFormData = {
    conferenceName: "",
    acronym: "",
    webPage: "",
    mode: "",
    venue: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    abstractDeadline: "",
    submissionDeadline: "",
    primaryArea: "",
    secondaryArea: "",
    topics: ["", "", "", ""],
    expertise: [],
  };

  // State to manage form inputs
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "expertise"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };
  const validateRequiredFields = () => {
    const { conferenceName, acronym, startDate, endDate, mode } = formData;

    if (!conferenceName.trim()) {
      toast.error("Conference Name is required.");
      return false;
    }

    if (!acronym.trim()) {
      toast.error("Acronym is required.");
      return false;
    }

    if (!startDate || !endDate) {
      toast.error("Start and End dates are required.");
      return false;
    }

    if (!mode) {
      toast.error("Please select a Review Mode.");
      return false;
    }

    return true;
  };

  // Handle topics array
  const handleTopicChange = (index, value) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = value;
    setFormData({
      ...formData,
      topics: updatedTopics,
    });
  };

  // Validate date ranges
  const validateDates = () => {
    const { startDate, endDate, abstractDeadline, submissionDeadline } =
      formData;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const abstract = new Date(abstractDeadline);
    const submission = new Date(submissionDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time to midnight

    if (!startDate || !endDate || !abstractDeadline || !submissionDeadline) {
      toast.error("All date fields must be filled.");
      return false;
    }

    // Check if any date is in the past
    if (
      start < today ||
      end < today ||
      abstract < today ||
      submission < today
    ) {
      toast.error("Dates must not be in the past.");
      return false;
    }

    if (end < start) {
      toast.error("End date must be greater than start date.");
      return false;
    }

    if (abstract > end) {
      toast.error(
        "Abstract registration deadline must be before conference end date."
      );
      return false;
    }

    if (submission < start || submission > end) {
      toast.error("Submission deadline must lie between start and end date.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if all required fields are filled
    if (!validateRequiredFields()) {
      return;
    }
    // Validate dates before submission
    if (!validateDates()) {
      return;
    }
    try {
      const response = await axios.post("/api/conference/create-conference", {
        ...formData,
        userId: auth?.user?._id,
      });
      const { submissionLink } = response.data;
      toast.success(`Conference created Successfully`);

      // Reset form data to initial state
      setFormData(initialFormData);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <Layout title={"Confizio - Create Conference"}>
      <div className=" flex min-h-screen">
        <UserSidebar />
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 ">
            Submit Conference Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Conference Name and Acronym */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="conferenceName"
              >
                Conference Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="conferenceName"
                name="conferenceName"
                value={formData.conferenceName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter the full name of the conference"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="acronym"
              >
                Acronym <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="acronym"
                name="acronym"
                value={formData.acronym}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter the acronym"
                required
              />
            </div>
            {/* Conference Information */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="webPage"
              >
                Web Page
              </label>
              <input
                type="url"
                id="webPage"
                name="webPage"
                value={formData.webPage}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="venue"
              >
                Venue
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter venue"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="expertise"
              >
                Expertise Required (comma-separated)
              </label>
              <input
                type="text"
                id="expertise"
                name="expertise"
                value={formData.expertise.join(", ")} // Convert array back to string for display
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter required expertise (e.g., AI, ML, NLP)"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="city"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="country"
              >
                Country/Region
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter country or region"
              />
            </div>
            {/* Dates and Deadlines */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="startDate"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="endDate"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="abstractDeadline"
              >
                Abstract Registration Deadline
              </label>
              <input
                type="date"
                id="abstractDeadline"
                name="abstractDeadline"
                value={formData.abstractDeadline}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="submissionDeadline"
              >
                Submission Deadline
              </label>
              <input
                type="date"
                id="submissionDeadline"
                name="submissionDeadline"
                value={formData.submissionDeadline}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Review Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="single-blind"
                    checked={formData.mode === "single-blind"}
                    onChange={handleChange}
                  />
                  Single Blind
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="double-blind"
                    checked={formData.mode === "double-blind"}
                    onChange={handleChange}
                  />
                  Double Blind
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="no-blind"
                    checked={formData.mode === "no-blind"}
                    onChange={handleChange}
                  />
                  No Blind
                </label>
              </div>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Single-blind:</strong> Reviewer knows author's
                  identity, author does not know reviewer.
                </p>
                <p>
                  <strong>Double-blind:</strong> Neither author nor reviewer
                  knows each other’s identity.
                </p>
                <p>
                  <strong>No-blind:</strong> Both author and reviewer know each
                  other’s identity.
                </p>
              </div>
            </div>

            {/* Research Areas */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="primaryArea"
              >
                Primary Area
              </label>
              <input
                type="text"
                id="primaryArea"
                name="primaryArea"
                value={formData.primaryArea}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter primary research area"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-1"
                htmlFor="secondaryArea"
              >
                Secondary Area
              </label>
              <input
                type="text"
                id="secondaryArea"
                name="secondaryArea"
                value={formData.secondaryArea}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-gray-300"
                placeholder="Enter secondary research area"
              />
            </div>
            {/* Topics */}
            <div className="grid grid-cols-2 gap-4">
              {formData.topics.map((topic, index) => (
                <div key={index}>
                  <label className="block text-gray-700 font-medium mb-1">
                    Topic {index + 1}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    className="w-full p-2 border rounded-md border-gray-300"
                    placeholder={`Enter topic ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-1/2 bg-accent text-white py-2 rounded-md font-semibold hover:bg-accentAlt-dark focus:outline-none"
            >
              Submit Conference
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
export default ConferenceCreationForm;
