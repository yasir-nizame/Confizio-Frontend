import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { useAuth } from "../context/Auth";
import toast from "react-hot-toast";
import axios from "axios";
import Sidebar from "./UserSidebar";

const UserProfile = () => {
  // Context and states
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Pre-fill user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        const ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Confizio - Your Profile">
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="container mx-auto p-6 flex justify-center items-center">
          <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">
              Your Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Enter Your Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Enter Your Email"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Enter New Password"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Enter Your Phone Number"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Enter Your Address"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-1/2 bg-accent hover:bg-accentAlt-dark text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
