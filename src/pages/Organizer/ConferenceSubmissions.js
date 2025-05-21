import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";

const ConferencePapers = () => {
  const { id } = useParams(); // Extract ID from the URL
  const [papers, setPapers] = useState([]);
  const [conferenceName, setConferenceName] = useState("");

  useEffect(() => {
    const fetchConferenceData = async () => {
      try {
        // Fetch conference details, including populated papers
        const response = await axios.get(
          `/api/conference/get-conference/${id}`
        );
        const conference = response.data;

        setConferenceName(conference.conferenceName);
        setPapers(conference.papers || []); // Papers are already populated
      } catch (error) {
        console.error("Error fetching conference data:", error);
      }
    };

    fetchConferenceData();
  }, [id]);

  return (
    <Layout title={"Confizio - Submissions"}>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Conference Name */}
        <h1 className="text-2xl font-bold text-center mb-4">
          Title: <span className="text-primaryAlt-dark">{conferenceName}</span>
        </h1>

        {/* Table Heading */}
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Paper Submissions
        </h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <thead className="bg-secondaryAlt-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  S.No
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Title
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Keywords
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Authors
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Submission Time
                </th>
                <th className="px-6 py-3 text-left font-semibold text-sm">
                  Paper (File)
                </th>
              </tr>
            </thead>
            <tbody>
              {papers.length > 0 ? (
                papers.map((paper, index) => (
                  <tr
                    key={paper._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-secondary hover:bg-opacity-20 transition-colors duration-300  ease-in-out`}
                  >
                    <td className="border-b px-6 py-3 text-center text-gray-800">
                      {index + 1}
                    </td>
                    <td className="border-b px-6 py-3 text-gray-800">
                      {paper.title}
                    </td>
                    <td className="border-b px-6 py-3 text-gray-600">
                      {paper.keywords.join(", ")}
                    </td>
                    <td className="border-b px-6 py-3 text-gray-600">
                      {paper.authors.map((author, i) => (
                        <div key={i} className="text-sm">
                          {author.firstName}{" "}
                          <span className="text-primaryAlt-dark">
                            ({author.email})
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="border-b px-6 py-3 text-center text-gray-600">
                      {new Date(paper.createdAt).toLocaleString()}
                    </td>
                    <td className="border-b px-6 py-3 text-center">
                      <a
                        href={paper.paperFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primaryAlt-dark hover:underline"
                      >
                        View Paper
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border px-6 py-4 text-center text-gray-600"
                  >
                    No papers found for this conference.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ConferencePapers;
