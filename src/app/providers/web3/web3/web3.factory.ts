import * as Web3 from 'web3'
export function web3Factory(provider) {
  return new Web3(provider)
}
