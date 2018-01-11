import { Injectable } from '@angular/core';
import {NotificationsService} from 'angular2-notifications'

@Injectable()
export class ErrorHandlerService {
  constructor(private notificationService: NotificationsService) { }

  handleError(error: Error, message? :string) {
    //todo: log full error
    console.error(error)
    this.notificationService.error("Error", message || error.message)
  }

  handleWarning(warning: Error, message? :string) {
    console.log(warning)
    this.notificationService.warn("Warning", message || warning.message)
  }
}
