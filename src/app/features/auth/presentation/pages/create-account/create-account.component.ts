import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from 'auth-lib';
import { Subject, takeUntil } from 'rxjs';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { Router, RouterLink } from '@angular/router';
import { SharedBtnComponent } from '../../../../../shared/components/shared-btn/shared-btn.component';
import { ErrorResponse } from '../../../../../core/models/response/error-response.js';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  imports: [
    ReactiveFormsModule,
    SharedInputComponent,
    ErrorMessComponent,
    RouterLink,
    SharedBtnComponent,
    AlertComponent,
  ],
})
export class CreateAccountComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);
  err: WritableSignal<boolean> = signal(false);
  step3Submitted: WritableSignal<boolean> = signal(false);
  step: WritableSignal<number> = signal(1);
  private fb = inject(FormBuilder);
  registerForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]{3,}$/)]],

      email: ['', [Validators.required, Validators.email]],

      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/),
        ],
      ],

      confirmPassword: ['', [Validators.required]],

      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z]+$/)]],

      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z]+$/)]],

      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );
  otpForm = this.fb.group({
    digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit5: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit6: ['', [Validators.required, Validators.pattern('[0-9]')]],
  });
  constructor() {}

  ngOnInit() {}

  get userNameController() {
    return this.registerForm.controls.username;
  }

  get emailController() {
    return this.registerForm.controls.email;
  }

  get passwordController() {
    return this.registerForm.controls.password;
  }

  get confirmPasswordController() {
    return this.registerForm.controls.confirmPassword;
  }

  get firstNameController() {
    return this.registerForm.controls.firstName;
  }

  get lastNameController() {
    return this.registerForm.controls.lastName;
  }

  get phoneController() {
    return this.registerForm.controls.phone;
  }
  register() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);

      // call register endPoint
    } else {
      this.passwordController.markAsTouched();
      this.confirmPasswordController.markAsTouched();
    }
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  increaseStep() {
    console.log(this.step());
    if (this.step() === 1) {
      if (this.emailController.invalid) {
        this.emailController.markAsTouched();
      } else {
        // call send email end point
        this.isLoading.set(true);
        console.log(this.emailController.value);
        this.authService
          .sendEmailVerification(this.emailController.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: { message: string; code: string }) => {
              this.err.set(false);
              this.step.set(this.step() + 1);
            },
            error: (err: ErrorResponse) => {
              this.err.set(true);
            },
          });
      }
    } else if (this.step() === 2) {
      if (this.otpForm.valid) {
        // call confirm email
        this.step.set(this.step() + 1);
      } else {
        this.otpForm.markAllAsTouched();
      }
    } else if (this.step() === 3) {
      if (
        this.firstNameController.invalid ||
        this.lastNameController.invalid ||
        this.userNameController.invalid ||
        this.phoneController.invalid
      ) {
        this.firstNameController.markAsTouched();
        this.lastNameController.markAsTouched();
        this.phoneController.markAsTouched();
        this.userNameController.markAsTouched();
      } else {
        // call confirm email
        this.step.set(this.step() + 1);
      }
    }
  }
  decreaseStep() {
    this.step.set(this.step() - 1);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
