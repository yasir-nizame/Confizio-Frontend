import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";

const RolesPage = () => {
  const [auth] = useAuth(); // Get auth context
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map roles to their respective dashboard paths
  const roleDashboardPaths = {
    organizer: "/userdashboard/organizer-dashboard",
    reviewer: "/userdashboard/reviewer-dashboard",
    author: "/userdashboard/author-dashboard",
  };

  const fetchRoles = async () => {
    if (!auth?.user?._id) return; // Do nothing if user ID is undefined
    try {
      const response = await axios.get(`/api/auth/user-roles/${auth.user._id}`);
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) {
      fetchRoles();
    } else {
      setLoading(false); // Stop loading if no user ID
    }
  }, [auth]);

  return (
    <Layout title={"Confera Flow - User Roles"}>
      <div className="relative flex">
        <UserSidebar />
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">My Conferences</h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="text-center text-gray-500">
              No roles assigned yet.
            </div>
          ) : (
            <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-secondary text-light">
                  <th className="py-3 px-6 border-b text-left transition-colors duration-300">
                    Conference
                  </th>
                  <th className="py-3 px-6 border-b text-left transition-colors duration-300">
                    Role
                  </th>
                  <th className="py-3 px-6 border-b text-left transition-colors duration-300">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((conf, index) => {
                  const dashboardPath = roleDashboardPaths[conf.role];
                  return (
                    <tr
                      key={index}
                      className="hover:bg-secondary hover:bg-opacity-20 transition-colors duration-300"
                    >
                      <td className="py-3 px-6 border-b">{conf.conferenceName}</td>
                      <td className="py-3 px-6 border-b">{conf.role}</td>
                      <td className="py-3 px-6 border-b">
                        {dashboardPath ? (
                          <Link
                            to={dashboardPath}
                            className="text-accent hover:text-accentAlt-dark underline transition-colors duration-300"
                          >
                            Visit as {conf.role}
                          </Link>
                        ) : (
                          "No dashboard available"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RolesPage;
