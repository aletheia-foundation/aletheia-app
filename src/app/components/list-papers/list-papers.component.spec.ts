import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing'

import { ListPapersComponent } from './list-papers.component'
import {MockWeb3ClientService, Web3ClientService} from '../../providers/web3/web3-client/web3-client.service'
import {ErrorHandlerService, MockErrorHandlerService} from '../../providers/error-handler/error-handler.service'

describe('ListPapersComponent', () => {
  let component: ListPapersComponent
  let compiled: any
  let fixture: ComponentFixture<ListPapersComponent>
  let mockWeb3Client: MockWeb3ClientService = new MockWeb3ClientService()
  let mockErrorHandler: MockErrorHandlerService = new MockErrorHandlerService()
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPapersComponent ],
      providers: [
        // {provide: Web3ClientService, useClass: MockWeb3ClientService},
        // {provide: ErrorHandlerService, useClass: MockErrorHandlerService},
        {provide: Web3ClientService, useValue: mockWeb3Client},
        {provide: ErrorHandlerService, useValue: mockErrorHandler}
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(ListPapersComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement
  }))

  describe('if no manuscripts are found', () => {
    beforeEach(fakeAsync(() => {
      spyOn(mockWeb3Client, 'getAllManuscripts').and.returnValue(Promise.reject(new Error("test_error")))
      spyOn(mockErrorHandler, 'handleError')
      component.ngOnInit()
      tick()
      fixture.detectChanges()
    }))
    it('should show an empty state and error', () => {
      expect(compiled.querySelector('.no-manuscripts-message')).not.toBe(null)
      expect(mockErrorHandler.handleError).toHaveBeenCalled()
    })
  })

  describe('if manuscripts are found', () => {
    beforeEach(fakeAsync(() => {
      spyOn(mockWeb3Client, 'getAllManuscripts').and.returnValue(Promise.resolve([
        '123456'
      ]))
      spyOn(mockErrorHandler, 'handleError')
      component.ngOnInit()
      tick()
      fixture.detectChanges()
    }))
    it('should show the papers', () => {
      expect(compiled.querySelector('.manuscript-item').innerText).toContain('123456')
      expect(compiled.querySelector('.no-manuscripts-message')).toBe(null)
      expect(mockErrorHandler.handleError).not.toHaveBeenCalled()
    })
  })
})
