import { Component, input, InputSignal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-input',
  templateUrl: './shared-input.component.html',
  styleUrls: ['./shared-input.component.css'],
  imports: [ReactiveFormsModule],
})
export class SharedInputComponent implements OnInit {
  obj: InputSignal<{ id: string; label: string; placeHolder: string; type: string }> =
    input.required();

  control: InputSignal<FormControl> = input.required();
  constructor() {}

  ngOnInit() {}
}
