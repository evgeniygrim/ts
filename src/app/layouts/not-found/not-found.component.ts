import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'not-found',
  templateUrl: 'not-found.component.html',
  styleUrls: ['not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  private message: string;

  constructor() { }
  ngOnInit() {
    this.message = 'Cтраницы не существует';
  }
}
