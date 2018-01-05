import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPaperComponent } from './submit-paper.component';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Web3NetworkStatus} from '../../providers/web3/web3-monitor/web3-network-status'
import {Web3MonitorService} from '../../providers/web3/web3-monitor/web3-monitor.service'

class MockWeb3ClientService {}

class MockWeb3MonitorService {
  public networkStatus: BehaviorSubject<Web3NetworkStatus> = new BehaviorSubject(new Web3NetworkStatus(null, 0, '', 0))
}


describe('SubmitPaperComponent', () => {
  let component: SubmitPaperComponent;
  let fixture: ComponentFixture<SubmitPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPaperComponent ],
      providers: [
        {provide: Web3ClientService, useClass: MockWeb3ClientService},
        {provide: Web3MonitorService, useClass: MockWeb3MonitorService}
        ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
