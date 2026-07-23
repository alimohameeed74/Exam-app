import { ErrorResponse } from './../../../../../core/models/response/error-response';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'auth-lib';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  imports: [RouterLink, SharedInputComponent, AlertComponent],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private toaster = inject(ToastrService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);
  err: WritableSignal<boolean> = signal(false);
  step: WritableSignal<number> = signal(1);
  emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  passwordsForm = this.fb.group(
    {
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [this.passwordMatchValidator],
    },
  );
  constructor() {}

  ngOnInit() {}

  increaseStep() {
    if (this.step() === 1) {
      // call forgetPasseod endPoint
      console.log(this.emailForm.value);
      this.isLoading.set(true);
      this.authService
        .forgetPassword(this.emailForm.getRawValue())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.err.set(false);
            this.isLoading.set(false);
            console.log(res);
          },
          error: (err: ErrorResponse) => {
            this.err.set(true);
            this.isLoading.set(false);
            console.log(err);
          },
        });
    } else if (this.step() === 2) {
      //
    } else if (this.step() === 3) {
      // call resetPassword Endpoint
    }
    this.step.set(this.step() + 1);
  }

  get emailController() {
    return this.emailForm.controls.email;
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}

//        @if (
//           (confirmPasswordController.touched && confirmPasswordController.errors) ||
//           registerForm.errors
//         ) {
//           @if (confirmPasswordController.hasError('required')) {
//             <app-error-mess mess="Confirm Password is required"></app-error-mess>
//           } @else if (registerForm.hasError('passwordMismatch')) {
//             <app-error-mess mess="Passwords don't match"></app-error-mess>
//           }
//         }
