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
import { Login } from '../../../domain/models/response/login.js';
import { UserDataService } from '../../../application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';

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
  private destroy$ = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);
  err: WritableSignal<boolean> = signal(false);
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
      this.isLoading.set(true);
      this.authService
        .register(this.registerForm.getRawValue())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: Login) => {
            this.err.set(false);
            this.isLoading.set(false);
            console.log(res);
            this.userDataService.setUserData({
              token: res.token,
              user: { email: res.user.email, username: res.user.username, role: res.user.role },
            });
            this.toasterService.success('Signedup Successfully', 'Success');
            this.router.navigate(['/main']);
          },
          error: (err: ErrorResponse) => {
            this.err.set(true);
            this.isLoading.set(false);
          },
        });
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
        this.authService
          .sendEmailVerification({ email: this.emailController.value })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: { message: string; code: string }) => {
              console.log(res);
              this.toasterService.success(res.message, 'Success');
              this.err.set(false);
              this.step.set(this.step() + 1);
            },
            error: (err: ErrorResponse) => {
              this.err.set(true);
              console.log(err);
            },
          });
      }
    } else if (this.step() === 2) {
      if (this.otpForm.valid) {
        const value = Object.values(this.otpForm.value).join('');
        this.authService
          .confirmEmail({ email: this.emailController.value, code: value })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: { message: string }) => {
              console.log(res);
              this.err.set(false);
              this.toasterService.success(res.message, 'Success');
              this.step.set(this.step() + 1);
            },
            error: (err: any) => {
              console.log(err);
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
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
