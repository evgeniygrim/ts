import { Injectable } from '@angular/core';
import { isEmpty, extend } from 'lodash/fp';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Mappable } from '@core/shared/classes/mappable.class';
import { CallParams } from '@core/shared/classes/call-params.class';
import { SessionService } from '@core/services/session.service';
import { environment } from 'environments/environment';

@Injectable()
export class RestService {
  // заголовки для запросов
  private encodedHeaders: HttpHeaders;
  private jsonHeaders: HttpHeaders;

  constructor(
    private httpClient: HttpClient,
    private sessionService: SessionService,
  ) {
    this.jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' });
  }
  call(url, body, params) {

  }

  doCall(methodName: string, body: Mappable, callParams: CallParams) {
    const query = this.normalizePath(environment.restPath);
    const methods = this.normalizePath(methodName);
    const url = `/${[...query, ...methods].join('/')}`;

    return this.call(
      url,
      body.toJson(),
      callParams
    );
  }

  prepareToCallMap(params: CallParams) {
    const session = {session: this.sessionService.sessionId};

    return isEmpty(params) ? session : extend(session, params);
  }

  normalizeResponse(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  normalizePath(path: string) {
    return path.split('/').filter(Boolean);
  }
}
