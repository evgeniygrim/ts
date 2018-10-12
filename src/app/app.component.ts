import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  protected ready: string;

  constructor() {}

  ngOnInit(): void {
    this.ready = 'AppComponent Ready';
  }
}
