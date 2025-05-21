import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Spinner = ({ path = "/login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <h1 className="text-center text-xl">
        Redirecting to you in {count} second{count !== 1 ? "s" : ""}...
      </h1>
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
