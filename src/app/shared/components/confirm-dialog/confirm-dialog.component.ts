import { Component, InputSignal, OnInit, output, input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent implements OnInit {
  icon: InputSignal<string> = input.required();
  title: InputSignal<string> = input.required();
  message: InputSignal<string> = input.required();
  confirmButtonText: InputSignal<string> = input.required();
  cancelButtonText: InputSignal<string> = input.required();
  type: InputSignal<'danger' | 'warning' | 'info'> = input.required();
  onCancel = output<void>();
  onSubmit = output<void>();
  constructor() {}

  ngOnInit() {}
  submit() {
    this.onSubmit.emit();
  }
  cancel() {
    this.onCancel.emit();
  }
}
