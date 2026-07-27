import { Component, input, InputSignal, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-mess',
  templateUrl: './error-mess.component.html',
  styleUrls: ['./error-mess.component.css'],
})
export class ErrorMessComponent implements OnInit {
  mess: InputSignal<string> = input.required();
  constructor() {}

  ngOnInit() {}
}
