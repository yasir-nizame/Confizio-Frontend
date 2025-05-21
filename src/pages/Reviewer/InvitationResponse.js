import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";

const InvitationResponse = () => {
  // Use search parameters inside the component
  const [searchParams] = useSearchParams();
  const conferenceName = searchParams.get("conferenceName");
  const conferenceId = searchParams.get("conferenceId");
  const navigate = useNavigate();

  const handleResponse = async (status) => {
    try {
      // Send the response to the backend
      await axios.post("/api/reviewer/respond-invitation", {
        conferenceId,
        status,
      });

      // Redirect to the thank you page and pass the email, conferenceId, and conferenceName
      navigate(
        `/thankyou?status=${status}&conferenceName=${encodeURIComponent(
          conferenceName
        )}&conferenceId=${conferenceId}`
      );
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  return (
    <Layout title={"Confizio"}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Invitation Response
          </h1>
          <p className="text-gray-600 text-center mb-6">
            You have been invited to review the conference{" "}
            <span className="text-primaryAlt-dark font-semibold">
              {conferenceName}
            </span>
            .
          </p>
          <div className="flex justify-around">
            <button
              onClick={() => handleResponse("accepted")}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleResponse("declined")}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InvitationResponse;
