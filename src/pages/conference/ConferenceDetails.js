import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/Auth";

const ConferenceDetailsPage = () => {
  const { id } = useParams(); // Extract ID from the URL
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth(); // Access auth context

  // Fetch Conference Details
  const fetchConferenceDetails = async () => {
    try {
      const response = await axios.get(`/api/conference/get-conference/${id}`);
      setConference(response.data);
    } catch (error) {
      console.error("Error fetching conference details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchConferenceDetails();
  }, [id]);

  if (loading) return <div>Loading conference details...</div>;

  if (!conference)
    return (
      <div className="text-center text-gray-500">
        Conference not found or an error occurred.
      </div>
    );

  // Check if the current user is an organizer
  const isOrganizer = auth?.roles?.some(
    (roleObj) => roleObj.role === "organizer" && roleObj.conferenceId === id
  );
  // Check if the current user is an author
  const isAuthor = auth?.roles?.some(
    (roleObj) => roleObj.role === "author" && roleObj.conferenceId === id
  );


  return (
    <Layout title={`Conference Details - ${conference.conferenceName}`}>
      <div className="container mx-auto p-4">
        <div className="">
          {isOrganizer && (
            <Link
              to={`/userdashboard/invite-reviewers?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Invite Reviewers
            </Link>
          )}
          {isOrganizer && (
            <Link
              to={`/userdashboard/accepted-invitations?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Accepted Invitations
            </Link>
          )}
          {isOrganizer && (
            <Link
              to={`/userdashboard/assign-papers?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Assign Papers
            </Link>
          )}
          {isOrganizer && (
            <Link
              to={`/userdashboard/assignments?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Paper Assignments
            </Link>
          )}
          {isOrganizer && (
            <Link
              to={`/userdashboard/review-management?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Review Management
            </Link>
          )}
          {isOrganizer && (
            <Link
              to={`/userdashboard/technical-weightage?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Update Technical Weightage
            </Link>
          )}
          {isOrganizer && (
            <Link
              to={`/userdashboard/papers/decisions?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Papers Summary
            </Link>
          )}
          {isAuthor && (
            <Link
              to={`/userdashboard/papers?conferenceName=${encodeURIComponent(
                conference.conferenceName
              )}&conferenceId=${conference._id}`}
              className="text-primary px-4 py-2 rounded float-end underline"
            >
              Submitted Papers
            </Link>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">{conference.conferenceName}</h2>
        <table className="table-auto w-1/2 p-10 my-10 mx-6 border-collapse border border-gray-300">
          <thead className="bg-secondary text-light">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Attribute</th>
              <th className="border border-gray-300 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Acronym</td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.acronym}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Web Page</td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={conference.webPage}
                  className="text-blue-500 underline"
                >
                  {conference.webPage}
                </a>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Venue</td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.venue}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">City</td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.city}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Country</td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.country}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Start Date</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(conference.startDate).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">End Date</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(conference.endDate).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Abstract Deadline
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(conference.abstractDeadline).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Submission Deadline
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(conference.submissionDeadline).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Primary Area</td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.primaryArea}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                Secondary Area
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.secondaryArea}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Topics</td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.topics?.length > 0
                  ? conference.topics.join(", ")
                  : "No topics available"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Status</td>
              <td className="border border-gray-300 px-4 py-2">
                {conference.status}
              </td>
            </tr>
            {isOrganizer && (
              <>
                {/* <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Submission Link
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={conference.submissionLink}
                      className="text-blue-500 underline"
                    >
                      {conference.submissionLink}
                    </a>
                  </td>
                </tr> */}
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    All Submissions
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={`/conference/submissions/${id}`}
                      className="text-blue-500 underline"
                    >
                      Submissions
                    </a>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ConferenceDetailsPage;
