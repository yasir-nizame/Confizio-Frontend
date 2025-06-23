import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

export default function ConferencePapersDecisions() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [conferenceName, setConferenceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const { id: conferenceId } = useParams();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await axios.get(`/api/conference/${conferenceId}/papers`);
        console.log(res);
        setPapers(res.data.papers);
        setConferenceName(res.data.papers[0].conferenceName);
      } catch (err) {
        console.error("Error fetching papers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [conferenceId]);

  // Define categories
  const categories = [
    "ALL",
    "ACCEPTED",
    "PENDING",
    "REJECTED",
    "MODIFICATION REQUIRED",
  ];

  // Group papers by finaldecision status
  const groupedPapers = papers.reduce((acc, paper) => {
    const status = paper.finaldecision?.toUpperCase() || "PENDING";
    if (!acc[status]) acc[status] = [];
    acc[status].push(paper);
    return acc;
  }, {});

  // Filter papers based on selected category
  const filteredPapers =
    selectedCategory === "ALL" ? papers : groupedPapers[selectedCategory] || [];

  // Render table for a given set of papers
  const renderTable = (papers) => (
    <table className="min-w-full bg-white shadow border border-gray-200 rounded-lg mb-6">
      <thead className="bg-secondary text-white">
        <tr>
          <th className="px-4 py-2 text-left">S.No</th>
          <th className="px-4 py-2 text-left">Title</th>
          <th className="px-4 py-2 text-left">Keywords</th>
          <th className="px-4 py-2 text-left">Authors</th>
          <th className="px-4 py-2 text-left">Reviewers</th>
          <th className="px-4 py-2 text-left">View Paper</th>
          <th className="px-4 py-2 text-left">Final Decision</th>
        </tr>
      </thead>
      <tbody>
        {papers.length > 0 ? (
          papers.map((paper, idx) => (
            <tr
              key={paper._id}
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-4 py-2">{idx + 1}</td>
              <td className="px-4 py-2">{paper.title}</td>
              <td className="px-4 py-2">
                {paper.keywords?.join(", ") || "N/A"}
              </td>
              <td className="px-4 py-2">
                {paper.authors?.map((a, i) => (
                  <div key={i}>
                    {a.firstName} ({a.email})
                  </div>
                )) || "N/A"}
              </td>
              <td className="px-4 py-2">
                {paper.reviews?.map((review, i) => (
                  <div key={i}>{review.reviewerId?.name || "-"}</div>
                )) || "N/A"}
              </td>

              <td className="px-4 py-2">
                <a
                  href={paper.paperFilePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Paper
                </a>
              </td>
              <td className="px-4 py-2">{paper.finaldecision || "Pending"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4 text-gray-500">
              No papers found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  if (loading)
    return <div className="text-center p-10 text-lg">Loading papers...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        {conferenceName} - Submitted Papers
      </h1>

      {/* Slicer */}
      <div className="flex justify-center mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 mx-1 rounded ${
              selectedCategory === category
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        {selectedCategory === "ALL"
          ? // Show all categories with headings
            categories.slice(1).map(
              (category) =>
                groupedPapers[category] && (
                  <div key={category}>
                    <h2 className="text-xl font-semibold mb-4">{category}</h2>
                    {renderTable(groupedPapers[category])}
                  </div>
                )
            )
          : // Show only selected category
            renderTable(filteredPapers)}
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={() =>
            navigate(
              `/generate-proceedings/${conferenceId}/${encodeURIComponent(
                conferenceName
              )}`
            )
          }
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          Generate Proceedings
        </button>
      </div>
    </div>
  );
}
