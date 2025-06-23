// UserSidebar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/Auth";

const UserSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [auth] = useAuth(); // Get the current auth state with roles

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  // Check if the user has specific roles
  const hasRole = (role) => {
    return auth?.roles?.some((r) => r.role === role);
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
          User Dashboard
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
          to="/userdashboard/user-profile"
          className="flex items-center px-4 py-2 text-gray-100 hover:bg-primaryAlt-dark rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          {isExpanded && <span className="ml-2">Profile</span>}
        </NavLink>
        {/* <NavLink
          to="/userdashboard/create-conference"
          className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-primaryAlt-dark rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          {isExpanded && <span className="ml-2">Create Conference</span>}
        </NavLink> */}
        <NavLink
          to="/userdashboard/roles"
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
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>

          {isExpanded && <span className="ml-2">My Roles</span>}
        </NavLink>
        {/* Conditionally render dashboard links based on the user's roles */}
        {hasRole("organizer") && (
          <NavLink
            to="/userdashboard/organizer-dashboard"
            className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-primaryAlt-dark rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            {isExpanded && <span className="ml-2">Organizer Dashboard</span>}
          </NavLink>
        )}

        {hasRole("reviewer") && (
          <NavLink
            to="/userdashboard/reviewer-dashboard"
            className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-primaryAlt-dark rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197"
              />
            </svg>
            {isExpanded && <span className="ml-2">Reviewer Dashboard</span>}
          </NavLink>
        )}

        {hasRole("author") && (
          <NavLink
            to="/userdashboard/author-dashboard"
            className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-primaryAlt-dark rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            {isExpanded && <span className="ml-2">Author Dashboard</span>}
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default UserSidebar;
