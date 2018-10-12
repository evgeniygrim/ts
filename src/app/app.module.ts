import { NgModule, isDevMode } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

// Cтили
import '../styles/styles.scss';

import { MAIN_ROUTES } from './app.routes';

// Языковая поддержка
import localeRu from '@angular/common/locales/ru';

// layouts
import { AppComponent } from './app.component';
import { LayoutMainComponent } from '@app/layouts/layout-main/layout-main.component';
import { NotFoundComponent } from '@app/layouts/not-found/not-found.component';

registerLocaleData(localeRu);

@NgModule({
  bootstrap: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(MAIN_ROUTES, {
      useHash: false,
      // будут медленные переходы между страницами - расскомментить!
      // TODO: добавить custom https://alligator.io/angular/preloading/ или показ загрузки
      // preloadingStrategy: PreloadAllModules
    })
  ],
  declarations: [
    AppComponent,
    LayoutMainComponent,
    NotFoundComponent,
  ],
  providers: [
  ]
})
export class AppModule {
}
