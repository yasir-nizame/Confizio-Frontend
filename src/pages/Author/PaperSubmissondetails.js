import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";

const PaperSubmissionDetails = () => {
  const [paperDetails, setPaperDetails] = useState(null);
  const { id } = useParams(); // Extract ID from the URL

  useEffect(() => {
    axios
      .get(`/api/author/research-paper/${id}`)
      .then((response) => {
        setPaperDetails(response.data.data); // Adjust based on API response structure
      })
      .catch((error) => console.error("Error fetching paper details:", error));
  }, [id]);

  if (!paperDetails) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const {
    title,
    abstract,
    keywords,
    authors,
    conferenceName,
    conferenceAcronym,
    createdAt,
    paperFilePath,
  } = paperDetails;

  return (
    <Layout title={"Confizio - Paper Details"}>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white border rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Submission Details
        </h2>
        <div className="border p-4 rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">
            Title: <span className="font-normal">{title}</span>
          </h3>
          <p className="mt-2 text-gray-700">
            <strong>Abstract:</strong> {abstract}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Keywords:</strong> {keywords && keywords.join(", ")}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Conference:</strong> {conferenceName} ({conferenceAcronym})
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Submitted At:</strong>{" "}
            {new Date(createdAt).toLocaleString()}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>File Path:</strong> <a href={paperFilePath}>Download</a>
          </p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Authors:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {authors &&
                authors.map((author) => (
                  <li key={author._id}>
                    {author.firstName} ({author.email})
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaperSubmissionDetails;
