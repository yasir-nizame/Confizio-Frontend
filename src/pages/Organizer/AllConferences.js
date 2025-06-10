// import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout";
// import axios from "axios";
// import Sidebar from "../../components/AdminSidebar";
// import { useAuth } from "../../context/Auth";

// const AllConferences = () => {
//   const [conferences, setConferences] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [auth] = useAuth();

//   // Fetch all conferences from the backend
//   useEffect(() => {
//     const fetchConferences = async () => {
//       try {
//         const response = await axios.get("/api/conference/all-conferences");
//         setConferences(response.data);
//       } catch (error) {
//         console.error("Error fetching conferences:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConferences();
//   }, []);
//   useEffect(() => {
//     conferences.forEach((conference) => {
//       console.log("Conference ID:", conference._id);
//     });
//   }, [conferences]);

//   return (
//     <Layout title={"Confizio - All Conferences"}>
//       <div className="relative flex min-h-screen">
//         {auth?.user?.role === 1 && <Sidebar />}

//         <div className="p-4">
//           <h1 className="text-2xl font-bold mb-4">Conferences</h1>

//           {/* Loading message */}
//           {loading ? (
//             <p>Loading...</p>
//           ) : conferences.length === 0 ? (
//             <p>No conferences found.</p>
//           ) : (
//             <div className="overflow-x-auto my-6 mx-2">
//               <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
//                 <thead>
//                   <tr className="bg-secondaryAlt-dark text-light">
//                     <th className="py-2 px-6 border-b text-left transition-colors duration-300">
//                       Acronym
//                     </th>
//                     <th className="py-2 px-6 border-b text-left transition-colors duration-300">
//                       Name
//                     </th>
//                     <th className="py-2 px-6 border-b text-left transition-colors duration-300">
//                       Location
//                     </th>
//                     <th className="py-2 px-6 border-b text-left transition-colors duration-300">
//                       Deadline
//                     </th>
//                     <th className="py-2 px-6 border-b text-left transition-colors duration-300">
//                       Start Date
//                     </th>
//                     <th className="py-2 px-6 border-b text-left transition-colors duration-300">
//                       Topics
//                     </th>
//                     <th className="py-2 px-6 border-b text-left transition-colors duration-300">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {conferences.map((conference, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-secondary hover:bg-opacity-20 transition-colors duration-300"
//                     >
//                       <td className="py-3 px-6 border-b">
//                         {conference.acronym}
//                       </td>
//                       <td className="py-3 px-6 border-b">
//                         {conference.conferenceName}
//                       </td>
//                       <td className="py-3 px-6 border-b">
//                         {conference.city}, {conference.country}
//                       </td>
//                       <td className="py-3 px-6 border-b">
//                         {conference.submissionDeadline
//                           ? conference.submissionDeadline.slice(0, 10)
//                           : "-"}
//                       </td>
//                       <td className="py-3 px-6 border-b">
//                         {conference.startDate
//                           ? conference.startDate.slice(0, 10)
//                           : "-"}
//                       </td>
//                       <td className="py-3 px-6 border-b">
//                         {conference.topics &&
//                           conference.topics
//                             .filter((t) => t && t.trim())
//                             .join(", ")}
//                       </td>
//                       <td className="py-3 px-6 border-b">
//                         {auth?.user?.role === 1 ? (
//                           <button
//                             onClick={() => {
//                               // Redirect to the edit page for the admin
//                               window.location.href =
//                                 "/admindashboard/update-conference";
//                             }}
//                             className="bg-accent hover:bg-primaryAlt-light text-light px-2 py-1 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
//                           >
//                             Edit
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => {
//                               if (!auth?.user) {
//                                 // Redirect to login page if not logged in
//                                 return (window.location.href = "/login");
//                               }
//                               // Proceed to the Apply page if logged in
//                               window.location.href = `/conference/${conference.acronym}/submit-paper/${conference._id}`;
//                             }}
//                             className="bg-accent hover:bg-primaryAlt-light text-light px-2 py-1 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
//                           >
//                             Apply
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AllConferences;
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import Sidebar from "../../components/AdminSidebar";
import { useAuth } from "../../context/Auth";

const AllConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get("/api/conference/all-conferences");
        setConferences(response.data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  return (
    <Layout title={"Confizio - All Conferences"}>
      <div className="relative flex min-h-screen">
        {auth?.user?.role === 1 && <Sidebar />}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Conferences</h1>

          {loading ? (
            <p>Loading...</p>
          ) : conferences.length === 0 ? (
            <p>No conferences found.</p>
          ) : (
            <div className="overflow-x-auto my-6 mx-2">
              <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-secondaryAlt-dark text-light">
                    <th className="py-2 px-6 border-b text-left">Acronym</th>
                    <th className="py-2 px-6 border-b text-left">Name</th>
                    <th className="py-2 px-6 border-b text-left">Location</th>
                    <th className="py-2 px-6 border-b text-left">Start Date</th>
                    <th className="py-2 px-6 border-b text-left">
                      Submission Deadline
                    </th>
                    <th className="py-2 px-6 border-b text-left">Topics</th>
                    <th className="py-2 px-6 border-b text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {conferences.map((conference, index) => {
                    const now = new Date();
                    const endDate = new Date(conference.endDate);
                    const submissionDeadline = new Date(
                      conference.submissionDeadline
                    );

                    // ❌ Skip conferences that have already ended
                    if (endDate < now) return null;

                    // ✅ Check if submission deadline has passed
                    const isSubmissionClosed = submissionDeadline < now;

                    return (
                      <tr
                        key={index}
                        className="hover:bg-secondary hover:bg-opacity-20 transition-colors duration-300"
                      >
                        <td className="py-3 px-6 border-b">
                          {conference.acronym}
                        </td>
                        <td className="py-3 px-6 border-b">
                          {conference.conferenceName}
                        </td>
                        <td className="py-3 px-6 border-b">
                          {conference.city}, {conference.country}
                        </td>
                        <td className="py-3 px-6 border-b">
                          {conference.startDate?.slice(0, 10) || "-"}
                        </td>
                        <td className="py-3 px-6 border-b">
                          {conference.submissionDeadline?.slice(0, 10) || "-"}
                        </td>
                        <td className="py-3 px-6 border-b">
                          {conference.topics
                            ?.filter((t) => t && t.trim())
                            .join(", ")}
                        </td>
                        <td className="py-3 px-6 border-b">
                          {auth?.user?.role === 1 ? (
                            <button
                              onClick={() =>
                                (window.location.href =
                                  "/admindashboard/update-conference")
                              }
                              className="bg-accent hover:bg-primaryAlt-light text-light px-2 py-1 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                              Edit
                            </button>
                          ) : isSubmissionClosed ? (
                            <button
                              disabled
                              title="This conference is no longer accepting papers"
                              className="bg-gray-400 text-white px-2 py-1 rounded cursor-not-allowed shadow-md"
                            >
                              Apply (Closed)
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!auth?.user)
                                  return (window.location.href = "/login");
                                window.location.href = `/conference/${conference.acronym}/submit-paper/${conference._id}`;
                              }}
                              className="bg-accent hover:bg-primaryAlt-light text-light px-2 py-1 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                              Apply
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllConferences;
