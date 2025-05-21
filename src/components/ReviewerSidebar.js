import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const ReviewerSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`flex flex-col ${
        isExpanded ? "w-64" : "w-20"
      } bg-secondary min-h-screen transition-width duration-300`}
    >
      <div className="flex items-center justify-between h-16 bg-primaryAlt-dark px-4">
        <span
          className={`text-white font-bold uppercase ${
            !isExpanded && "hidden"
          }`}
        >
          Reviewer Dashboard
        </span>
        <button onClick={toggleSidebar} className="text-white">
          {isExpanded ? (
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
        <NavLink
          to="/userdashboard/conferences-reviewer"
          className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-primaryAlt-dark rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>

          {isExpanded && <span className="ml-2">Conferences</span>}
        </NavLink>
        <NavLink
          to="/userdashboard/all-assigned-papers"
          className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-primaryAlt-dark rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>

          {isExpanded && <span className="ml-2">Assigned Papers</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default ReviewerSidebar;
