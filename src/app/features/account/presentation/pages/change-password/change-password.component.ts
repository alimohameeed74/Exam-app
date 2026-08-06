import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [SharedInputComponent],
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);

  accountForm = this.fb.nonNullable.group({
    password: [],
  });
  constructor() {}

  ngOnInit() {}
  get passwordController() {
    return this.accountForm.controls.password;
  }
}
