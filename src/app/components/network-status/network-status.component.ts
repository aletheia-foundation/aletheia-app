import {Component, Inject, OnInit} from '@angular/core'
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'
import {ConnectionStatusEnum, Web3NetworkStatus} from '../../providers/web3/web3-monitor/web3-network-status'


@Component({
  selector: 'network-status',
  templateUrl: './network-status.component.html',
  styleUrls: ['./network-status.component.scss']
})
export class NetworkStatusComponent {
  web3Monitor: Web3MonitorService

  constructor(
              web3Monitor: Web3MonitorService) {
    this.web3Monitor = web3Monitor
    this.web3Monitor.start()
  }

  isConnected() {
    return this.web3Monitor.networkStatus.getValue().getStatus() === ConnectionStatusEnum.Connected
  }

  isError() {
    return this.web3Monitor.networkStatus.getValue().getStatus() === ConnectionStatusEnum.Error
  }

  isNoPeers() {
    return this.web3Monitor.networkStatus.getValue().getStatus() === ConnectionStatusEnum.NoPeers
  }
}
