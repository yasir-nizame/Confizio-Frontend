// import React from "react";
// import { Navigate, Route, Outlet } from "react-router-dom";
// import { useAuth } from "../context/Auth"; // Import the Auth context

// // PrivateRoute component for role-based protection
// const RolePrivateRoute = ({ role, children }) => {
//   const [auth] = useAuth();

//   if (!auth?.roles?.some((r) => r.role === role)) {
//     return <Navigate to="/dashboard" />; // Redirect to user dashboard if role is not matched
//   }

//   return children || <Outlet />; // Render child components if role matches
// };

// export default RolePrivateRoute;

import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";
import axios from "axios";
import Spinner from "../components/Spinner";

const RolePrivateRoute = ({ role }) => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        if (!auth?.token || !auth?.user?._id) {
          setHasRole(false);
          setLoading(false);
          return;
        }

        // Fetch roles directly from API
        const res = await axios.get(`/api/auth/user-roles/${auth.user._id}`);

        const userRoles = res.data.roles || [];
        const userHasRole = userRoles.some((r) => r.role === role);
        setHasRole(userHasRole);
      } catch (error) {
        console.error("Error checking role:", error);
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [auth?.token, auth?.user?._id, role]);

  if (loading) {
    return <Spinner />;
  }

  if (!hasRole) {
    return <Navigate to="/userdashboard/user-dashboard" />;
  }

  return <Outlet />;
};

export default RolePrivateRoute;