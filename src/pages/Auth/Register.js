import React from "react";
import Layout from "../../components/Layout";
import { Toaster, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Register = () => {
  // Get query parameters
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role"); // Fetch role from the query parameter
  const conferenceName = searchParams.get("conferenceName"); // Fetch role from the query parameter
  const conferenceId = searchParams.get("conferenceId"); // Fetch role from the query parameter
  const isReviewer = role === "reviewer";
  const [expertiseOptions, setExpertiseOptions] = useState([]); // Store expertise list

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Needed to update checkbox state properly
    watch, // Allows real-time updates
  } = useForm({
    defaultValues: {
      expertise: [],
    },
  });
  const navigate = useNavigate();
  // Fetch conference expertise
  useEffect(() => {
    const fetchConference = async () => {
      try {
        const res = await axios.get(
          `/api/conference/get-conference/${conferenceId}`
        );
        setExpertiseOptions(res.data.expertise); // Assuming expertise is an array
      } catch (error) {
        console.error("Error fetching conference:", error);
        toast.error("Something went wrong while fetching conference details");
      }
    };

    if (conferenceId) fetchConference();
  }, [conferenceId]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data, // Existing form data
        conferenceName,
        conferenceId,
        role,
      };
      const res = await axios.post("api/auth/register", payload);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong", {
        duration: 3000,
      });
    }
  };

  return (
    <Layout title={"Confizio - Register"}>
      <div className="min-h-screen bg-white text-primary flex items-center justify-center my-10">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">
            Register
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primaryAlt-dark"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primaryAlt-dark focus:outline-none border-secondaryAlt-dark text-primary ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primaryAlt-dark"
              >
                Email
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primaryAlt-dark"
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

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-primaryAlt-dark"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                {...register("phone", { required: "Phone number is required" })}
                className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primaryAlt-dark focus:outline-none border-secondaryAlt-dark text-primary ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs italic">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-primaryAlt-dark"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter your address"
                {...register("address", { required: "Address is required" })}
                className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primaryAlt-dark focus:outline-none border-secondaryAlt-dark text-primary ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs italic">
                  {errors.address.message}
                </p>
              )}
            </div>
            {/* Expertise Checkboxes (Only for Reviewers) */}
            {isReviewer &&
              Array.isArray(expertiseOptions) &&
              expertiseOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-primaryAlt-dark">
                    Areas & field of specialization
                  </label>
                  {expertiseOptions.map((expertise, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id={`expertise-${index}`}
                        {...register("expertise")}
                        value={expertise}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`expertise-${index}`}
                        className="text-sm text-primary"
                      >
                        {expertise}
                      </label>
                    </div>
                  ))}
                  {errors.expertise && (
                    <p className="text-red-500 text-xs italic">
                      {errors.expertise.message}
                    </p>
                  )}
                </div>
              )}

            {/* {isReviewer && (
              <div>
                <label
                  htmlFor="expertise"
                  className="block text-sm font-medium text-primaryAlt-dark"
                >
                  Expertise
                </label>
                <input
                  type="text"
                  id="expertise"
                  placeholder="Enter your expertise"
                  {...register("expertise", {
                    required: "Expertise is required for reviewers",
                  })}
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primaryAlt-dark focus:outline-none border-secondaryAlt-dark text-primary ${
                    errors.expertise ? "border-red-500" : ""
                  }`}
                />
                {errors.expertise && (
                  <p className="text-red-500 text-xs italic">
                    {errors.expertise.message}
                  </p>
                )}
              </div>
            )} */}

            <div>
              <label
                htmlFor="recovery_key"
                className="block text-sm font-medium text-primaryAlt-dark"
              >
                Recovery Key
              </label>
              <input
                type="text"
                id="recovery_key"
                placeholder="Enter your recovery key"
                {...register("recovery_key", {
                  required: "Recovery Key is required",
                })}
                className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primaryAlt-dark focus:outline-none border-secondaryAlt-dark text-primary ${
                  errors.recovery_key ? "border-red-500" : ""
                }`}
              />
              {errors.recovery_key && (
                <p className="text-red-500 text-xs italic">
                  {errors.recovery_key.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-1/2 py-2 px-4 mt-3 text-white rounded-md bg-primaryAlt-dark hover:bg-primaryAlt-light focus:outline-none focus:ring-2 focus:ring-primaryAlt-dark"
              >
                {isReviewer ? "Register as Reviewer" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
