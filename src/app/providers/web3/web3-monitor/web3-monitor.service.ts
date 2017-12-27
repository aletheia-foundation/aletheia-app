import {Inject, Injectable} from '@angular/core'
import {EventEmitter} from 'events'
import {ADDRESS, POLL_INTERVAL_MS} from '../../../Injection-tokens'
import {Web3Token} from '../web3/web3.token'
import {Web3NetworkStatus} from './web3-network-status'



@Injectable()
export class Web3MonitorService extends EventEmitter {
  address: string
  web3: any
  poll: any
  constructor(@Inject(POLL_INTERVAL_MS) pollInterval: string,
              @Inject(ADDRESS) address: string,
              @Inject(Web3Token) web3: any) {
    super()
    this.address = address
    this.web3 = web3
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
    'network-update'
    this.web3.net.getPeerCount((err, numPeers) => {
      if (err) {
        console.error(err, err.stack)
        this.emit('network-update', err)
        return
      } else {

        if(this.address === null) {
          const err = new Error('Unable to find blockchain address')
          console.error(err, err.stack)
          this.emit('network-update', err)
          return
        }
        this.web3.eth.getBalance(this.address, (err, weiBalance) => {
          const ethBalance = this.web3.fromWei(weiBalance, 'ether')
          if (err) {
            console.error(err, err.stack)
            this.emit('network-update', err)
            return
          } else {
            this.emit('network-update', null, new Web3NetworkStatus(
              numPeers,
              this.address,
              ethBalance
            ))
          }
        })
      }
    })
  }

  private checkBalance () {

  }
}
