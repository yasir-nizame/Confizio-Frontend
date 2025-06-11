import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import ConfirmationModal from "../../components/ConfirmationModal"; // Import the modal
import { useForm } from "react-hook-form";
import ConfirmationModal from "../../components/ConfirmationModal";
import Sidebar from "../../components/AdminSidebar";

const UpdateConference = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm(); // React Hook Form

  // Fetch all conferences
  const fetchConferences = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/conference/all-conferences");
      setConferences(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching conferences.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single conference details
  const getSingleConference = async (id) => {
    try {
      const { data } = await axios.get(`/api/conference/get-conference/${id}`);
      const conference = data;
      setValue("conferenceName", conference.conferenceName);
      setValue("acronym", conference.acronym);
      setValue("webPage", conference.webPage);
      setValue("venue", conference.venue);
      setValue("city", conference.city);
      setValue("country", conference.country);
      setValue("startDate", conference.startDate.split("T")[0]); // Adjusting date format
      setValue("endDate", conference.endDate.split("T")[0]);
      setValue("abstractDeadline", conference.abstractDeadline);
      setValue("submissionDeadline", conference.submissionDeadline);
      setValue("primaryArea", conference.primaryArea);
      setValue("secondaryArea", conference.secondaryArea);
      setValue("topics", conference.topics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConferences();
    // eslint-disable-next-line
  }, []);

  // Handle conference selection
  const handleConferenceChange = (e) => {
    const id = e.target.value;
    setSelectedConferenceId(id);
    if (id) {
      getSingleConference(id);
    } else {
      // Clear form if no conference is selected
      setValue("conferenceName", "");
      setValue("acronym", "");
      setValue("webPage", "");
      setValue("venue", "");
      setValue("city", "");
      setValue("country", "");
      setValue("startDate", "");
      setValue("endDate", "");
      setValue("abstractDeadline", "");
      setValue("submissionDeadline", "");
      setValue("primaryArea", "");
      setValue("secondaryArea", "");
      setValue("topics", "");
    }
  };

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      const { data } = await axios.put(
        `/api/conference/update-conference/${selectedConferenceId}`,
        formData
      );
      if (data?.success) {
        toast.success("Conference updated successfully.");
        navigate("/all-conferences");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    setIsModalVisible(true); // Show modal on delete button click
  };

  const confirmDelete = async () => {
    try {
      setIsModalVisible(false); // Close modal
      const { data } = await axios.delete(
        `/api/conference/delete-conference/${selectedConferenceId}`
      );
      toast.success("Conference deleted successfully.");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false); // Close modal without deleting
  };

  return (
    <Layout title={"Dashboard - Update Conference"}>
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="container mx-auto p-6 ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-3">
              <h1 className="text-2xl font-bold mb-6">Update Conference</h1>

              {/* Dropdown for selecting conference */}
              <div className="mb-6 ">
                <select
                  onChange={handleConferenceChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select a conference</option>
                  {conferences.map((conference) => (
                    <option key={conference._id} value={conference._id}>
                      {conference.conferenceName}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Conference Name */}
                <div>
                  <input
                    type="text"
                    {...register("conferenceName")}
                    placeholder="Conference Name"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Acronym */}
                <div>
                  <input
                    type="text"
                    {...register("acronym")}
                    placeholder="Acronym"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Web Page */}
                <div>
                  <input
                    type="text"
                    {...register("webPage")}
                    placeholder="Web Page URL"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Venue */}
                <div>
                  <input
                    type="text"
                    {...register("venue")}
                    placeholder="Venue"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    {...register("city")}
                    placeholder="City"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Country */}
                <div>
                  <input
                    type="text"
                    {...register("country")}
                    placeholder="Country"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <input
                    type="date"
                    {...register("startDate")}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* End Date */}
                <div>
                  <input
                    type="date"
                    {...register("endDate")}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Abstract Deadline */}
                <div>
                  <input
                    type="date"
                    {...register("abstractDeadline")}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Submission Deadline */}
                <div>
                  <input
                    type="date"
                    {...register("submissionDeadline")}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Primary Area */}
                <div>
                  <input
                    type="text"
                    {...register("primaryArea")}
                    placeholder="Primary Area"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Secondary Area */}
                <div>
                  <input
                    type="text"
                    {...register("secondaryArea")}
                    placeholder="Secondary Area"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Topics */}
                <div>
                  <input
                    type="text"
                    {...register("topics")}
                    placeholder="Topics"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Update Button */}
                <div>
                  <button
                    type="submit"
                    className="w-1/4 p-2 bg-accent text-white rounded-lg hover:bg-primary-700"
                  >
                    Update Conference
                  </button>
                </div>

                {/* Delete Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-1/4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Conference
                  </button>

                  {isModalVisible && (
                    <ConfirmationModal
                      onConfirm={confirmDelete}
                      onCancel={cancelDelete}
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateConference;
