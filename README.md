# Blockchain-Based Prediction Market

## Overview

This project is a **Blockchain-Based Prediction Market**, built on **Ethereum smart contracts**, allowing users to create and participate in prediction events in a **decentralized, transparent, and immutable** manner.

## Features

✅ Create prediction events with deadlines\
✅ Secure and decentralized data storage on Ethereum\
✅ Uses **Solidity** for smart contract logic\
✅ **React.js** frontend with **Web3.js** for blockchain interaction\
✅ Smart contract deployment and testing using **Truffle and Ganache**\
✅ Game theory concepts to encourage truthful predictions

## Technologies Used

- **Blockchain**: Ethereum (Smart Contracts written in Solidity)
- **Frontend**: React.js, Bootstrap
- **Backend**: Web3.js for blockchain communication
- **Development Tools**: Truffle, Ganache, MetaMask

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Ganache](https://trufflesuite.com/ganache/)
- [Truffle](https://www.trufflesuite.com/)
- MetaMask browser extension

### Clone the Repository

```bash
git clone https://github.com/switch41/prediction-market
cd prediction-market
```

### Install Dependencies

```bash
npm install
```

### Smart Contract Deployment

```bash
truffle compile
truffle migrate --reset
```

### Running the Local Blockchain

Start Ganache and ensure it's connected to Truffle:

```bash
ganache-cli
```

### Running the Frontend

```bash
cd frontend // move to frontend folder
npm start
```

## Usage

1. **Connect MetaMask** to interact with the contract.
2. **Create Predictions** by setting a question and deadline.
3. **View Active Predictions** and interact with the contract.

## Folder Structure

```
├── contracts/                 # Smart Contracts (Solidity)
│   ├── PredictionMarket.sol   # Main contract
├── migrations/                # Truffle migration scripts
├── test/                      # Smart contract tests
├── frontend/                  # React frontend
│   ├── src/components/        # React components
│   ├── public/                # Static frontend assets
│   ├── package.json           # Frontend dependencies
├── truffle-config.js          # Truffle configuration
└── README.md                  # Project documentation
```

## Contributing

Feel free to submit **pull requests** for improvements and additional features!

## License

This project is licensed under the **MIT License**.

## Contact

For questions, reach out via GitHub or email.

---

 ## **Works that still need to be addressed **:

my frontend part is still pending will update it soon any suggestions and usefull changes are appreciated 

