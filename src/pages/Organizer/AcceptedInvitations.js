// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import Layout from "../../components/Layout";

// const AcceptedInvitations = () => {
//   const [reviewers, setReviewers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [conferenceName, setConferenceName] = useState("");
//   const [conferenceId, setConferenceId] = useState("");

//   const location = useLocation();

//   // Parse query parameters
//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const name = queryParams.get("conferenceName") || "";
//     const id = queryParams.get("conferenceId") || "";

//     setConferenceName(name);
//     setConferenceId(id);

//   }, [location.search]);

//   useEffect(() => {
//     if (!conferenceId) {
//       setLoading(false); // Avoid triggering the fetch if conferenceId is invalid
//       setError("Conference ID is missing.");
//       return;
//     }

//     const fetchReviewers = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `/api/reviewer/${conferenceId}/reviewers`
//         );
//         setReviewers(response.data.data);
//         setError(null); // Clear error if successful
//       } catch (err) {
//         setError("Failed to load reviewers.");
//         console.error("Error fetching reviewers:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviewers();
//   }, [conferenceId]);

//   return (
//     <Layout title={"Confizio - Accepted Invitations"}>
//       <div className="min-h-screen bg-white p-6">
//         <header className="bg-primary text-light p-4 rounded-md shadow-md mb-6">
//           <h1 className="text-3xl font-bold text-center">Accepted Invitations for the Conference {conferenceName}</h1>
//           <p className="text-center text-secondaryAlt-light mt-2">
//             Track reviewers who have accepted invitations for your conference
//           </p>
//         </header>

//         {loading ? (
//           <div className="text-center text-primary text-xl">
//             Loading reviewers...
//           </div>
//         ) : error ? (
//           <div className="text-center text-accent text-xl">{error}</div>
//         ) : (
//           <div className="bg-white p-4 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold text-primary mb-4">
//               Accepted Reviewers
//             </h2>

//             {reviewers.length === 0 ? (
//               <p className="text-secondaryAlt-dark">
//                 No reviewers have accepted the invitation yet.
//               </p>
//             ) : (
//               <ul className="space-y-3">
//                 {reviewers.map((reviewer) => (
//                   <li
//                     key={reviewer.userId._id}
//                     className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-50"
//                   >
//                     <div>
//                       <h3 className="text-primaryAlt-dark font-medium text-lg">
//                         {reviewer.userId.name}
//                       </h3>
//                       <p className="text-primaryAlt-dark">
//                         {reviewer.userId.email}
//                       </p>
//                     </div>
//                     <div className="text-accent font-medium">Reviewer</div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default AcceptedInvitations;

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

const AcceptedInvitations = () => {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conferenceName, setConferenceName] = useState("");
  const [conferenceId, setConferenceId] = useState("");

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("conferenceName") || "";
    const id = queryParams.get("conferenceId") || "";

    setConferenceName(name);
    setConferenceId(id);
  }, [location.search]);

  useEffect(() => {
    if (!conferenceId) {
      setLoading(false);
      setError("Conference ID is missing.");
      return;
    }

    const fetchReviewers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/reviewer/${conferenceId}/reviewers`
        );
        setReviewers(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load reviewers.");
        console.error("Error fetching reviewers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewers();
  }, [conferenceId]);

  return (
    <Layout title={"Confizio - Accepted Invitations"}>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
        <div className="max-w-4xl mx-auto">
          <header className="bg-white border border-primary rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary text-center">
              Accepted Invitations for "{conferenceName}"
            </h1>
            <p className="text-center text-secondaryAlt-light mt-2 text-lg md:text-base font-bold">
              Reviewers who accepted your conference invitation
            </p>
          </header>

          {loading ? (
            <div className="text-center text-primary text-lg animate-pulse">
              Loading reviewers...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-medium text-lg">
              {error}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
                Accepted Reviewers
              </h2>

              {reviewers.length === 0 ? (
                <p className="text-gray-600 text-base">
                  No reviewers have accepted the invitation yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {reviewers.map((reviewer) => (
                    <li
                      key={reviewer.userId._id}
                      className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-4 shadow-sm"
                    >
                      <div>
                        <h3 className="text-lg font-medium text-primaryAlt-dark">
                          {reviewer.userId.name}
                        </h3>
                        <p className="text-sm text-primaryAlt-dark">
                          {reviewer.userId.email}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                        Reviewer
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AcceptedInvitations;
