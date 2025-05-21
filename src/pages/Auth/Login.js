import React from "react";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth";

const Login = () => {
  // Initialize the useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("api/auth/login", data);
      if (res.data.success) {
        toast.success(res.data.message);
        // Save the token or user data to localStorage or context
        localStorage.setItem("token", res.data.token);
  
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        // Redirect to the home page
        // navigate("/");
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // Show backend error message if available
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout title={"Confizio - Login"}>
      <div className="min-h-screen bg-white text-primary flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-lg">
          <h1
            className="text-2xl font-bold text-center mb-6"
            style={{ color: "#5F6F52" }}
          >
            Login
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label
                className="block text-sm font-medium text-primaryAlt-dark"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primaryAlt-dark focus:outline-none border-secondaryAlt-dark text-primary ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-sm font-medium text-primaryAlt-dark"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primaryAlt-dark focus:outline-none border-secondaryAlt-dark text-primary ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs italic">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-1/2 py-2 px-4 text-white rounded-md bg-primaryAlt-dark hover:bg-primaryAlt-light focus:outline-none focus:ring-2 focus:ring-primaryAlt-dark"
              >
                Login
              </button>
              <a href="/forgot-password" className="ml-4">
                Forgot Password
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
