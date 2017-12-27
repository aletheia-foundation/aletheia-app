export class Web3NetworkStatus {
  constructor (peers: number, account: string, balance: number ){
    this.peers = peers
    this.account = account
    this.balance = balance
  }
  peers: number
  account: string
  balance: number
  // todo: add blocknumber
}
