import { Injectable } from '@angular/core';
import {NotificationsService} from 'angular2-notifications'

@Injectable()
export class ErrorHandlerService {
  constructor(private notificationService: NotificationsService) { }

  handleError(error: Error) {
    //todo: log full error
    console.error(error)
    this.notificationService.error("Error", error.message)
  }

  //todo: handleWarning
}
