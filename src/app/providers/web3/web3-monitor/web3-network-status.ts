export enum ConnectionStatusEnum {
  Connected,
  Error,
  NoPeers
}

export class Web3NetworkStatus {
  error: any
  peers: number
  address: string
  balance: number

  constructor(error: any, peers: number, address: string, balance: number) {
    this.error = error
    this.peers = peers
    this.address = address
    this.balance = balance
  }

  getStatus(): ConnectionStatusEnum {
    if (this.error) {
      return ConnectionStatusEnum.Error
    }
    if (this.peers === 0) {
      return ConnectionStatusEnum.NoPeers
    }
    return ConnectionStatusEnum.Connected
  }

  // todo: add blocknumber
}
