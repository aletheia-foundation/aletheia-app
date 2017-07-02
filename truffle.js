module.exports = {
  networks: {
    testnet: {
        host: "localhost",
        port: 8545,
        network_id: "123039281"
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
