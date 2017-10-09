import Web3 from 'web3'

export function web3ProviderFactory() {
  return new Web3.providers.HttpProvider('http://localhost:8545')

}
