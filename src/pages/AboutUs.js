import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* About Us Section */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center md:space-x-8"
        data-aos="fade-right"
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 text-gray-800" id="about">
            About Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are committed to redefining conference management through
            technology. Our platform streamlines tasks for organizers, authors,
            and reviewers, making collaboration seamless and effective.
          </p>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <img
            src="/about.png"
            alt="About Us"
            className="w-[150px] h-[150px] object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Our Mission Section */}
      <div
        className="flex flex-col md:flex-row-reverse items-start md:items-center md:space-x-8"
        data-aos="fade-left"
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To simplify and elevate the way conferences are organized and
            managed. We aim to provide a robust, intuitive platform that meets
            the needs of modern conference workflows.
          </p>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <img
            src="/mission.png"
            alt="Our Mission"
            className="w-[150px] h-[150px] object-cover rounded-lg "
          />
        </div>
      </div>

      {/* Our Vision Section */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center md:space-x-8"
        data-aos="fade-right"
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a world where conference management is fully automated,
            accessible, and collaborative. By leveraging technology, we empower
            users to focus on impactful research and innovation.
          </p>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <img
            src="/vision.png"
            alt="Our Vision"
            className="w-[150px] h-[150px] object-cover rounded-lg "
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
