// import React from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Layout from "../../components/Layout";

// const ThankYouPage = () => {
//   // Use search parameters inside the component
//   const [searchParams] = useSearchParams();
//   const role = searchParams.get("role");
//   const conferenceName = searchParams.get("conferenceName");
//   const conferenceId = searchParams.get("conferenceId");
//   const status = searchParams.get("status"); // Fixed to use searchParams

//   const isReviewer = role === "reviewer";

//   const navigate = useNavigate();

//   return (
//     <Layout title={"Confizio - Welcome"}>
//       <div className="min-h-screen flex flex-col items-center justify-center bg-light text-primary px-4">
//         {status === "accepted" ? (
//           <>
//             <h1 className="text-4xl font-bold mb-6 text-center">
//               THANK YOU FOR ACCEPTING THE INVITATION FOR{" "}
//               <span className="text-accent">{conferenceName}</span>
//             </h1>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 className="px-6 py-3 rounded-md font-semibold bg-primary text-light"
//                 onClick={() =>
//                   navigate(
//                     `/register?role=reviewer&conferenceId=${conferenceId}&conferenceName=${encodeURIComponent(
//                       conferenceName
//                     )}`
//                   )
//                 }
//               >
//                 Register as a Reviewer
//               </button>
//               <button
//                 className="px-6 py-3 rounded-md font-semibold bg-accent text-light"
//                 onClick={() =>
//                   navigate(
//                     `/login?role=reviewer&conferenceId=${conferenceId}&conferenceName=${encodeURIComponent(
//                       conferenceName
//                     )}`
//                   )
//                 }
//               >
//                 Login as Reviewer
//               </button>
//             </div>
//           </>
//         ) : (
//           <div>
//             <h1 className="text-4xl font-bold mb-6 text-center">
//               Sorry to see you decline
//             </h1>
//             <button
//               className="px-6 py-3 rounded-md font-semibold bg-accent text-light"
//               onClick={() => navigate("/")}
//             >
//               Go Back to Homepage
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default ThankYouPage;

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const conferenceName = searchParams.get("conferenceName");
  const conferenceId = searchParams.get("conferenceId");
  const status = searchParams.get("status");

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate(
      `/register?role=reviewer&conferenceId=${conferenceId}&conferenceName=${encodeURIComponent(
        conferenceName
      )}`
    );
  };

  const handleLogin = () => {
    navigate(
      `/login?role=reviewer&conferenceId=${conferenceId}&conferenceName=${encodeURIComponent(
        conferenceName
      )}`
    );
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Layout title="Confizio - Welcome">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] px-4 py-12">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in transition duration-500 ease-in-out">
          {status === "accepted" ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                🎉 Thank You for Accepting the Invitation!
              </h1>
              <p className="text-lg mb-6">
                You’ve accepted the invitation to join{" "}
                <span className="text-accent font-semibold">
                  {conferenceName}{" "}
                </span>
                as a reviewer. We’re excited to have you on board!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={handleRegister}
                  className="px-6 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition"
                >
                  Register as Reviewer
                </button>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 rounded-xl font-semibold bg-accent text-white hover:bg-accent/90 transition"
                >
                  Login as Reviewer
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-4">
                Invitation Declined
              </h1>
              <p className="text-lg mb-6">
                We're sorry to hear that you've declined the invitation. If
                you'd like to reconsider your decision, you're welcome to
                revisit the invitation at any time.
              </p>

              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl font-semibold bg-accent text-white hover:bg-accent/90 transition"
              >
                Go Back to Homepage
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ThankYouPage;
