import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPaperComponent } from './submit-paper.component';
import {Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'

class MockWeb3ClientService {}

describe('SubmitPaperComponent', () => {
  let component: SubmitPaperComponent;
  let fixture: ComponentFixture<SubmitPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPaperComponent ],
      providers: [{provide: Web3ClientService, useClass: MockWeb3ClientService}]
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
