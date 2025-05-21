import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";

const ThankYouPage = () => {
  // Use search parameters inside the component
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const conferenceName = searchParams.get("conferenceName");
  const conferenceId = searchParams.get("conferenceId");
  const status = searchParams.get("status"); // Fixed to use searchParams

  const isReviewer = role === "reviewer";

  const navigate = useNavigate();

  return (
    <Layout title={"Confizio - Welcome"}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-light text-primary px-4">
        {status === "accepted" ? (
          <>
            <h1 className="text-4xl font-bold mb-6 text-center">
              THANK YOU FOR ACCEPTING THE INVITATION FOR{" "}
              <span className="text-accent">{conferenceName}</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-6 py-3 rounded-md font-semibold bg-primary text-light"
                onClick={() =>
                  navigate(
                    `/register?role=reviewer&conferenceId=${conferenceId}&conferenceName=${encodeURIComponent(
                      conferenceName
                    )}`
                  )
                }
              >
                Register as a Reviewer
              </button>
              <button
                className="px-6 py-3 rounded-md font-semibold bg-accent text-light"
                onClick={() =>
                  navigate(
                    `/login?role=reviewer&conferenceId=${conferenceId}&conferenceName=${encodeURIComponent(
                      conferenceName
                    )}`
                  )
                }
              >
                Login as Reviewer
              </button>
            </div>
          </>
        ) : (
          <div>
            <h1 className="text-4xl font-bold mb-6 text-center">
              Sorry to see you decline
            </h1>
            <button
              className="px-6 py-3 rounded-md font-semibold bg-accent text-light"
              onClick={() => navigate("/")}
            >
              Go Back to Homepage
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ThankYouPage;
