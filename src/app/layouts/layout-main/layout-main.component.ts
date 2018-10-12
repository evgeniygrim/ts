import { Component, OnInit, Injector } from '@angular/core';

import { DOCUMENT } from '@angular/common';

@Component({
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss'],

})
export class LayoutMainComponent implements OnInit {
  private welcome = null;

  constructor(
              protected injector: Injector
            ) {
  }

  ngOnInit() {
      this.welcome = 'LayoutMain Загружен';
  }
}
