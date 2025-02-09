import PredictionMarketABI from "./contracts/PredictionMarket.json";

const CONTRACT_ADDRESS = "0xCc66dEB1054E8dbf4A89EBE9aAC4C08a94B93Af9"; // Replace with your latest address
const ABI = PredictionMarketABI.abi;

let predictionMarket;

export const initContract = async (web3) => {
  if (!CONTRACT_ADDRESS) {
    console.error("⚠️ Contract address is missing. Check deployment.");
    return null;
  }

  try {
    predictionMarket = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    console.log("✅ Contract Initialized at:", CONTRACT_ADDRESS);
    return predictionMarket;
  } catch (error) {
    console.error("❌ Error initializing contract:", error);
  }
};

export const getContract = () => predictionMarket;
export { CONTRACT_ADDRESS, ABI };
