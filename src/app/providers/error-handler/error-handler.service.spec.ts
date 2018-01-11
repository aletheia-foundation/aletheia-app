import { TestBed, inject } from '@angular/core/testing'

import { ErrorHandlerService } from './error-handler.service'
import {NotificationsService} from 'angular2-notifications'

class MockNotificationService {
  error(title: String, message: String, options: any){}
  warn(title: String, message: String, options: any){}
}
describe('ErrorHandlerService', () => {
  let mockNotificationService = new MockNotificationService ()
  beforeEach(() => {
    this.mockNotificationService = new MockNotificationService()
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {provide: NotificationsService, useValue: mockNotificationService}
      ]
    })
    spyOn(mockNotificationService, 'error')
  })

  it('handleError should call notification service error', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    service.handleError(new Error("test_error"))
    expect(mockNotificationService.error).toHaveBeenCalledWith("Error", "test_error")
  }))
  it('handleWarning should call notification service warning', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    service.handleWarning(new Error("test_warning"))
    expect(mockNotificationService.warn).toHaveBeenCalledWith("Warning", "test_warning")
  }))
})
