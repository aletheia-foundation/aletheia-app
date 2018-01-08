import { TestBed, inject } from '@angular/core/testing'

import { ErrorHandlerService } from './error-handler.service'
import {NotificationsService} from 'angular2-notifications'

class MockNotificationService {
  error(title: String, message: String, options: any){}
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

  it('should be created', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    service.handleError(new Error("theerror"))
    expect(mockNotificationService.error).toHaveBeenCalledWith("Error", "theerror")
  }))
})
