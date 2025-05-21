import React, { useEffect } from "react";
import Layout from "../components/Layout";
import ServiceCard from "./ServiceCard";
import AboutUs from "./AboutUs";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Layout title="Confera Flow - Home">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-center text-center text-white px-4">
        <img
          src="/home.webp"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        <div className="bg-black bg-opacity-50 absolute inset-0 -z-5"></div>
        <div className="relative z-10 p-4 max-w-2xl">
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-6 text-light"
            data-aos="fade-up"
          >
            Managing Conferences Made
          </h1>
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-6 text-accent"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Effortless!
          </h1>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 px-4">
        <h2
          className="text-3xl md:text-4xl font-semibold text-center mb-8"
          data-aos="fade-up"
        >
          Features
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div data-aos="fade-right">
            <ServiceCard
              title="Conference Management"
              description="Streamline your conference workflows."
            />
          </div>
          <div data-aos="fade-left">
            <ServiceCard
              title="Registration"
              description="Customizable forms for attendee registration."
            />
          </div>
          <div data-aos="fade-right">
            <ServiceCard
              title="Paper Submission"
              description="Efficient and simple submission process."
            />
          </div>
          <div data-aos="fade-left">
            <ServiceCard
              title="Paper Review"
              description="Detailed feedback for submitted papers."
            />
          </div>
          <div data-aos="fade-right">
            <ServiceCard
              title="Communication Management"
              description="Automated notifications for stakeholders."
            />
          </div>
          <div data-aos="fade-left">
            <ServiceCard
              title="Plagiarism Detection"
              description="Quick and detailed plagiarism reports."
            />
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-4" data-aos="fade-up">
        <AboutUs />
      </section>
    </Layout>
  );
};

export default Home;
