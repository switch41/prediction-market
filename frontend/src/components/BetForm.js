import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../config"; // Ensure this is correct


const BetForm = () => {
  const [predictionId, setPredictionId] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("true"); // "true" for Yes, "false" for No

  const placeBet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.placeBet(
        parseInt(predictionId),
        selectedOutcome === "true", // Convert string to boolean
        { value: ethers.utils.parseEther(betAmount) }
      );

      await tx.wait();
      alert("Bet placed successfully!");
    } catch (error) {
      console.error("Bet placement failed:", error);
      alert("Error placing bet!");
    }
  };

  return (
    <div>
      <h2>Place a Bet</h2>
      <input
        type="number"
        placeholder="Prediction ID"
        value={predictionId}
        onChange={(e) => setPredictionId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Bet Amount (ETH)"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
      />
      <select value={selectedOutcome} onChange={(e) => setSelectedOutcome(e.target.value)}>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <button onClick={placeBet}>Place Bet</button>
    </div>
  );
};

export default BetForm;
