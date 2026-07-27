import { ErrorResponse } from './../../../../../core/models/response/error-response';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'auth-lib';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { matchFieldsValidator } from '../../../../../shared/validators/match-fileds.validator.js';
import { REGEX_PATTERNS } from '../../../../../core/consts/regex.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  imports: [
    RouterLink,
    SharedInputComponent,
    AlertComponent,
    ReactiveFormsModule,
    ErrorMessComponent,
  ],
})
export class ForgetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toaster = inject(ToastrService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  err: WritableSignal<boolean> = signal(false);
  step: WritableSignal<number> = signal(1);
  emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  passwordsForm = this.fb.nonNullable.group(
    {
      token: [''],
      newPassword: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.PASSWORD_PATTERN)]],
      confirmPassword: [''],
    },
    {
      validators: matchFieldsValidator('newPassword', 'confirmPassword'),
    },
  );
  constructor() {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      const token = param.get('token');
      if (token) {
        if (this.step() === 2 || this.step() === 1) {
          this.step.set(3);
          this.passwordsForm.patchValue({
            token: token,
          });
        }
      }
    });
  }

  increaseStep() {
    if (this.step() === 1) {
      // call forgetPassword endPoint
      if (this.emailForm.valid) {
        this.authService
          .forgetPassword(this.emailForm.getRawValue())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res: { status: boolean; code: number; message: string }) => {
              this.err.set(false);
              this.toaster.success(res.message, 'Success');
              this.step.set(this.step() + 1);
            },
            error: (err: ErrorResponse) => {
              this.err.set(true);
            },
          });
      } else {
        this.emailForm.markAllAsTouched();
      }
    } else if (this.step() === 3) {
      // call resetPassword Endpoint
      if (this.passwordsForm.valid) {
        this.authService
          .resetPassword(this.passwordsForm.getRawValue())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res: { status: boolean; code: number; message: string }) => {
              this.err.set(false);
              this.toaster.success(res.message, 'Success');
              this.router.navigate(['/auth/signin']);
            },
            error: (err: ErrorResponse) => {
              this.err.set(true);
            },
          });
      } else {
        this.passwordsForm.markAllAsTouched();
      }
    }
  }

  get emailController() {
    return this.emailForm.controls.email;
  }
  get newPasswordController() {
    return this.passwordsForm.controls.newPassword;
  }
  get confirmPasswordController() {
    return this.passwordsForm.controls.confirmPassword;
  }

  decreaseStep() {
    this.emailForm.reset({
      email: '',
    });
    this.passwordsForm.reset({
      token: '',
      newPassword: '',
      confirmPassword: '',
    });
    this.step.set(this.step() - 1);
  }
}
