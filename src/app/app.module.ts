import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import {InjectionToken, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BecomeAReviewerComponent } from './components/become-a-reviewer/become-a-reviewer.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { SubmitPaperComponent } from './components/submit-paper/submit-paper.component';

import { AppRoutingModule } from './app-routing.module';
import { ElectronService } from './providers/electron.service';

import { Web3ClientService } from './providers/web3/web3-client/web3-client.service';
import { EncodingHelperService } from './providers/encoding-helper/encoding-helper.service';
import { Web3HelperService } from './providers/web3/web3-helper/web3-helper.service'
import {Web3Provider} from './providers/web3/web3-provider/web3-provider.token'
import {web3ProviderFactory} from './providers/web3/web3-provider/web3-provider.factory'

import {SubmittedPapersIndex} from './providers/contracts/submitted-papers-index/submitted-papers-index.token'
import {submittedPapersIndexFactory} from './providers/contracts/submitted-papers-index/submitted-papers-index.factory'
import {POLL_INTERVAL_MS, WEB3_URL} from './Injection-tokens'
import {Web3Token} from './providers/web3/web3/web3.token'
import {web3Factory} from './providers/web3/web3/web3.factory'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HowItWorksComponent,
    SubmitPaperComponent,
    BecomeAReviewerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    ElectronService,
    { provide: WEB3_URL, useValue: 'http://localhost:8545'},
    {
      provide: Web3Provider,
      useFactory: web3ProviderFactory
    },
    { provide: POLL_INTERVAL_MS, useValue: '1000'},
    { provide: EncodingHelperService, useClass: EncodingHelperService},
    {
      provide: SubmittedPapersIndex,
      deps: [Web3Provider],
      useFactory: submittedPapersIndexFactory
    },
    {
      provide: Web3Token,
      deps: [Web3Provider],
      useFactory: web3Factory
    },
    { provide: Web3HelperService, useClass: Web3HelperService},
    {
      provide: Web3ClientService,
      useClass: Web3ClientService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
