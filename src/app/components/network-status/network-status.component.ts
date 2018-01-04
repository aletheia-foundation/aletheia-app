import {Component, Inject, OnInit} from '@angular/core'
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {Web3NetworkStatus} from '../../providers/web3/web3-monitor/web3-network-status'
import {ADDRESS} from '../../Injection-tokens'

enum StatusEnum {
  Connected,
  Error,
  NoPeers
}

@Component({
  selector: 'network-status',
  templateUrl: './network-status.component.html',
  styleUrls: ['./network-status.component.scss']
})
export class NetworkStatusComponent {
  web3Monitor: Web3MonitorService
  address: string
  peers: number
  status: StatusEnum
  balance: number

  constructor(
              web3Monitor: Web3MonitorService) {
    this.web3Monitor = web3Monitor

    web3Monitor.addListener('network-update', (err, status : Web3NetworkStatus) => {
      if(err) {
        this.peers = 0
        this.status = StatusEnum.Error
        this.address = ''
        this.balance = 0
        return
      }

      if (status.peers === 0) {
       this.status = StatusEnum.NoPeers
      }
      else {
        this.status = StatusEnum.Connected
      }
      this.address = status.address
      this.peers = status.peers
      this.balance = status.balance
    })

    web3Monitor.addListener('balance-update', (err, ethBalance) => {
      if(err) {
        this.status = StatusEnum.Error
        return
      }
      this.balance = ethBalance
    })
  }

  isConnected() {
    return this.status === StatusEnum.Connected
  }

  isError() {
    return this.status === StatusEnum.Error
  }

  isNoPeers() {
    return this.status === StatusEnum.NoPeers
  }
}
