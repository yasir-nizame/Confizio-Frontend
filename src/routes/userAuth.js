import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { toast } from "react-hot-toast"; // Make sure react-hot-toast is installed

export default function UserPrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      if (!auth?.token) {
        setOk(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/user-auth", {
          headers: {
            Authorization: auth.token,
          },
        });

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);

        // Handle token expiration
        if (error.response?.data?.name === "TokenExpiredError") {
          toast.error("Your session has expired. Kindly login again.");
        } else {
          toast.error("Authentication failed. Please login again.");
        }

        // Clear auth and redirect
        setAuth({ user: null, token: "" });
        localStorage.removeItem("auth");
        navigate("/login");
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token, setAuth, navigate]);

  return ok ? <Outlet /> : <Spinner />;
}
