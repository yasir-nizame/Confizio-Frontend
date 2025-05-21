import React, { useState } from "react";
import { useAuth } from "../context/Auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu visibility

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully", {
      duration: 3000,
    });
    navigate("/login");
  };

  return (
    <nav className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white text-2xl font-bold mb-4 md:mb-0">
          Confizio
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden flex items-center mb-4 md:mb-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
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
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navbar Links */}
        <div
          className={`md:flex space-x-8 ${
            menuOpen ? "block" : "hidden"
          } md:block mb-4 md:mb-0`}
        >
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
            <a href="/" className="relative text-white hover:text-light group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#about"
              className="relative text-white group hover:text-light"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5  bg-secondary  transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/all-conferences"
              className="relative text-white group hover:text-light"
            >
              CFP
              <span className="absolute bottom-0 left-0 w-0 h-0.5  bg-secondary  transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
        {/* User Dropdown */}
        {!auth?.user ? (
          <div className="space-x-4 mb-4 md:mb-0">
            <a
              href="/register"
              className="bg-secondary hover:bg-secondaryAlt-dark text-light px-4 py-2 rounded-md"
            >
              Register
            </a>
            <a
              href="/login"
              className="bg-accent text-light px-4 py-2 rounded-md hover:bg-accentAlt-dark"
            >
              Login
            </a>
          </div>
        ) : (
          <>
            <div className="relative inline-block text-left mb-4 md:mb-0">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center bg-accent text-white px-4 py-2 rounded-md 
              "
              >
                {auth.user.name}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06 0L10 10.293l3.71-3.08a.75.75 0 111.04 1.08l-4.25 3.5a.75.75 0 01-.98 0l-4.25-3.5a.75.75 0 010-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <ul>
                      <li>
                        <a
                          href={`/${
                            auth?.user?.role === 1
                              ? "admindashboard/admin-dashboard"
                              : "userdashboard/user-dashboard"
                          }`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
