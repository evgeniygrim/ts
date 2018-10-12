import { Routes } from '@angular/router';
import { LayoutMainComponent } from '@app/layouts/layout-main/layout-main.component';
import { NotFoundComponent } from '@app/layouts/not-found/not-found.component';

export const MAIN_ROUTES: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '',
    component: LayoutMainComponent,
  },
  { path: '**', component: NotFoundComponent },
];
