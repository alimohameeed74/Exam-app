import { Component, inject, OnInit } from '@angular/core';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [SharedInputComponent],
})
export class ProfileComponent implements OnInit {
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
