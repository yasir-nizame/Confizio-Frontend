import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

const ProceedingsPreview = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [conferenceName, setConferenceName] = useState("");

  const { id: conferenceId } = useParams();

  useEffect(() => {
    if (!conferenceId) {
      setError("Conference ID is missing.");
      return;
    }

    const fetchPdfUrl = async () => {
      try {
        const { data } = await axios.get(
          `/api/conference/get-conference/${conferenceId}`
        );
        console.log(data);
        const url = data.proceedingsPdfUrl || null;
        setPdfUrl(url);
        setConferenceName(data.conferenceName);

        if (url) {
          window.open(url, "_blank");
        } else {
          setError("No PDF available. Please upload the proceedings first.");
        }
      } catch (err) {
        setError("Failed to load PDF. Please try again later.");
      }
    };

    fetchPdfUrl();
  }, [conferenceId]);

  return (
    <Layout title="Confizio - Proceedings Preview">
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold text-center text-primary mb-4">
            Proceedings Preview
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Below is the preview status for the proceedings of{" "}
            <span className="font-semibold text-gray-800">
              {conferenceName || "the selected conference"}.
            </span>{" "}
            You can download or view the PDF file if it’s available.
          </p>

          {error ? (
            <div className="text-red-600 text-center text-sm font-medium bg-red-50 p-3 rounded">
              {error}
            </div>
          ) : pdfUrl ? (
            <div className="text-center flex flex-col items-center ">
              <p className="text-green-700 mb-4">Proceedings are ready.</p>
              <button
                onClick={() => window.open(pdfUrl, "_blank")}
                className=" py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 w-1/2"
              >
                View / Download PDF
              </button>
              <a className="text-primary my-2" href="/">
                Back to home
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Checking availability...
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProceedingsPreview;
