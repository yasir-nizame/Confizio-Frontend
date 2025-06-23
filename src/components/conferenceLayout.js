import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Layout from "./Layout";

const Tab = ({ to, label }) => (
  <Link
    to={to}
    className="text-sm font-medium text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-primary pb-1"
  >
    {label}
  </Link>
);

const ConferenceLayout = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);

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

  const isOrganizer = auth?.roles?.some(
    (roleObj) => roleObj.role === "organizer" && roleObj.conferenceId === id
  );
  const isAuthor = auth?.roles?.some(
    (roleObj) => roleObj.role === "author" && roleObj.conferenceId === id
  );

  return (
    <Layout title="Confizio - Conference Details">
      <div className="container mx-auto p-4">
        {/* <h2 className="text-2xl font-bold mb-4 text-center my-4">
        {conference.conferenceName}
      </h2> */}

        {/* Tabs Integration */}
        <div className="bg-white py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="w-full">
              <div className="sm:hidden">
                <select
                  aria-label="Select a tab"
                  className="w-full appearance-none rounded-lg border-none bg-gray-100 px-3.5 py-2.5 text-base font-medium text-gray-900 shadow-sm outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-500 focus:ring-0"
                >
                  {isOrganizer && (
                    <>
                      <option>Invite Reviewers</option>
                      <option>Accepted Invitations</option>
                      <option>Assign Papers</option>
                      <option>Paper Assignments</option>
                      <option>Review Management</option>
                      <option>Update Technical Weightage</option>
                      <option>Papers Summary</option>
                    </>
                  )}
                  {isAuthor && <option>Submitted Papers</option>}
                </select>
              </div>
              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  {/* <nav
                  aria-label="Tabs"
                  className="-mb-px flex items-end gap-x-8 overflow-x-auto text-center"
                >
                  {isOrganizer && (
                    <>
                      <Link
                        to={`/userdashboard/invite-reviewers?conferenceName=${encodeURIComponent(
                          conference.conferenceName
                        )}&conferenceId=${conference._id}`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                      >
                        Invite Reviewers
                      </Link>
                      <Link
                        to={`/userdashboard/accepted-invitations?conferenceName=${encodeURIComponent(
                          conference.conferenceName
                        )}&conferenceId=${conference._id}`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                      >
                        Accepted Invitations
                      </Link>
                      <Link
                        to={`/userdashboard/assign-papers?conferenceName=${encodeURIComponent(
                          conference.conferenceName
                        )}&conferenceId=${conference._id}`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                      >
                        Assign Papers
                      </Link>
                      <Link
                        to={`/userdashboard/assignments?conferenceName=${encodeURIComponent(
                          conference.conferenceName
                        )}&conferenceId=${conference._id}`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                      >
                        Paper Assignments
                      </Link>
                      <Link
                        to={`/userdashboard/review-management?conferenceName=${encodeURIComponent(
                          conference.conferenceName
                        )}&conferenceId=${conference._id}`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                      >
                        Review Management
                      </Link>
                      <Link
                        to={`/userdashboard/technical-weightage?conferenceName=${encodeURIComponent(
                          conference.conferenceName
                        )}&conferenceId=${conference._id}`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                      >
                        Update Technical Weightage
                      </Link>
                      <Link
                        to={`/userdashboard/papers/decisions?conferenceName=${encodeURIComponent(
                          conference.conferenceName
                        )}&conferenceId=${conference._id}`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                      >
                        Papers Summary
                      </Link>
                    </>
                  )}
                  {isAuthor && (
                    <Link
                      to={`/userdashboard/papers?conferenceName=${encodeURIComponent(
                        conference.conferenceName
                      )}&conferenceId=${conference._id}`}
                      className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
                    >
                      Submitted Papers
                    </Link>
                  )}
                </nav> */}
                  <nav
                    aria-label="Tabs"
                    className="-mb-px flex items-end gap-x-8 overflow-x-auto text-center"
                  >
                    {isOrganizer && (
                      <>
                        <Link
                          to={`/conference/${conference._id}/invite-reviewers`}
                          className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                        >
                          Invite Reviewers
                        </Link>
                        <Link
                          to={`/conference/${conference._id}/accepted-invitations`}
                          className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                        >
                          Accepted Invitations
                        </Link>
                        <Link
                          to={`/conference/${conference._id}/assign-papers`}
                          className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                        >
                          Assign Papers
                        </Link>
                        <Link
                          to={`/conference/${conference._id}/assignments`}
                          className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                        >
                          Paper Assignments
                        </Link>
                        <Link
                          to={`/conference/${conference._id}/review-management`}
                          className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                        >
                          Review Management
                        </Link>
                        <Link
                          to={`/conference/${conference._id}/technical-weightage`}
                          className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                        >
                          Update Technical Weightage
                        </Link>
                        <Link
                          to={`/conference/${conference._id}/papers/decisions`}
                          className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                        >
                          Papers Summary
                        </Link>
                      </>
                    )}

                    {isAuthor && (
                      <Link
                        to={`/conference/${conference._id}/papers`}
                        className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 font-semibold hover:text-white hover:border-primary hover:bg-secondary"
                      >
                        Submitted Papers
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </Layout>
  );
};

export default ConferenceLayout;
