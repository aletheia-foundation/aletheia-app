import {Inject, Injectable} from '@angular/core'
import {POLL_INTERVAL_MS} from '../../../Injection-tokens'
import {Web3Token} from '../web3/web3.token'
import {Web3NetworkStatus} from './web3-network-status'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Web3AccountService} from '../web3-account/web3-account.service'

@Injectable()
export class Web3MonitorService {
  web3: any
  poll: any
  public networkStatus: BehaviorSubject<Web3NetworkStatus>

  constructor(@Inject(POLL_INTERVAL_MS) pollInterval: string,
              private accountService: Web3AccountService,
              @Inject(Web3Token) web3: any) {
    this.web3 = web3
    this.networkStatus = new BehaviorSubject(new Web3NetworkStatus(
      null,
      0,
      '',
      0
    ))
    this.poll = setInterval(this.onPoll.bind(this), pollInterval)
    this.checkConnection()
  }

  stop() {
    clearInterval(this.poll)
  }

  isConnected() {
    return this.web3.isConnected()
  }

  private onPoll() {
    this.checkConnection()
  }

  private checkConnection() {
    this.web3.net.getPeerCount((err, numPeers) => {
      if (err) {
        console.error(err, err.stack)
        this.networkStatus.next(new Web3NetworkStatus(err, 0, '', 0))
        return
      } else {
        const account = this.accountService.getAccount()
        if (account === null) {
          const error = new Error('Unable to find blockchain address')
          console.error(error, error.stack)
          this.networkStatus.next(new Web3NetworkStatus(error, 0, '', 0))
          return
        }
        this.web3.eth.getBalance(account, (error, weiBalance) => {
          const ethBalance = this.web3.fromWei(weiBalance, 'ether')
          if (error) {
            console.error(error, error.stack)
            this.networkStatus.next(new Web3NetworkStatus(error, 0, '', 0))
            return
          } else {
            this.networkStatus.next(new Web3NetworkStatus(
              null,
              numPeers,
              account,
              ethBalance
            ))
          }
        })
      }
    })
  }
}
