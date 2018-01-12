import contract from 'truffle-contract'

import * as submittedPapersIndexAddress from '../../../../../build/addresses/SubmittedPapersIndex.development.json'
import * as SubmittedPapersIndexJson  from '../../../../../build/contracts/SubmittedPapersIndex.json'

export function submittedPapersIndexFactory( provider ):Promise<any> {
    const indexContract = contract(SubmittedPapersIndexJson)
    indexContract.setProvider(provider)
    return indexContract.at((<any>submittedPapersIndexAddress).address)
}
