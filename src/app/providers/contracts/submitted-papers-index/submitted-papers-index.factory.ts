import contract from 'truffle-contract'

import * as SubmittedPapersIndexJson  from '../../../../../build/contracts/SubmittedPapersIndex.json'

export function submittedPapersIndexPromiseFactory( provider, networkIdPromise):Promise<any> {
  return networkIdPromise.then((networkId) => {
    const indexContract = contract(SubmittedPapersIndexJson)
    const networkInfo = (<any> SubmittedPapersIndexJson).networks[networkId]
    if(!networkInfo) {
      // It's probably because 1truffle migrate1 has not been run since restarting testrpc.
      // Otherwise the build output might be out of date and you should pull latest version
      throw new Error("Unable to find aletheia contract on blockchain with networkId: " + networkId)
    }
    indexContract.setProvider(provider)
    return indexContract.at(networkInfo.address)
  })
}
