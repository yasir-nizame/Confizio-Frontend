import React, { useState, useEffect } from "react";
import { useAuth } from "../context/Auth";
import axios from "axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

const RoleConferencesPage = ({ role }) => {
  const [auth] = useAuth(); // Get auth context
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConferences = async () => {
    if (!auth?.user?._id) return; // Do nothing if user ID is undefined
    try {
      const response = await axios.get(
        `/api/auth/conferences/${auth.user._id}?role=${role}`
      );
      setConferences(response.data.conferences);
    } catch (error) {
      console.error(`Error fetching conferences for role ${role}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user?._id && role) {
      fetchConferences();
    } else {
      setLoading(false); // Stop loading if no user ID or role
    }
  }, [auth, role]);

  // if (loading) return <div>Loading conferences...</div>;
  if (loading) {
    return <Spinner />;
  }

  return (
    <Layout title={`Confera Flow - ${role} Conferences`}>
      <div className="relative flex">
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">
            {role.charAt(0).toUpperCase() + role.slice(1)} Conferences
          </h2>

          {conferences.length === 0 ? (
            <div className="text-center text-gray-500">
              No conferences found for the role: {role}.
            </div>
          ) : (
            <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-secondary text-light">
                  <th className="py-3 px-6 border-b text-left">Conference</th>
                  <th className="py-3 px-6 border-b text-left">Role</th>
                  <th className="py-3 px-6 border-b text-left">Link</th>
                </tr>
              </thead>
              <tbody>
                {conferences.map((conf, index) => (
                  <tr
                    key={index}
                    className="hover:bg-secondary hover:bg-opacity-20 transition-colors duration-300"
                  >
                    <td className="py-3 px-6 border-b">
                      {conf.conferenceName} ({conf.acronym})
                    </td>
                    <td className="py-3 px-6 border-b">{role}</td>
                    <td className="py-3 px-6 border-b">
                      <Link
                        to={`/conference/${conf.conferenceId}`}
                        className="text-accent hover:text-accentAlt-dark underline transition-colors duration-300"
                      >
                        Visit Conference
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoleConferencesPage;
