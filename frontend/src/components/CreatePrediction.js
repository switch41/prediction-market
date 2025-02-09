import React, { useState } from "react";

const CreatePrediction = ({ contract, account }) => {
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !duration || duration <= 0) {
      alert("Please provide a valid description and duration.");
      return;
    }

    try {
      setLoading(true);
      await contract.methods
        .createPrediction(description, duration)
        .send({ from: account });
      alert("Prediction created successfully!");
      setDescription("");
      setDuration("");
    } catch (error) {
      console.error("Error creating prediction:", error);
      alert("Failed to create prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            placeholder="E.g., Will Bitcoin reach $100k by 2025?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label>Duration (in seconds):</label>
          <input
            type="number"
            placeholder="3600 (1 hour)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreatePrediction;
