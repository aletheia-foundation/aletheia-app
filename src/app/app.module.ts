import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core'
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BecomeAReviewerComponent } from './components/become-a-reviewer/become-a-reviewer.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { SubmitPaperComponent } from './components/submit-paper/submit-paper.component';
import { InsufficientBalanceModalComponent } from './components/submit-paper/insufficient-balance-modal/insufficient-balance-modal.component'

import { AppRoutingModule } from './app-routing.module';
import { ElectronService } from './providers/electron.service';

import { Web3ClientService } from './providers/web3/web3-client/web3-client.service';
import { EncodingHelperService } from './providers/encoding-helper/encoding-helper.service';
import { Web3HelperService } from './providers/web3/web3-helper/web3-helper.service'
import {Web3Provider} from './providers/web3/web3-provider/web3-provider.token'
import {web3ProviderFactory} from './providers/web3/web3-provider/web3-provider.factory'

import {SubmittedPapersIndexPromise} from './providers/contracts/submitted-papers-index/submitted-papers-index.token'
import {submittedPapersIndexPromiseFactory} from './providers/contracts/submitted-papers-index/submitted-papers-index.factory'
import {ADDRESS, POLL_INTERVAL_MS, WEB3_URL} from './Injection-tokens'
import {Web3Token} from './providers/web3/web3/web3.token'
import {web3Factory} from './providers/web3/web3/web3.factory';
import { NetworkStatusComponent } from './components/network-status/network-status.component'
import { Web3MonitorService } from './providers/web3/web3-monitor/web3-monitor.service'
import {web3AccountFactory} from './providers/web3/web3-account/web3-account.factory';
import {SimpleNotificationsModule} from 'angular2-notifications'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ErrorHandlerService} from './providers/error-handler/error-handler.service'
import {IpfsClientService} from './providers/ipfs/ipfs-client/ipfs-client.service'
import {Config} from '../../config/Config'
import {configFactory} from './providers/config/config.factory';
import { ListPapersComponent } from './components/list-papers/list-papers.component'
import {Web3NetworkIdPromise} from './providers/web3/web3-network-id/web3-network-id.token'
import {web3NetworkIdFactory} from './providers/web3/web3-network-id/web3-network-id.factory'

export function loadWeb3Client(web3Client: Web3ClientService) {
  return () => {
    return web3Client.load();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HowItWorksComponent,
    SubmitPaperComponent,
    BecomeAReviewerComponent,
    NetworkStatusComponent,
    InsufficientBalanceModalComponent,
    ListPapersComponent
  ],
  entryComponents: [
    InsufficientBalanceModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [
    ElectronService,
    {provide: Config, useFactory: configFactory},
    ErrorHandlerService,
    IpfsClientService,
    { provide: WEB3_URL, useValue: 'http://localhost:8545'},
    {
      provide: Web3Provider,
      useFactory: web3ProviderFactory
    },
    { provide: POLL_INTERVAL_MS, useValue: '5000'},
    { provide: EncodingHelperService, useClass: EncodingHelperService},
    {
      provide: Web3Token,
      deps: [Web3Provider],
      useFactory: web3Factory
    },
    {
      provide: Web3NetworkIdPromise,
      deps: [Web3Token],
      useFactory: web3NetworkIdFactory
    },
    {
      provide: SubmittedPapersIndexPromise,
      deps: [Web3Provider, Web3NetworkIdPromise],
      useFactory: submittedPapersIndexPromiseFactory
    },
    { provide: Web3HelperService, useClass: Web3HelperService},
    {
      provide: Web3ClientService,
      useClass: Web3ClientService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadWeb3Client,
      deps: [Web3ClientService],
      multi: true
    },
    {
      provide: ADDRESS, deps: [Web3Token], useFactory: web3AccountFactory
    },
    {
      provide: Web3MonitorService,
      useClass: Web3MonitorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
