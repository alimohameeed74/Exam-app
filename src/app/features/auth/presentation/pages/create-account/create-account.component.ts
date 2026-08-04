import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'auth-lib';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { Router, RouterLink } from '@angular/router';
import { SharedBtnComponent } from '../../../../../shared/components/shared-btn/shared-btn.component';
import { ErrorResponse } from '../../../../../core/models/response/error-response.js';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { Login } from '../../../domain/models/response/login.js';
import { UserDataService } from '../../../application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';
import { matchFieldsValidator } from '../../../../../shared/validators/match-fileds.validator.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { REGEX_PATTERNS } from '../../../../../core/consts/regex.js';

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
  private userDataService = inject(UserDataService);
  private router = inject(Router);
  private toasterService = inject(ToastrService);
  private destroyRef = inject(DestroyRef);
  err: WritableSignal<boolean> = signal(false);
  step: WritableSignal<number> = signal(1);
  private fb = inject(FormBuilder);
  registerForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.USERNAME_PATTERN)]],

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.PASSWORD_PATTERN)]],

      confirmPassword: [''],

      firstName: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.NAME_PATTERN)]],

      lastName: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.NAME_PATTERN)]],

      phone: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.PHONE_PATTERN)]],
    },
    {
      validators: matchFieldsValidator('password', 'confirmPassword'),
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
      this.authService
        .register(this.registerForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: Login) => {
            this.err.set(false);
            this.userDataService.setUserData({
              token: res.token,
              user: {
                email: res.user.email,
                username: res.user.username,
                role: res.user.role,
                fName: res.user.firstName,
                lName: res.user.lastName,
              },
            });
            this.toasterService.success('Signedup Successfully', 'Success');
            this.router.navigate(['/main']);
          },
          error: (err: ErrorResponse) => {
            this.err.set(true);
          },
        });
    } else {
      this.passwordController.markAsTouched();
      this.confirmPasswordController.markAsTouched();
    }
  }

  increaseStep() {
    if (this.step() === 1) {
      if (this.emailController.invalid) {
        this.emailController.markAsTouched();
      } else {
        // call send email end point
        this.authService
          .sendEmailVerification({ email: this.emailController.value })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res: { message: string; code: string }) => {
              this.toasterService.success(res.message, 'Success');
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
        const value = Object.values(this.otpForm.value).join('');
        // call confirm email end point
        this.authService
          .confirmEmail({ email: this.emailController.value, code: value })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res: { message: string }) => {
              this.err.set(false);
              this.toasterService.success(res.message, 'Success');
              this.step.set(this.step() + 1);
            },
            error: (err: any) => {
              this.err.set(true);
            },
          });
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
        this.step.set(this.step() + 1);
      }
    }
  }
  decreaseStep() {
    this.step.set(this.step() - 1);
  }
}
