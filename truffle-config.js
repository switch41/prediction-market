module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777", // Must match Ganache's network ID
      gas: 4000000, // 4 million gas
      gasPrice: 20000000000 // 20 Gwei
    }
  },
  compilers: {
    solc: {
      version: "0.5.16",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "constantinople" // Critical for 0.5.16
      }
    }
  }
};