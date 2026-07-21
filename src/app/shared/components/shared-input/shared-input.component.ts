import { Component, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
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
  hidePassword: WritableSignal<boolean> = signal(true);
  control: InputSignal<FormControl> = input.required();
  constructor() {}

  ngOnInit() {}
  togglePassword() {
    this.hidePassword.update((v) => !v);
  }
}
