import { ApplicationRef, NgModuleRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { IEnvironment } from './model';

Error.stackTraceLimit = Infinity;
require('zone.js/dist/long-stack-trace-zone');

export const environment: IEnvironment = {
  production: false,
  restPath: '/mocks/',

  /** Angular debug tools in the dev console
   * @param modRef
   * @return {any}
   */
  decorateModuleRef: (modRef: NgModuleRef<any>) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    const _ng = (window as any).ng;
    enableDebugTools(cmpRef);
    (window as any).ng.probe = _ng.probe;
    (window as any).ng.coreTokens = _ng.coreTokens;
    return modRef;
  },
  ENV_PROVIDERS: [

  ]
};
