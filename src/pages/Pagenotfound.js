import React from "react";
import Layout from "../components/Layout";

const Pagenotfound = () => {
  return (
    <Layout title={"Confizio - Error 404"}>
      <section className="flex items-center min-h-screen p-8 md:p-16 bg-gray-50 dark:bg-gray-700">
        <div className="container flex flex-col items-center px-4">
          <div className="flex flex-col gap-6 max-w-md text-center">
            <h2 className="font-extrabold text-6xl md:text-9xl text-accent dark:text-gray-100">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-xl md:text-2xl dark:text-secondary">
              Sorry, we couldn't find this page.
            </p>
            <a
              href="/"
              className="px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-semibold rounded bg-primary text-gray-50 hover:text-gray-200"
            >
              Back to home
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pagenotfound;
