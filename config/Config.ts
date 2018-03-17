export abstract class Config {
  ipfsRepoPath: string
  ipfs: IpfsConfig
  faucetUrl: string
  web3: Web3Config
}

export interface IpfsConfig {
  gatewayUrl: string
  pollIntervalMs: string
}

export interface Web3Config {
  defaultGas: 4712388
  url: string
  pollIntervalMs: number
  aletheiaContractAddress: string
}
