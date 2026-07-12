import { Component, input, InputSignal, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-input',
  templateUrl: './shared-input.component.html',
  styleUrls: ['./shared-input.component.css'],
})
export class SharedInputComponent implements OnInit {
  obj: InputSignal<{ id: string; label: string; placeHolder: string; type: string }> =
    input.required();
  constructor() {}

  ngOnInit() {}
}
