import contract from 'truffle-contract'
import {Inject, Injectable} from '@angular/core'
import {Config} from '../../../../config/Config'
import * as AletheiaJson from '../../../../build/contracts/Aletheia.json'
import * as ManuscriptIndexJson from '../../../../build/contracts/ManuscriptIndex.json'
import * as MinimalManuscriptJson from '../../../../build/contracts/MinimalManuscript.json'
import {Web3AccountService} from '../web3/web3-account/web3-account.service'
import {Web3Provider} from '../web3/web3-provider/web3-provider.token'
import {Web3NetworkIdPromise} from '../web3/web3-network-id/web3-network-id.token'

export class MockContractLoaderService {
  public loadAletheia() {}
  public minimalManuscriptAt(manuscriptAddress) {}
}

@Injectable()
export class ContractLoaderService {

  constructor(private config: Config,
              private web3Account: Web3AccountService,
              @Inject(Web3Provider) private web3Provider: any,
              @Inject(Web3NetworkIdPromise) private networkIdPromise: Promise<any>) {
  }

  public loadAletheia(): Promise<any> {
    return this.loadContract(AletheiaJson)
  }

  public loadManuscriptIndex(): Promise<any> {
    return this.loadContract(ManuscriptIndexJson)
  }

  public minimalManuscriptAt(manuscriptAddress): any {
    return this.loadContractAtAddress(MinimalManuscriptJson, manuscriptAddress)
  }

  private loadContract(ContractJson: any) {
    return this.networkIdPromise.then((networkId) => {
      const contractInstance = contract(ContractJson)
      const networkInfo = (<any> ContractJson).networks[networkId]
      if (!networkInfo) {
        const errorMessage = `Unable to find aletheia contract on blockchain with networkId: ${networkId}
        It's probably because 'truffle migrate' has not been run since restarting the geth node.
        Otherwise the build output might be out of date and you should pull the latest version
        `
        throw new Error(errorMessage)
      }
      contractInstance.setProvider(this.web3Provider)
      contractInstance.defaults({
        from: this.web3Account.getAccount(),
        gas: this.config.web3.defaultGas
      })
      return contractInstance.at(networkInfo.address)
    })
  }

  private loadContractAtAddress(ContractJson, contractAddress): Promise<any> {
    const manuscript = contract(ContractJson)
    manuscript.setProvider(this.web3Provider)
    manuscript.defaults({
      from: this.web3Account.getAccount(),
      gas: this.config.web3.defaultGas
    })
    return manuscript.at(contractAddress)
  }
}
