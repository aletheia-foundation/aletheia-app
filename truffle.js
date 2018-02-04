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
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    }
  },
  rpc: {
      host: "127.0.0.1",
      port: 8545
}
};
