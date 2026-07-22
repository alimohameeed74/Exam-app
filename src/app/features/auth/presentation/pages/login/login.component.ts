import { AuthService } from 'auth-lib';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Login } from '../../../domain/models/response/login.js';
import { ErrorResponse } from '../../../../../core/models/response/error-response.js';
import { UserDataService } from '../../../application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';

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
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private toaster = inject(ToastrService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
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
      this.authService
        .login(this.loginForm.getRawValue())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: Login) => {
            this.err.set(false);
            this.isLoading.set(false);
            this.userDataService.setUserData({
              token: res.token,
              user: { email: res.user.email, username: res.user.username, role: res.user.role },
            });
            this.toaster.success('Signedin successfuly', 'Success');
            this.router.navigate(['/main']);
          },
          error: (err: ErrorResponse) => {
            this.err.set(true);
            this.isLoading.set(false);
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
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
