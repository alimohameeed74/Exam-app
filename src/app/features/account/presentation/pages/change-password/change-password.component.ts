import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { REGEX_PATTERNS } from '../../../../../core/consts/regex.js';
import { matchFieldsValidator } from '../../../../../shared/validators/match-fileds.validator.js';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { AccountService } from '../../../application/services/account.service.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [SharedInputComponent, ErrorMessComponent, ReactiveFormsModule, AlertComponent],
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private destroyRef = inject(DestroyRef);
  private toasterService = inject(ToastrService);

  err: WritableSignal<boolean> = signal(false);
  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: [
        '',
        [Validators.required, Validators.pattern(REGEX_PATTERNS.PASSWORD_PATTERN)],
      ],
      newPassword: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.PASSWORD_PATTERN)]],
      confirmPassword: [''],
    },
    {
      validators: matchFieldsValidator('newPassword', 'confirmPassword'),
    },
  );
  constructor() {}

  ngOnInit() {}
  get currentPasswordController() {
    return this.passwordForm.controls.currentPassword;
  }
  get newPasswordController() {
    return this.passwordForm.controls.newPassword;
  }
  get confirmPasswordController() {
    return this.passwordForm.controls.confirmPassword;
  }
  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.accountService
      .changePassword(this.passwordForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: { status: boolean; message: string; code: string }) => {
          this.err.set(false);
          this.toasterService.success(res.message, 'Success');
          this.passwordForm.reset();
        },
        error: (err) => this.err.set(true),
      });
  }
}
