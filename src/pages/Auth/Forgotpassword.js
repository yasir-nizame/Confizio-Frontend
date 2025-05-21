import React from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/forgot-password", data);
      if (res?.data?.success) {
        toast.success(res.data.message, { duration: 3000 });
        navigate("/login");
      } else {
        toast.error(res.data.message, { duration: 3000 });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { duration: 3000 });
    }
  };

  return (
    <Layout title={"Confizio - Forgot Password"}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-primaryAlt-dark">
            Reset Password
          </h2>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-bold mb-2 text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Recovery Key Field */}
          <div className="mb-4">
            <label
              htmlFor="recovery_key"
              className="block text-sm font-bold mb-2 text-gray-700"
            >
              Recovery Key
            </label>
            <input
              type="text"
              id="recovery_key"
              placeholder="Enter your recovery key"
              {...register("recovery_key", {
                required: "Recovery key is required",
              })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.recovery_key ? "border-red-500" : ""
              }`}
            />
            {errors.recovery_key && (
              <p className="text-red-500 text-xs italic">
                {errors.recovery_key.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-bold mb-2 text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter your new password"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.newPassword ? "border-red-500" : ""
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Submit + Back Button */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-accent hover:bg-accentAlt-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-primary hover:text-primaryAlt-dark underline font-semibold focus:outline-none"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
