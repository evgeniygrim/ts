import { NgModuleRef } from '@angular/core';

export interface IEnvironment {
  production: boolean;
  restPath: string;

  ENV_PROVIDERS: any;
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
