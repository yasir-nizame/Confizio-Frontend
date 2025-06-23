import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pagenotfound from "./pages/Pagenotfound.js";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Forgotpassword from "./pages/Auth/Forgotpassword";
import ConferenceCreationForm from "./pages/Organizer/CreateConference.js";
import AuthorForm from "./pages/Author/AuthorForm"; // Import your AuthorForm component
import { Toaster } from "react-hot-toast";
import AllConferences from "./pages/Organizer/AllConferences.js";
import UpdateConference from "./pages/Organizer/UpdateConference.js";
import AdminDashboard from "./pages/Admin/AdminDashboard.js";
import AdminPrivateRoute from "./routes/adminAuth.js";
import UserPrivateRoute from "./routes/userAuth.js";
import ConferenceRequests from "./pages/Admin/ConferenceRequests.js";
import RejectedConferences from "./pages/Admin/RejectedConferences.js";
import Profile from "./components/AdminProfile.js";
import UserDashboard from "./pages/Auth/UserDashboard.js";
import UserProfile from "./components/UserProfile.js";
import ConferencePapers from "./pages/Organizer/ConferenceSubmissions.js";
import RolesPage from "./pages/Auth/Roles.js";
import ConferenceDetailsPage from "./pages/conference/ConferenceDetails.js";
import PaperSubmissionDetails from "./pages/Author/PaperSubmissondetails.js";
import OrganizerDashboard from "./pages/Organizer/OrganizerDashboard.js";
import AuthorDashboard from "./pages/Author/AuthorDashboard.js";
import ReviewerDashboard from "./pages/Reviewer/ReviewerDashboard.js";
// import ReviewerRegistrationForm from "./pages/Reviewer/ReviewerRegistration.js";
// import ReviewerLoginForm from "./pages/Reviewer/ReviewerLogin.js";
import ThankYouPage from "./pages/Reviewer/Thankyou.js";
import RolePrivateRoute from "./routes/roleAuth.js";
import InviteReviewers from "./pages/Organizer/InviteReviewers.js";
import OrganizerConferences from "./pages/Organizer/OrganizerConferences.js";
import AuthorConferences from "./pages/Author/AuthorConferences.js";
import ReviewerConferences from "./pages/Reviewer/ReviewerConferences.js";
import AcceptedInvitations from "./pages/Organizer/AcceptedInvitations.js";
import InvitationResponse from "./pages/Reviewer/InvitationResponse.js";
import AssignPapersPage from "./pages/Organizer/AssignPapers.js";
import AssignmentsPage from "./pages/Organizer/AssignmentsPage.js";
import AllPapersToReview from "./pages/Reviewer/AllPapersToReview.js";
import ReviewForm from "./pages/Reviewer/ReviewForm.js";
import ReviewManagement from "./pages/Organizer/ReviewManagement.js";
import ReviewDetails from "./pages/Organizer/CheckReviews.js";
import AllPapersOfAuthor from "./pages/Author/ShowAllPapersOfUser.js";
import UpdatePaper from "./pages/Author/UpdatePaper.js";
import TechnicalWeightageForm from "./pages/Organizer/SetTechnicalConfidence.js";
import ConferencePapersDecisions from "./pages/Organizer/PapersDecision.js";
import ProceedingsPreview from "./pages/Organizer/ProceedingsPreview.js";
import ConferenceProceedingsForm from "./pages/Organizer/ConferenceProceedingsForm.js";

import axios from "axios";
import ConferenceLayout from "./components/conferenceLayout.js";

axios.defaults.baseURL = process.env.REACT_APP_API;

function App() {
  console.log("Hello world");
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 5000, // Default duration of 5 seconds for all toasts
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="*" element={<Pagenotfound />} />
        <Route path="all-conferences" element={<AllConferences />} />
        {/* Admin Dashboard Routes */}
        <Route path="/admindashboard/*" element={<AdminPrivateRoute />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="all-conferences" element={<AllConferences />} />
          <Route path="update-conference" element={<UpdateConference />} />
          <Route path="pending-requests" element={<ConferenceRequests />} />
          <Route
            path="rejected-conferences"
            element={<RejectedConferences />}
          />
        </Route>
        {/* User Dashboard Routes */}
        <Route path="/userdashboard/*" element={<UserPrivateRoute />}>
          {/* Default route redirects to the user dashboard */}
          <Route path="user-dashboard" element={<UserDashboard />} />
          {/* <Route index element={<Navigate to="user-dashboard" />} /> */}
          {/* Role-based dashboards */}
          <Route element={<RolePrivateRoute role="organizer" />}>
            <Route
              path="organizer-dashboard"
              element={<OrganizerDashboard />}
            />
            <Route path="invite-reviewers" element={<InviteReviewers />} />
            <Route
              path="conferences-organizer"
              element={<OrganizerConferences />}
            />
            <Route
              path="accepted-invitations"
              element={<AcceptedInvitations />}
            />
            <Route path="assign-papers" element={<AssignPapersPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="review-management" element={<ReviewManagement />} />
            <Route path="reviews" element={<ReviewDetails />} />
            <Route
              path="papers/decisions"
              element={<ConferencePapersDecisions />}
            />
            <Route
              path="technical-weightage"
              element={<TechnicalWeightageForm />}
            />
          </Route>

          <Route element={<RolePrivateRoute role="reviewer" />}>
            <Route path="reviewer-dashboard" element={<ReviewerDashboard />} />
            <Route
              path="conferences-reviewer"
              s
              element={<ReviewerConferences />}
            />
            <Route
              path="all-assigned-papers"
              s
              element={<AllPapersToReview />}
            />
            <Route path="review-form" s element={<ReviewForm />} />
          </Route>

          <Route element={<RolePrivateRoute role="author" />}>
            <Route path="author-dashboard" element={<AuthorDashboard />} />
            <Route path="conferences-author" element={<AuthorConferences />} />
            <Route path="papers" element={<AllPapersOfAuthor />} />
            <Route path="update-paper" element={<UpdatePaper />} />
          </Route>

          <Route path="roles" element={<RolesPage />} />

          <Route path="user-profile" element={<UserProfile />} />
        </Route>
        <Route
          path="conference/:acronym/submit-paper/:id"
          element={<AuthorForm />}
        />
        {/* <Route path="/conference/:id" element={<ConferenceDetailsPage />} /> */}
        <Route path="/conference/:id" element={<ConferenceLayout />}>
          <Route index element={<ConferenceDetailsPage />} />
          <Route path="invite-reviewers" element={<InviteReviewers />} />
          <Route
            path="accepted-invitations"
            element={<AcceptedInvitations />}
          />
          <Route path="assign-papers" element={<AssignPapersPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="review-management" element={<ReviewManagement />} />
          <Route
            path="technical-weightage"
            element={<TechnicalWeightageForm />}
          />
          <Route
            path="papers/decisions"
            element={<ConferencePapersDecisions />}
          />
          <Route path="papers" element={<AllPapersOfAuthor />} />
        </Route>
        <Route path="/paper/:id" element={<PaperSubmissionDetails />} />
        <Route
          path="/conference/submissions/:id"
          element={<ConferencePapers />}
        />
        {/* <Route path="organizer-dashboard" element={<OrganizerDashboard />} /> */}
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/response" element={<InvitationResponse />} />
        {/* <Route path="register-reviewer" element={<ReviewerRegistrationForm />} />
        <Route path="login-reviewer" element={<ReviewerLoginForm />} /> */}
        <Route
          path="/generate-proceedings/:id/:cname"
          element={<ConferenceProceedingsForm />}
        />
        <Route path="view-proceedings/:id/:cname" element={<ProceedingsPreview />} />
        <Route path="create-conference" element={<ConferenceCreationForm />} />
      </Routes>
    </>
  );
}

export default App;
