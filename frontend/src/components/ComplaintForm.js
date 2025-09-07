import React, { useState } from "react";

function ComplaintForm() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.trim().length < 10) {
      setMessage("⚠️ Please provide at least 10 characters.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("location_text", location);
    formData.append("incident_time", incidentTime);
    if (evidence) formData.append("evidence", evidence);

    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Complaint submitted successfully!");
        setDescription("");
        setLocation("");
        setIncidentTime("");
        setEvidence(null);
      } else {
        setMessage("❌ Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setMessage("❌ Network error. Is backend running?");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Submit a Complaint
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incident Time
          </label>
          <input
            type="datetime-local"
            value={incidentTime}
            onChange={(e) => setIncidentTime(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evidence (photo/video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setEvidence(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
        >
          Submit
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default ComplaintForm;
