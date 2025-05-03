# Prediction Market DApp

A modern, full-stack blockchain-based prediction market built on Ethereum. Users can create, bet on, and resolve prediction events, with a beautiful Material-UI frontend and robust smart contract backend.

## Features

### Core Functionality
- Create, view, and resolve prediction events
- Modern dashboard with navigation: Home, Market, Create Event, Previous Event, My Event, Profile
- MetaMask integration for wallet connection and transactions
- Active/Previous event separation: Active predictions are shown in Market, resolved ones in Previous Events
- Responsive, clean UI using Material-UI

### Advanced Features
- Real-time updates for predictions
- User statistics and analytics (profile page)
- Category-based filtering
- Error handling and troubleshooting guidance
- Mobile-friendly, responsive design

## Workflow

1. User connects MetaMask wallet to the app.
2. User creates a new prediction event from the "Create Event" page.
3. The new event appears in the "Market" (active predictions).
4. Other users can place bets on active predictions.
5. When the event's end time is reached, the event can be resolved by the contract owner.
6. Resolved events are moved to the "Previous Event" page.
7. Users can view their own created or participated events in "My Event" and see their stats in "Profile".

## Installation

### Prerequisites
- Node.js (v16+ recommended)
- npm
- Ganache (for local Ethereum blockchain)
- MetaMask (browser extension)

### Step 1: Clone the Repository

git clone https://github.com/switch41/prediction-market.git
cd prediction-market

### Step 2: Install Dependencies

cd frontend
npm install

### Step 3: Smart Contract Deployment

1. Start Ganache on your machine.
2. Deploy the smart contract (using Truffle/Hardhat/Remix as you prefer).
3. Copy the deployed contract address and ABI to frontend/src/contracts/PredictionMarket.json.

### Step 4: Running the App

npm start

- Make sure you run this from inside the frontend directory.
- The app will start on http://localhost:3000 by default.
- If port 3000 is busy, you can run on another port when prompted.

## Usage

1. Connect MetaMask to your local Ganache network.
2. Approve MetaMask connection when prompted.
3. Create new predictions from the "Create Event" page.
4. Active predictions appear in "Market".
5. Resolved/finished predictions appear in "Previous Event".
6. View your own events and stats in "My Event" and "Profile".

## Project Structure

frontend/
  public/
    index.html
  src/
    components/
      Navbar.js
      ...
    pages/
      Home.js
      Market.js
      CreatePrediction.js
      PreviousEvent.js
      MyEvents.js
      Profile.js
    contracts/
      PredictionMarket.json
    App.js
    index.js
contracts/
  PredictionMarket.sol
migrations/
test/
truffle-config.js
README.md

## Troubleshooting

### Could not find a required file. Name: index.html
- Make sure you are running npm start from inside the frontend directory, not the project root.

### No 'from' address specified...
- Ensure MetaMask is installed, unlocked, and connected. The app now always requests MetaMask connection before sending transactions.

### Something is already running on port 3000
- Open http://localhost:3000 or choose another port when prompted.

### Babel warning about @babel/plugin-proposal-private-property-in-object
- This is now added to devDependencies. If you see the warning, run:
  npm install --save-dev @babel/plugin-proposal-private-property-in-object

## Customization

- You can further style the dashboard using Material-UI themes in src/index.js.
- To add more event categories, update the category dropdown in CreatePrediction.js and the contract if needed.

## Contributors

- Kushal Parihar ([@switch41](https://github.com/switch41))

## License

This project is licensed under the MIT License.

## Technologies Used

- Blockchain: Ethereum (Smart Contracts written in Solidity)
- Frontend: React.js, Bootstrap
- Backend: Web3.js for blockchain communication
- Development Tools: Truffle, Ganache, MetaMask

## Installation & Setup

### Prerequisites

Ensure you have the following installed:
- Node.js
- Ganache
- Truffle
- MetaMask browser extension

### Clone the Repository

git clone https://github.com/switch41/prediction-market
cd prediction-market

### Install Dependencies

npm install

### Smart Contract Deployment

truffle compile
truffle migrate --reset

### Running the Local Blockchain

Start Ganache and ensure it's connected to Truffle:
ganache-cli

### Running the Frontend

cd frontend
npm start

## Usage

1. Connect MetaMask to interact with the contract.
2. Create Predictions by setting a question and deadline.
3. View Active Predictions and interact with the contract.

## Folder Structure
contracts/                 # Smart Contracts (Solidity)
  PredictionMarket.sol   # Main contract
migrations/                # Truffle migration scripts
test/                      # Smart contract tests
frontend/                  # React frontend
  src/components/        # React components
  public/                # Static frontend assets
  package.json           # Frontend dependencies
truffle-config.js          # Truffle configuration
README.md                  # Project documentation

## Contributing

Feel free to submit pull requests for improvements and additional features!

## License

<<<<<<< HEAD
This project is licensed under the MIT License.
=======
This project is open-source and licensed under the MIT License.
>>>>>>> cebfa7e6f41668a725563d77bea0f7596bab7e39

## Contact

For questions, reach out via GitHub or email.

## Works that still need to be addressed

My frontend part is still pending. Will update it soon. Any suggestions and useful changes are appreciated.

