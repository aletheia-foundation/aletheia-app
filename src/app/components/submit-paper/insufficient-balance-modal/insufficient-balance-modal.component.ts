import {Component, Input, OnInit} from '@angular/core'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import {HttpClient} from '@angular/common/http'
import {Config} from '../../../../../config/Config'
import {NotificationsService} from 'angular2-notifications'
import {ErrorHandlerService} from '../../../providers/error-handler/error-handler.service'
import {Web3AccountService} from '../../../providers/web3/web3-account/web3-account.service'
import {Web3ClientService} from '../../../providers/web3/web3-client/web3-client.service'

@Component({
  selector: 'insufficient-balance-modal',
  templateUrl: './insufficient-balance-modal.component.html',
  styleUrls: ['./insufficient-balance-modal.component.scss']
})
export class InsufficientBalanceModalComponent implements OnInit {
  captchaAnswer: string
  awaitingFaucetResult: boolean
  captchaUrl: string

  constructor(
    public activeModal: NgbActiveModal,
              private http: HttpClient,
              private config: Config,
              private notificationsService: NotificationsService,
              private errorHandler: ErrorHandlerService,
              private accountService: Web3AccountService,
              private web3Client: Web3ClientService
  ) {
  }

  ngOnInit() {
    this.captchaUrl = this.generateCaptchaUrl()
  }

  onSubmitAnswer() {
    const requestArgs = {
      receiver: this.accountService.getAccount(),
      captcha: this.captchaAnswer
    }
    this.awaitingFaucetResult = true
    this.http.post(this.config.faucetUrl, requestArgs)
    .toPromise()
    .then((result: any) => {
      if (result.error || !result.success) {
        this.captchaUrl = this.generateCaptchaUrl()
        this.captchaAnswer = ''
        this.awaitingFaucetResult = false
        return this.errorHandler.handleError(result.error, result.error.message)
      }
      return this.web3Client.awaitTransaction(result.success.txHash)
      .then(() => {
        this.awaitingFaucetResult = false
        this.notificationsService.success('Success', 'You have been granted Aletheia Goodwill')
        this.activeModal.close()
      })
    })
    .catch((err) => {
      this.awaitingFaucetResult = false
      this.captchaUrl = this.generateCaptchaUrl()
      this.errorHandler.handleError(err, 'Unable to recieve Aletheia Goodwill')
    })
  }

  generateCaptchaUrl(): string {
    // include the time to trigger refresh
    return `${this.config.faucetUrl}/captcha.svg?${new Date().getTime()}`
  }
}
