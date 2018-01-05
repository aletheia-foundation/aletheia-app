import {Inject, Injectable} from '@angular/core'
import {ADDRESS, POLL_INTERVAL_MS} from '../../../Injection-tokens'
import {Web3Token} from '../web3/web3.token'
import {Web3NetworkStatus} from './web3-network-status'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'



@Injectable()
export class Web3MonitorService {
  addressPromise: Promise<string>
  web3: any
  poll: any
  public networkStatus: BehaviorSubject<Web3NetworkStatus>

  constructor(@Inject(POLL_INTERVAL_MS) pollInterval: string,
              @Inject(ADDRESS) addressPromise: Promise<string>,
              @Inject(Web3Token) web3: any) {
    this.addressPromise = addressPromise
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

  stop () {
    clearInterval(this.poll)
  }

  isConnected () {
    return this.web3.isConnected()
  }

  private onPoll () {
    this.checkConnection()
    this.checkBalance()
  }

  private checkConnection () {
    this.web3.net.getPeerCount((err, numPeers) => {
      if (err) {
        console.error(err, err.stack)
        this.networkStatus.next(new Web3NetworkStatus(err, 0, '', 0 ))
        return
      } else {
        this.addressPromise.then((address) => {
          if(address === null) {
            const err = new Error('Unable to find blockchain address')
            console.error(err, err.stack)
            this.networkStatus.next(new Web3NetworkStatus(err, 0, '', 0 ))
            return
          }
          this.web3.eth.getBalance(address, (err, weiBalance) => {
            const ethBalance = this.web3.fromWei(weiBalance, 'ether')
            if (err) {
              console.error(err, err.stack)
              this.networkStatus.next(new Web3NetworkStatus(err, 0, '', 0 ))
              return
            } else {
              this.networkStatus.next(new Web3NetworkStatus(
                null,
                numPeers,
                address,
                ethBalance
              ))
            }
          })
        })
      }
    })
  }

  private checkBalance () {

  }
}
