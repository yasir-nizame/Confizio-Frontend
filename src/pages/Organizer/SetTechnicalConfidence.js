import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";

const TechnicalWeightageForm = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conferenceName, setConferenceName] = useState("");
  const { id: conferenceId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [initialWeightage, setInitialWeightage] = useState({});
  const [weightage, setWeightage] = useState({
    originality: 30,
    technicalQuality: 25,
    significance: 20,
    clarity: 15,
    relevance: 10,
  });

  useEffect(() => {
    if (!conferenceId) {
      setLoading(false);
      return;
    }

    axios
      .get(`/api/organizer/get-technical-weightage/${conferenceId}`)
      .then((res) => {
        console.log("API response:", res.data);

        const { _id, conferenceId, __v, ...filteredData } = res.data;
        setWeightage(filteredData);
        setInitialWeightage(filteredData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [conferenceId]);

  const handleChange = (e) => {
    setWeightage({ ...weightage, [e.target.name]: Number(e.target.value) });
  };

  const handleSave = async () => {
    const total =
      weightage.originality +
      weightage.technicalQuality +
      weightage.significance +
      weightage.clarity +
      weightage.relevance;

    if (total !== 100) {
      setError("Total weightage must be exactly 100%.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/organizer/set-technical-weightage",
        {
          conferenceId,
          ...weightage,
        }
      );
      toast.success(response.data.message);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleCancel = () => {
    setWeightage(initialWeightage);
    setIsEditing(false);
    setError(null);
  };
  return (
    <>
      {/* Header Section */}
      <header className="bg-gradient-to-r from-primary to-secondary py-6 shadow-md mt-5 w-1/2 justify-center mx-auto rounded-lg">
        <h2 className="text-2xl font-bold text-white text-center tracking-tight">
          {conferenceName || "Conference"} - Technical Weightage Criteria
        </h2>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <form className="space-y-6">
                  {Object.keys(weightage).map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <label className="text-gray-800 font-medium text-lg capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name={key}
                          value={weightage[key]}
                          onChange={handleChange}
                          className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-center"
                          min="0"
                          max="100"
                        />
                      ) : (
                        <span className="text-gray-700 font-medium bg-secondaryAlt-light px-3 py-1 rounded-full">
                          {weightage[key]}%
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Buttons */}
                  <div className="flex justify-center gap-4 pt-6">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5"
                          onClick={handleSave}
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 focus:outline-none transition-all duration-200"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondaryAlt-dark focus:ring-4 focus:ring-offset-primaryAlt-light focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Criteria
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default TechnicalWeightageForm;
