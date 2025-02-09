import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { getContract } from "./config";
import PredictionList from "./components/PredictionList";
import BetForm from "./components/BetForm";
import WithdrawButton from "./components/WithdrawButton";
import CreatePrediction from "./components/CreatePrediction";
import "./styles.css";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          const contractInstance = getContract(web3Instance.eth);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing web3:", error);
          alert("Failed to connect to MetaMask!");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    initializeWeb3();
  }, []);

  return (
    <div>
      <h1>Prediction Market</h1>
      {account ? <p>Connected Account: {account}</p> : <p>Not connected</p>}
      {contract ? (
        <>
          <button onClick={async () => {
            try {
              const count = await contract.methods.getPredictionsCount().call();
              console.log("Predictions count:", count);
              alert(`Number of predictions: ${count}`);
            } catch (error) {
              console.error("Error calling getPredictionsCount:", error);
            }
          }}>
            Test Contract
          </button>
          <CreatePrediction contract={contract} account={account} />
          <PredictionList contract={contract} />
          <BetForm contract={contract} account={account} />
          <WithdrawButton contract={contract} account={account} />
        </>
      ) : (
        <p>Loading contract...</p>
      )}
    </div>
  );
  
};

export default App;
