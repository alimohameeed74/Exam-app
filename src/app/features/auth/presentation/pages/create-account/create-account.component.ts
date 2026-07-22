import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from 'auth-lib';
import { Subject } from 'rxjs';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  imports: [ReactiveFormsModule, SharedInputComponent, ErrorMessComponent, RouterLink],
})
export class CreateAccountComponent implements OnInit {
  private authService = inject(AuthService);
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

      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],

      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],

      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );
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
  register() {}

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  increaseStep() {
    this.step.update((v) => v++);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
