export class Web3NetworkStatus {
  constructor (peers: number, address: string, balance: number ){
    this.peers = peers
    this.address = address
    this.balance = balance
  }
  peers: number
  address: string
  balance: number
  // todo: add blocknumber
}
