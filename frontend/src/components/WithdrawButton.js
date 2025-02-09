import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../config"; // Ensure this is correct


const WithdrawButton = () => {
  const [predictionId, setPredictionId] = useState("");

  const withdrawWinnings = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.withdrawWinnings(parseInt(predictionId));
      await tx.wait();
      alert("Winnings withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing winnings:", error);
      alert("Failed to withdraw winnings!");
    }
  };

  return (
    <div>
      <h2>Withdraw Winnings</h2>
      <input
        type="number"
        placeholder="Prediction ID"
        value={predictionId}
        onChange={(e) => setPredictionId(e.target.value)}
      />
      <button onClick={withdrawWinnings}>Withdraw</button>
    </div>
  );
};

export default WithdrawButton;
