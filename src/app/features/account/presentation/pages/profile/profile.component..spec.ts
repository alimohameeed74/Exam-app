import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ProfileComponent } from './profile.component';
import { AccountService } from '../../../application/services/account.service.js';
import { UserDataService } from '../../../../auth/application/services/user-data.service.js';
import { LoggedUser } from '../../../../auth/domain/models/response/logged-user.js';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  let accountService: {
    getUserProfile: ReturnType<typeof vi.fn>;
    updateUserProfile: ReturnType<typeof vi.fn>;
    requestEmailChange: ReturnType<typeof vi.fn>;
    confirmEmailChange: ReturnType<typeof vi.fn>;
    deleteAccount: ReturnType<typeof vi.fn>;
  };

  let userDataService: {
    setUserData: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  let toastrService: {
    success: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockUser: LoggedUser = {
    id: '1',
    username: 'john.doe',
    email: 'john@example.com',
    phone: '01012345678',
    firstName: 'John',
    lastName: 'Doe',
    profilePhoto: 'profile.jpg',
    emailVerified: true,
    phoneVerified: true,
    role: 'USER',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    accountService = {
      getUserProfile: vi.fn(),
      updateUserProfile: vi.fn(),
      requestEmailChange: vi.fn(),
      confirmEmailChange: vi.fn(),
      deleteAccount: vi.fn(),
    };

    userDataService = {
      setUserData: vi.fn(),
      logout: vi.fn(),
    };

    toastrService = {
      success: vi.fn(),
    };

    router = {
      navigate: vi.fn(),
    };

    accountService.getUserProfile.mockReturnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: AccountService,
          useValue: accountService,
        },
        {
          provide: UserDataService,
          useValue: userDataService,
        },
        {
          provide: ToastrService,
          useValue: toastrService,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ---------------------------
  // Component
  // ---------------------------

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------
  // ngOnInit
  // ---------------------------

  it('should get account profile on init', () => {
    const spy = vi.spyOn(component, 'getAccountProfile');

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  // ---------------------------
  // getAccountProfile
  // ---------------------------

  it('should get user profile and fill the form', () => {
    const fillFormSpy = vi.spyOn(component, 'fillForm');

    accountService.getUserProfile.mockReturnValue(of(mockUser));

    component.getAccountProfile();

    expect(accountService.getUserProfile).toHaveBeenCalled();

    expect(fillFormSpy).toHaveBeenCalledWith(mockUser);
  });

  // ---------------------------
  // fillForm
  // ---------------------------

  it('should fill account form and disable username', () => {
    component.fillForm(mockUser);

    expect(component.userNameController.disabled).toBe(true);

    expect(component.accountForm.getRawValue()).toEqual({
      username: mockUser.username,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      phone: mockUser.phone,
    });
  });

  it('should update user data when local user data exists', () => {
    localStorage.setItem(
      'userData',
      JSON.stringify({
        token: 'token123',
        user: {},
      }),
    );

    component.fillForm(mockUser);

    expect(userDataService.setUserData).toHaveBeenCalledWith({
      token: 'token123',
      user: {
        email: mockUser.email,
        username: mockUser.username,
        fName: mockUser.firstName,
        lName: mockUser.lastName,
        role: mockUser.role,
      },
    });
  });

  // ---------------------------
  // submit
  // ---------------------------

  it('should not update profile when account form is invalid', () => {
    const spy = vi.spyOn(component, 'updateMyProfile');

    component.submit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should update profile when account form is valid', () => {
    const updateSpy = vi.spyOn(component, 'updateMyProfile').mockImplementation(() => {});

    component.accountForm.controls.username.setValue('john123');
    component.accountForm.controls.email.setValue('john@example.com');
    component.accountForm.controls.firstName.setValue('John');
    component.accountForm.controls.lastName.setValue('Doe');
    component.accountForm.controls.phone.setValue('01012345678');

    component.accountForm.controls.username.enable();

    component.accountForm.updateValueAndValidity();

    console.log(component.accountForm.valid);
    console.log(component.accountForm.controls.username.errors);
    console.log(component.accountForm.controls.email.errors);
    console.log(component.accountForm.controls.firstName.errors);
    console.log(component.accountForm.controls.lastName.errors);
    console.log(component.accountForm.controls.phone.errors);

    component.submit();

    expect(updateSpy).toHaveBeenCalled();
  });

  // ---------------------------
  // updateMyProfile
  // ---------------------------

  it('should update user profile successfully', () => {
    const fillFormSpy = vi.spyOn(component, 'fillForm');

    accountService.updateUserProfile.mockReturnValue(of(mockUser));

    component.accountForm.patchValue({
      firstName: 'Ali',
      lastName: 'Mohamed',
      phone: '01012345678',
    });

    component.updateMyProfile();

    expect(accountService.updateUserProfile).toHaveBeenCalledWith({
      firstName: 'Ali',
      lastName: 'Mohamed',
      profilePhoto: '',
      phone: '01012345678',
    });

    expect(toastrService.success).toHaveBeenCalledWith('Profile updated successfully.', 'Success');

    expect(fillFormSpy).toHaveBeenCalledWith(mockUser);
  });

  // ---------------------------
  // Email Dialog
  // ---------------------------

  it('should open email dialog', () => {
    component.openDialog();

    expect(component.openEmailDialog()).toBe(true);
  });

  it('should close email dialog and reset its state', () => {
    component.step.set(2);
    component.openEmailDialog.set(true);

    component.newEmailForm.patchValue({
      newEmail: 'new@example.com',
    });

    component.otpForm.patchValue({
      digit1: '1',
      digit2: '2',
      digit3: '3',
      digit4: '4',
      digit5: '5',
      digit6: '6',
    });

    component.closeDialog();

    expect(component.step()).toBe(1);
    expect(component.openEmailDialog()).toBe(false);

    expect(component.newEmailForm.getRawValue()).toEqual({
      newEmail: '',
    });

    expect(component.otpForm.getRawValue()).toEqual({
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: '',
      digit5: '',
      digit6: '',
    });
  });

  // ---------------------------
  // submit_ - Step 1
  // ---------------------------

  it('should not request email change when new email form is invalid', () => {
    component.step.set(1);

    component.submit_();

    expect(accountService.requestEmailChange).not.toHaveBeenCalled();
  });

  it('should request email change successfully', () => {
    accountService.requestEmailChange.mockReturnValue(
      of({
        status: true,
        message: 'Verification code sent',
        code: '200',
      }),
    );

    component.step.set(1);

    component.newEmailForm.setValue({
      newEmail: 'new@example.com',
    });

    component.submit_();

    expect(accountService.requestEmailChange).toHaveBeenCalledWith({
      newEmail: 'new@example.com',
    });

    expect(component.err()).toBe(false);

    expect(component.step()).toBe(2);

    expect(toastrService.success).toHaveBeenCalledWith('Verification code sent', 'Success');
  });

  // ---------------------------
  // submit_ - Step 2
  // ---------------------------

  it('should not confirm email when OTP form is invalid', () => {
    component.step.set(2);

    component.submit_();

    expect(accountService.confirmEmailChange).not.toHaveBeenCalled();
  });

  it('should confirm email change successfully', () => {
    accountService.confirmEmailChange.mockReturnValue(of(mockUser));

    const fillFormSpy = vi.spyOn(component, 'fillForm');

    component.step.set(2);

    component.otpForm.setValue({
      digit1: '1',
      digit2: '2',
      digit3: '3',
      digit4: '4',
      digit5: '5',
      digit6: '6',
    });

    component.openEmailDialog();

    component.submit_();

    expect(accountService.confirmEmailChange).toHaveBeenCalledWith({
      code: '123456',
    });

    expect(component.err()).toBe(false);

    expect(toastrService.success).toHaveBeenCalledWith('Email updated successfully.', 'Success');

    expect(fillFormSpy).toHaveBeenCalledWith(mockUser);

    expect(component.openEmailDialog()).toBe(false);

    expect(component.step()).toBe(1);
  });

  // ---------------------------
  // Confirm Dialog
  // ---------------------------

  it('should open confirm dialog', () => {
    component.openConfirmDialog();

    expect(component.showConfirmDialog()).toBe(true);
  });

  it('should close confirm dialog', () => {
    component.showConfirmDialog.set(true);

    component.closeConfirmDialog();

    expect(component.showConfirmDialog()).toBe(false);
  });

  // ---------------------------
  // deleteAccount
  // ---------------------------

  it('should delete account and logout user', () => {
    accountService.deleteAccount.mockReturnValue(
      of({
        status: true,
        message: 'Account deleted successfully',
        code: '200',
      }),
    );

    component.deleteAccount();

    expect(accountService.deleteAccount).toHaveBeenCalled();

    expect(toastrService.success).toHaveBeenCalledWith('Account deleted successfully', 'Success');

    expect(userDataService.logout).toHaveBeenCalled();

    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
