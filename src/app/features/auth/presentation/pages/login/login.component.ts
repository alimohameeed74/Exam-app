import { AuthService } from '../../../../../../../dist/auth-lib/';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    SharedInputComponent,
    ErrorMessComponent,
    AlertComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  isLoading: WritableSignal<boolean> = signal(false);
  err: WritableSignal<boolean> = signal(false);
  private fb = inject(FormBuilder);
  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-z][a-zA-z0-9]{3,}$/)]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/),
      ],
    ],
  });
  constructor() {}

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: (res) => {
          this.err.set(false);
          this.isLoading.set(false);
          console.log(res);
        },
        error: (err) => {
          this.err.set(true);
          this.isLoading.set(false);
          console.log(err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get userNameController() {
    return this.loginForm.controls.username;
  }
  get passwordController() {
    return this.loginForm.controls.password;
  }
}
