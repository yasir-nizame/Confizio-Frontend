// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import Layout from "../../components/Layout";
// import { useAuth } from "../../context/Auth";

// const ConferenceDetailsPage = () => {
//   const { id } = useParams();
//   const [conference, setConference] = useState(null);
//   const [loading, setLoading] = useState(true);
// const [auth] = useAuth();

//   const fetchConferenceDetails = async () => {
//     try {
//       const response = await axios.get(`/api/conference/get-conference/${id}`);
//       setConference(response.data);
//     } catch (error) {
//       console.error("Error fetching conference details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchConferenceDetails();
//   }, [id]);

//   if (loading) return <div>Loading conference details...</div>;

//   if (!conference)
//     return (
//       <div className="text-center text-gray-500">
//         Conference not found or an error occurred.
//       </div>
//     );

// const isOrganizer = auth?.roles?.some(
//   (roleObj) => roleObj.role === "organizer" && roleObj.conferenceId === id
// );
// const isAuthor = auth?.roles?.some(
//   (roleObj) => roleObj.role === "author" && roleObj.conferenceId === id
// );

//   return (
//     <Layout title={`Conference Details - ${conference.conferenceName}`}>
//       <div className="container mx-auto p-4">
//         <h2 className="text-2xl font-bold mb-4 text-center my-4">
//           {conference.conferenceName}
//         </h2>

//         {/* Tabs Integration */}
//         <div className="bg-white py-6">
//           <div className="mx-auto max-w-7xl px-6 lg:px-8">
//             <div className="w-full">
//               <div className="sm:hidden">
//                 <select
//                   aria-label="Select a tab"
//                   className="w-full appearance-none rounded-lg border-none bg-white px-3.5 py-2.5 text-base font-medium text-gray-900 shadow-sm outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-pink-500 focus:ring-0"
//                 >
//                   {isOrganizer && (
//                     <>
//                       <option>Invite Reviewers</option>
//                       <option>Accepted Invitations</option>
//                       <option>Assign Papers</option>
//                       <option>Paper Assignments</option>
//                       <option>Review Management</option>
//                       <option>Update Technical Weightage</option>
//                       <option>Papers Summary</option>
//                     </>
//                   )}
//                   {isAuthor && <option>Submitted Papers</option>}
//                 </select>
//               </div>
//               <div className="hidden sm:block">
//                 <div className="border-b border-gray-200">
//                   <nav
//                     aria-label="Tabs"
//                     className="-mb-px flex items-end gap-x-8 overflow-x-auto text-center"
//                   >
//                     {isOrganizer && (
//                       <>
//                         <Link
//                           to={`/userdashboard/invite-reviewers?conferenceName=${encodeURIComponent(
//                             conference.conferenceName
//                           )}&conferenceId=${conference._id}`}
//                           className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                         >
//                           Invite Reviewers
//                         </Link>
//                         <Link
//                           to={`/userdashboard/accepted-invitations?conferenceName=${encodeURIComponent(
//                             conference.conferenceName
//                           )}&conferenceId=${conference._id}`}
//                           className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                         >
//                           Accepted Invitations
//                         </Link>
//                         <Link
//                           to={`/userdashboard/assign-papers?conferenceName=${encodeURIComponent(
//                             conference.conferenceName
//                           )}&conferenceId=${conference._id}`}
//                           className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                         >
//                           Assign Papers
//                         </Link>
//                         <Link
//                           to={`/userdashboard/assignments?conferenceName=${encodeURIComponent(
//                             conference.conferenceName
//                           )}&conferenceId=${conference._id}`}
//                           className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                         >
//                           Paper Assignments
//                         </Link>
//                         <Link
//                           to={`/userdashboard/review-management?conferenceName=${encodeURIComponent(
//                             conference.conferenceName
//                           )}&conferenceId=${conference._id}`}
//                           className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                         >
//                           Review Management
//                         </Link>
//                         <Link
//                           to={`/userdashboard/technical-weightage?conferenceName=${encodeURIComponent(
//                             conference.conferenceName
//                           )}&conferenceId=${conference._id}`}
//                           className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                         >
//                           Update Technical Weightage
//                         </Link>
//                         <Link
//                           to={`/userdashboard/papers/decisions?conferenceName=${encodeURIComponent(
//                             conference.conferenceName
//                           )}&conferenceId=${conference._id}`}
//                           className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                         >
//                           Papers Summary
//                         </Link>
//                       </>
//                     )}
//                     {isAuthor && (
//                       <Link
//                         to={`/userdashboard/papers?conferenceName=${encodeURIComponent(
//                           conference.conferenceName
//                         )}&conferenceId=${conference._id}`}
//                         className="inline-flex border-b-2 border-transparent px-1 py-2 text-sm text-gray-500 hover font-semibold hover:text-white hover:border-primary  hover:bg-secondary"
//                       >
//                         Submitted Papers
//                       </Link>
//                     )}
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Conference details below remain untouched */}
//         <table className="table-auto w-1/2 p-10 my-10 mx-6 border-collapse border border-gray-300">
//           <thead className="bg-secondary text-light">
//             <tr>
//               <th className="border border-gray-300 px-4 py-2">Attribute</th>
//               <th className="border border-gray-300 px-4 py-2">Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">Acronym</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {conference.acronym}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">Web Page</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <a
//                   href={conference.webPage}
//                   className="text-blue-500 underline"
//                 >
//                   {conference.webPage}
//                 </a>
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">Venue</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {conference.venue}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">City</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {conference.city}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">Country</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {conference.country}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">Start Date</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {new Date(conference.startDate).toLocaleDateString()}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">End Date</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {new Date(conference.endDate).toLocaleDateString()}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">
//                 Abstract Deadline
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {new Date(conference.abstractDeadline).toLocaleDateString()}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">
//                 Submission Deadline
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {new Date(conference.submissionDeadline).toLocaleDateString()}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">Primary Area</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {conference.primaryArea}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">
//                 Secondary Area
//               </td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {conference.secondaryArea}
//               </td>
//             </tr>
//             <tr>
//               <td className="border border-gray-300 px-4 py-2">Topics</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 {conference.topics?.join(", ")}
//               </td>
//             </tr>
//             {isOrganizer && (
//               <tr>
//                 <td className="border border-gray-300 px-4 py-2">
//                   All Submissions
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   <a
//                     href={`/conference/submissions/${id}`}
//                     className="text-blue-500 underline"
//                   >
//                     Submissions
//                   </a>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </Layout>
//   );
// };

// export default ConferenceDetailsPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/Auth";

const ConferenceDetailsPage = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  const isOrganizer = auth?.roles?.some(
    (roleObj) => roleObj.role === "organizer" && roleObj.conferenceId === id
  );
  const isAuthor = auth?.roles?.some(
    (roleObj) => roleObj.role === "author" && roleObj.conferenceId === id
  );
  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await axios.get(
          `/api/conference/get-conference/${id}`
        );
        setConference(response.data);
      } catch (error) {
        console.error("Error fetching conference details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchConferenceDetails();
  }, [id]);

  if (loading) return <div>Loading conference details...</div>;
  if (!conference)
    return (
      <div className="text-center text-gray-500">
        Conference not found or an error occurred.
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center my-4">
        {conference.conferenceName}
      </h2>

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
              <a href={conference.webPage} className="text-blue-500 underline">
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
            <td className="border border-gray-300 px-4 py-2">Secondary Area</td>
            <td className="border border-gray-300 px-4 py-2">
              {conference.secondaryArea}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Topics</td>
            <td className="border border-gray-300 px-4 py-2">
              {conference.topics?.join(", ")}
            </td>
          </tr>
          {isOrganizer && (
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                All Submissions{" "}
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
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConferenceDetailsPage;
