import {Inject, Injectable} from '@angular/core'
import {Web3Token} from '../web3/web3.token'

export function loadWeb3Account(web3AccountService: Web3AccountService) {
  return () => web3AccountService.load()
}

export class MockWeb3AccountService {
  getAccount() {
  }
}

@Injectable()
export class Web3AccountService {
  account: string

  constructor(@Inject(Web3Token) private web3: any) {
  }

  getAccount() {
    return this.account
  }

  load() {
    return new Promise((res, rej) => {
      const existingAcc = this.web3.eth.accounts
      if (existingAcc && existingAcc[0]) {
        this.account = existingAcc[0]
      } else {
        this.account = this.web3.personal.newAccount()
      }
      return res(this.account)
    })
  }
}
