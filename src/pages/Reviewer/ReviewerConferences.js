import React from "react";
import RoleConferencesPage from "../../components/ConferencesByRole";
import ReviewerSidebar from "../../components/ReviewerSidebar";

const ReviewerConferences = () => {
  <ReviewerSidebar/>
  return <RoleConferencesPage role="reviewer" />;
};

export default ReviewerConferences;
