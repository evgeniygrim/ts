/* tslint:disable */
import { enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { IEnvironment } from './model';

enableProdMode();

export const environment: IEnvironment = {
  production: false,
  restPath: '/mocks/',

  /** Angular debug tools in the dev console
   * @param modRef
   * @return {any}
   */
  decorateModuleRef(modRef: NgModuleRef<any>) {
    disableDebugTools();
    return modRef;
  },
  ENV_PROVIDERS: [

  ]
};
