import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateRole() {
  const [formData, setFormData] = useState({
    roleName: "",
    minCTC: "",
    maxCTC: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Add your logic to send the role data to the server
    // For example, you can use fetch or any other API library

    try {
      // Replace the following with your actual API endpoint
      const res = await fetch("/api/v1/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseJSON = await res.json();

      if (res.ok && responseJSON.success) {
        // Handle success, you might want to redirect or show a success message
        toast.success("Role created successfully");
      } else {
        // Handle failure, show an error message
        toast.error(responseJSON.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-2">
      <div className="max-w-sm mx-auto p-3 my-16 flex flex-col gap-3 border bg-white">
        <h1 className="text-center">Create Role</h1>
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            id="roleName"
            placeholder="Role Name"
            autoComplete="off"
            onChange={handleChange}
            value={formData.roleName}
          />
          <input
            type="number"
            id="minCTC"
            placeholder="Minimum CTC"
            autoComplete="off"
            onChange={handleChange}
            value={formData.minCTC}
          />
          <input
            type="number"
            id="maxCTC"
            placeholder="Maximum CTC"
            autoComplete="off"
            onChange={handleChange}
            value={formData.maxCTC}
          />
          <input
            type="text"
            id="location"
            placeholder="Location"
            autoComplete="off"
            onChange={handleChange}
            value={formData.location}
          />
          <button
            className={`bg-accentRed border border-black text-white h-12 hover:bg-accentDarkRed transition duration-500 ease-in-out ${
              loading ? "opacity-50" : "opacity-100"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="ml-2">Creating Role...</span>
            ) : (
              "Create Role"
            )}
          </button>
        </form>
        <div className="text-center">
          <div>
            Back to{" "}
            <Link
              to="/dashboard"
              className="text-accentRed hover:underline font-semibold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
