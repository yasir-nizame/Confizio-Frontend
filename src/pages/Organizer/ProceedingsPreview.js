import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ProceedingsPreview = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const conferenceId = query.get("conferenceId");
  const conferenceName = query.get("conferenceName");

  useEffect(() => {
    if (!conferenceId) {
      setError("Conference ID is missing");
      return;
    }

    const fetchPdfUrl = async () => {
      try {
        const { data } = await axios.get(
          `/api/conference/get-conference/${conferenceId}`
        );
        const url = data.proceedingsPdfUrl || null;
        setPdfUrl(url);
        if (url) {
          window.open(url, "_blank");
        } else {
          setError("No PDF available. Please upload first.");
        }
      } catch (err) {
        setError("Failed to load PDF. Please try again.");
      }
    };

    fetchPdfUrl();
  }, [conferenceId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {conferenceName || "Proceedings"} Preview
      </h1>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        pdfUrl && (
          <button
            onClick={() => window.open(pdfUrl, "_blank")}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Download PDF
          </button>
        )
      )}
    </div>
  );
};

export default ProceedingsPreview;
