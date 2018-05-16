import {ManuscriptVotingStatus} from './manuscript-voting-status'
export class ManuscriptViewModel {
  authors: string[]
  dataAddress: string
  contractAddress: string
  blocksRemaining: number
  votingStatus: ManuscriptVotingStatus
  title: string
}
