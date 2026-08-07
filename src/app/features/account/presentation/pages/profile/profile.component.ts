import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../application/services/account.service.js';
import { LoggedUser } from '../../../../auth/domain/models/response/logged-user.js';
import { REGEX_PATTERNS } from '../../../../../core/consts/regex.js';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { ToastrService } from 'ngx-toastr';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserDataService } from '../../../../auth/application/services/user-data.service.js';
import { Router } from '@angular/router';

export interface UserData {
  token: string;
  user: {
    email: string;
    username: string;
    role: 'ADMIN' | 'USER';
    fName: string;
    lName: string;
  };
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [SharedInputComponent, ErrorMessComponent, ReactiveFormsModule, AlertComponent],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountServcie = inject(AccountService);
  private toasterService = inject(ToastrService);
  private destroyRef = inject(DestroyRef);
  private userDataService = inject(UserDataService);
  private router = inject(Router);

  openEmailDialog: WritableSignal<boolean> = signal(false);
  showConfirmDialog: WritableSignal<boolean> = signal(false);
  err: WritableSignal<boolean> = signal(false);
  step: WritableSignal<number> = signal(1);
  accountForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.USERNAME_PATTERN)]],

    email: ['', [Validators.required, Validators.email]],

    firstName: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.NAME_PATTERN)]],

    lastName: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.NAME_PATTERN)]],

    phone: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.PHONE_PATTERN)]],
  });
  newEmailForm = this.fb.nonNullable.group({
    newEmail: ['', [Validators.email, Validators.required]],
  });
  otpForm = this.fb.nonNullable.group({
    digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit5: ['', [Validators.required, Validators.pattern('[0-9]')]],
    digit6: ['', [Validators.required, Validators.pattern('[0-9]')]],
  });
  constructor() {}

  ngOnInit() {
    this.getAccountProfile();
  }
  get userNameController() {
    return this.accountForm.controls.username;
  }

  get emailController() {
    return this.accountForm.controls.email;
  }

  get firstNameController() {
    return this.accountForm.controls.firstName;
  }

  get lastNameController() {
    return this.accountForm.controls.lastName;
  }

  get phoneController() {
    return this.accountForm.controls.phone;
  }

  get newEmailController() {
    return this.newEmailForm.controls.newEmail;
  }

  getAccountProfile() {
    this.accountServcie
      .getUserProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: LoggedUser) => {
          this.fillForm(res);
        },
      });
  }

  fillForm(data: LoggedUser) {
    this.userNameController.disable();
    this.accountForm.setValue({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      username: data.username,
    });
    const userData: UserData | null = JSON.parse(localStorage.getItem('userData') as string);
    if (userData) {
      this.userDataService.setUserData({
        token: userData.token,
        user: {
          email: data.email,
          username: data.username,
          fName: data.firstName,
          lName: data.lastName,
          role: data.role,
        },
      });
    }
  }

  submit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.updateMyProfile();
  }
  updateMyProfile() {
    const updatedForm = {
      firstName: this.firstNameController.value,
      lastName: this.lastNameController.value,
      profilePhoto: '',
      phone: this.phoneController.value,
    };
    this.accountServcie
      .updateUserProfile(updatedForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.toasterService.success('Profile updated successfully.', 'Success');
          this.fillForm(res);
        },
      });
  }

  openDialog() {
    this.openEmailDialog.set(true);
  }
  closeDialog() {
    this.step.set(1);
    this.newEmailForm.reset();
    this.otpForm.reset();
    this.openEmailDialog.set(false);
  }

  submit_() {
    if (this.step() === 1) {
      if (this.newEmailForm.invalid) {
        this.newEmailForm.markAllAsTouched();
        return;
      }
      this.accountServcie
        .requestEmailChange(this.newEmailForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: { status: boolean; message: string; code: string }) => {
            this.err.set(false);
            this.toasterService.success(res.message, 'Success');
            this.step.set(this.step() + 1);
          },
          error: (err) => this.err.set(true),
        });
    } else if (this.step() === 2) {
      if (this.otpForm.invalid) {
        this.otpForm.markAllAsTouched();
        return;
      }
      const value = Object.values(this.otpForm.getRawValue()).join('');
      this.accountServcie
        .confirmEmailChange({ code: value })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: LoggedUser) => {
            this.err.set(false);
            console.log(res);
            this.toasterService.success('Email updated successfully.', 'Success');
            this.fillForm(res);
            this.closeDialog();
          },
          error: (err) => this.err.set(true),
        });
    }
  }
  openConfirmDialog() {
    this.showConfirmDialog.set(true);
  }
  closeConfirmDialog() {
    this.showConfirmDialog.set(false);
  }

  deleteAccount() {
    this.accountServcie
      .deleteAccount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: { status: boolean; message: string; code: string }) => {
          this.toasterService.success(res.message, 'Success');
          console.log(res);
          this.userDataService.logout();
          this.router.navigate(['/auth']);
        },
      });
  }
}
