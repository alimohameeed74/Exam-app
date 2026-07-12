import { Component, input, InputSignal, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  mess: InputSignal<string> = input.required();
  constructor() {}

  ngOnInit() {}
}
