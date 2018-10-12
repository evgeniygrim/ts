import { Injectable } from '@angular/core';
import { SessionStorage } from 'ngx-webstorage';

@Injectable()
export class SessionService {

  @SessionStorage('sessionId')
  public sessionId: string;

  constructor() {
  }
}
