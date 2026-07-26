import { AuthService } from 'auth-lib';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../../domain/models/response/login.js';
import { ErrorResponse } from '../../../../../core/models/response/error-response.js';
import { UserDataService } from '../../../application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { REGEX_PATTERNS } from '../../../../../core/consts/regex.js';

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
  private userDataService = inject(UserDataService);
  private toaster = inject(ToastrService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  err: WritableSignal<boolean> = signal(false);
  private fb = inject(FormBuilder);
  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.USERNAME_PATTERN)]],
    password: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.PASSWORD_PATTERN)]],
  });
  constructor() {}

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: Login) => {
            this.err.set(false);
            this.userDataService.setUserData({
              token: res.token,
              user: { email: res.user.email, username: res.user.username, role: res.user.role },
            });
            this.toaster.success('Signedin successfully', 'Success');
            this.router.navigate(['/main']);
          },
          error: (err: ErrorResponse) => {
            this.err.set(true);
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
