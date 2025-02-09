import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../config";

const PredictionList = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!window.ethereum) {
        setError("Please install MetaMask to use this application!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      try {
        const count = await contract.getPredictionsCount();
        const promises = [];

        // Load predictions in parallel
        for (let i = 0; i < count; i++) {
          promises.push(contract.predictions(i));
        }

        const results = await Promise.all(promises);
        const loadedPredictions = results.map((p, index) => ({
          id: index,
          description: p.description,
          endTime: new Date(p.endTime.toNumber() * 1000).toLocaleString(),
          status: p.status === 0 ? "Active" : "Resolved",
          outcome: p.status === 1 ? (p.outcome ? "Yes" : "No") : "Pending",
        }));

        setPredictions(loadedPredictions);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError("Failed to load predictions. Please try again later.");
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div>
      <h2>Predictions</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {predictions.length === 0 ? (
        <p>No predictions available. Be the first to create one!</p>
      ) : (
        <ul>
          {predictions.map((prediction) => (
            <li key={prediction.id}>
              <strong>{prediction.description}</strong> <br />
              Status: {prediction.status} <br />
              End Time: {prediction.endTime} <br />
              Outcome: {prediction.outcome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PredictionList;
