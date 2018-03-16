module.exports = {
  networks: {
    testnet: {
      host: "localhost",
      port: 8545,
      network_id: "123039281",
      gas: 4600000
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4600000
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      gas: 4600000
    }
  },
  rpc: {
      host: "127.0.0.1",
      port: 8545
  }
};
