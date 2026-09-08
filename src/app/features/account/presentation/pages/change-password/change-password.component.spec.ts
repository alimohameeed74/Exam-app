import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ChangePasswordComponent } from './change-password.component';
import { AccountService } from '../../../application/services/account.service.js';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  let accountService: {
    changePassword: ReturnType<typeof vi.fn>;
  };

  let toastrService: {
    success: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    accountService = {
      changePassword: vi.fn(),
    };

    toastrService = {
      success: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers: [
        {
          provide: AccountService,
          useValue: accountService,
        },
        {
          provide: ToastrService,
          useValue: toastrService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
  });

  // ---------------------------
  // Component
  // ---------------------------

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------
  // updatePassword - Invalid Form
  // ---------------------------

  it('should not change password when form is invalid', () => {
    component.updatePassword();

    expect(accountService.changePassword).not.toHaveBeenCalled();
  });

  // ---------------------------
  // updatePassword - Success
  // ---------------------------

  it('should change password successfully', () => {
    const response = {
      status: true,
      message: 'Password changed successfully',
      code: '200',
    };

    accountService.changePassword.mockReturnValue(of(response));

    component.passwordForm.setValue({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    component.updatePassword();

    expect(accountService.changePassword).toHaveBeenCalledWith({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    expect(component.err()).toBe(false);

    expect(toastrService.success).toHaveBeenCalledWith('Password changed successfully', 'Success');

    expect(component.passwordForm.getRawValue()).toEqual({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  });

  // ---------------------------
  // updatePassword - Error
  // ---------------------------

  it('should set error signal when change password fails', () => {
    accountService.changePassword.mockReturnValue(
      throwError(() => new Error('Something went wrong')),
    );

    component.passwordForm.setValue({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    component.updatePassword();

    expect(component.err()).toBe(true);

    expect(toastrService.success).not.toHaveBeenCalled();
  });
});
