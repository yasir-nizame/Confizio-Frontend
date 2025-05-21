import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    roles: [], // Add roles to the context state
  });

  // Set default Authorization header for axios
  axios.defaults.headers.common["Authorization"] = auth?.token;


  useEffect(() => {
    // Fetch data from localStorage
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        user: parseData.user,
        token: parseData.token,
        roles: [], // Initialize roles as empty
      });

      // Only fetch roles if user exists
      if (parseData?.user?._id) {
        fetchRoles(parseData.user._id);
      }
    }
    //eslint-disable-next-line
  }, []);

  const fetchRoles = async (userId) => {
    try {
      const res = await axios.get(`/api/auth/user-roles/${userId}`); // Endpoint to fetch roles
      if (res.status === 200) {
        setAuth((prev) => {
          const updatedAuth = {
            ...prev,
            roles: res.data.roles,
          };
          // Update localStorage with roles
          localStorage.setItem("auth", JSON.stringify(updatedAuth));
          return updatedAuth;
        });
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
