import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";

const AllPapersToReview = () => {
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [error, setError] = useState("");
  const [auth] = useAuth();
  const reviewerId = auth?.user?._id; // Replace with the actual reviewer ID.
  useEffect(() => {
    const fetchAssignedPapers = async () => {
      try {
        const response = await axios.get(
          `/api/reviewer/assigned-papers/reviewer/${reviewerId}`
        );
        if (response.data.success) {
          setAssignedPapers(response.data.data);
        } else {
          setError("Failed to fetch assigned papers.");
        }
        console.log("sjsjsh", response.data.data);
        // response.data.data[0].isReviewedBy
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching assigned papers.");
      }
    };

    fetchAssignedPapers();
  }, [reviewerId]);

  return (
    <Layout title={"confizio - Assigned Papers"}>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Assigned Papers
          </h1>
          {assignedPapers.length === 0 && (
            <p className="text-gray-600">No assigned papers found.</p>
          )}
          <div className="grid gap-6">
            {assignedPapers.map((paper) => (
              <div
                key={paper.paperId}
                className="bg-gray-50 p-6 rounded-lg shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {paper.title}
                </h2>
                <p className="text-gray-600 mt-2">
                  <strong>Abstract:</strong> {paper.abstract}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Conference:</strong> {paper.conferenceName} (
                  {paper.conferenceAcronym})
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Assigned At:</strong>{" "}
                  {new Date(paper.assignedAt).toLocaleString()}
                </p>
                <div className="mt-4">
                  <strong className="text-gray-800">Keywords:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {paper.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-secondaryAlt-light text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <strong className="text-gray-800">Authors:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {paper.authors.map((author, index) => (
                      <li key={index} className="text-gray-600">
                        {author.firstName} {author.lastName} - {author.email}{" "}
                        {author.affiliation && `(${author.affiliation})`}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <a
                    href={paper.paperFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-accent text-white px-4 py-2 rounded shadow hover:bg-accentAlt-dark transition"
                  >
                    View Paper
                  </a>
                  {paper.isReviewedBy?.includes(reviewerId) ? (
                    <button
                      disabled
                      className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded shadow cursor-default"
                    >
                      Reviewed
                    </button>
                  ) : (
                    <Link
                      to={`/userdashboard/review-form?reviewerId=${reviewerId}&paperId=${paper.paperId}&title=${paper.title}`}
                      className="mt-4 inline-block bg-secondary text-white px-4 py-2 rounded shadow hover:bg-secondaryAlt-dark transition"
                    >
                      Review Paper
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllPapersToReview;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/Auth";
// import Layout from "../../components/Layout";
// import { Link } from "react-router-dom";

// const AllPapersToReview = () => {
//   const [assignedPapers, setAssignedPapers] = useState([]);
//   const [auth] = useAuth();
//   const reviewerId = auth?.user?._id;

//   useEffect(() => {
//     const fetchAssignedPapers = async () => {
//       try {
//         const response = await axios.get(
//           `/api/reviewer/assigned-papers/reviewer/${reviewerId}`
//         );
//         console.log(response.data);
//         if (response.data.success) {
//           setAssignedPapers(response.data.data);
//         } else {
//           // Handle if there are no assigned papers or fetch fails.
//         }
//       } catch (err) {
//         console.error(err);
//         // Handle any error that occurs during the fetch.
//       }
//     };

//     fetchAssignedPapers();
//   }, [reviewerId]);

//   return (
//     <Layout title={"confizio - Assigned Papers"}>
//       <div className="min-h-screen bg-gray-100 py-8 px-4">
//         <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             Assigned Papers
//           </h1>
//           {assignedPapers.length === 0 && (
//             <p className="text-gray-600">No assigned papers found.</p>
//           )}
//           <div className="grid gap-6">
//             {assignedPapers.map((paper) => (
//               <div key={paper._id} className="bg-gray-50 p-6 rounded-lg shadow">
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   {paper.title}
//                 </h2>
//                 <p className="text-gray-600 mt-2">
//                   <strong>Abstract:</strong> {paper.abstract}
//                 </p>
//                 <p className="text-gray-600 mt-2">
//                   <strong>Conference:</strong> {paper.conferenceName} (
//                   {paper.conferenceAcronym})
//                 </p>
//                 <p className="text-gray-600 mt-2">
//                   <strong>Assigned At:</strong>{" "}
//                   {new Date(paper.assignedAt).toLocaleString()}
//                 </p>
//                 <div className="mt-4">
//                   <strong className="text-gray-800">Keywords:</strong>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {paper.keywords.map((keyword, index) => (
//                       <span
//                         key={index}
//                         className="bg-secondaryAlt-light text-primary px-3 py-1 rounded-full text-sm"
//                       >
//                         {keyword}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <strong className="text-gray-800">Authors:</strong>
//                   <ul className="list-disc list-inside mt-2">
//                     {paper.authors.map((author, index) => (
//                       <li key={index} className="text-gray-600">
//                         {author.firstName} {author.lastName} - {author.email}{" "}
//                         {author.affiliation && `(${author.affiliation})`}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="flex space-x-3">
//                   <a
//                     href={paper.paperFilePath}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-4 inline-block bg-accent text-white px-4 py-2 rounded shadow hover:bg-accentAlt-dark transition"
//                   >
//                     View Paper
//                   </a>
//                   {/* Check if the reviewer has already reviewed the paper */}
//                   {paper.hasReviewed ? (
//                     // If the reviewer has already reviewed, show 'Reviewed' button
//                     <button
//                       disabled
//                       className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded shadow cursor-default"
//                     >
//                       Reviewed
//                     </button>
//                   ) : (
//                     // If the reviewer hasn't reviewed, show 'Review Paper' button
//                     <Link
//                       to={`/userdashboard/review-form?reviewerId=${reviewerId}&paperId=${paper._id}&title=${paper.title}`}
//                       className="mt-4 inline-block bg-secondary text-white px-4 py-2 rounded shadow hover:bg-secondaryAlt-dark transition"
//                     >
//                       Review Paper
//                     </Link>
//                   )}
//                 </div>
//                 <div>
//                   state:
//                   {paper.hasReviewed}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AllPapersToReview;
