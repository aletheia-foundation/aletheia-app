import contract from 'truffle-contract'
import * as MinimalManuscriptJson  from '../../../../build/contracts/MinimalManuscript.json'
import * as AletheiaJson  from '../../../../build/contracts/Aletheia.json'
import * as SubmittedPapersIndexJson  from '../../../../build/contracts/SubmittedPapersIndex.json'

export class ContractFactories {

  static minimalManuscriptPromiseFactory( provider, networkIdPromise):Promise<any> {
    return ContractFactories.loadContract(networkIdPromise, provider, MinimalManuscriptJson)
  }

  static aletheiaPromiseFactory( provider, networkIdPromise):Promise<any> {
    return ContractFactories.loadContract(networkIdPromise, provider, AletheiaJson)
  }

  static submittedPapersIndexPromiseFactory( provider, networkIdPromise):Promise<any> {
    return ContractFactories.loadContract(networkIdPromise, provider, SubmittedPapersIndexJson)
  }

  static loadContract(networkIdPromise: Promise<string>, provider: any, ContractJson: any) {
    return networkIdPromise.then((networkId) => {
      const indexContract = contract(ContractJson)
      const networkInfo = (<any> ContractJson).networks[networkId]
      if (!networkInfo) {
        const errorMessage = `Unable to find aletheia contract on blockchain with networkId: ${networkId}
        It's probably because 'truffle migrate' has not been run since restarting the geth node.
        Otherwise the build output might be out of date and you should pull the latest version
        `
        throw new Error(errorMessage)
      }
      indexContract.setProvider(provider)
      return indexContract.at(networkInfo.address)
    })
  }
}