import { ErrorResponse } from './../../../../../core/models/response/error-response';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'auth-lib';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';

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
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toaster = inject(ToastrService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);
  err: WritableSignal<boolean> = signal(false);
  step: WritableSignal<number> = signal(1);
  emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  passwordsForm = this.fb.nonNullable.group(
    {
      token: [''],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/),
        ],
      ],
      confirmPassword: [''],
    },
    {
      validators: [this.passwordMatchValidator],
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
        this.isLoading.set(true);
        this.authService
          .forgetPassword(this.emailForm.getRawValue())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: { status: boolean; code: number; message: string }) => {
              this.err.set(false);
              this.isLoading.set(false);
              this.toaster.success(res.message, 'Success');
              this.step.set(this.step() + 1);
            },
            error: (err: ErrorResponse) => {
              this.err.set(true);
              this.isLoading.set(false);
            },
          });
      } else {
        this.emailForm.markAllAsTouched();
      }
    } else if (this.step() === 3) {
      // call resetPassword Endpoint
      if (this.passwordsForm.valid) {
        this.isLoading.set(true);
        this.authService
          .resetPassword(this.passwordsForm.getRawValue())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: { status: boolean; code: number; message: string }) => {
              this.err.set(false);
              this.isLoading.set(false);
              this.toaster.success(res.message, 'Success');
              this.router.navigate(['/auth/signin']);
            },
            error: (err: ErrorResponse) => {
              this.err.set(true);
              this.isLoading.set(false);
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

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
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
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
