import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateAccountComponent } from './create-account.component';
import { AuthService } from 'auth-lib';
import { UserDataService } from '../../../application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  let authService: {
    register: ReturnType<typeof vi.fn>;
    sendEmailVerification: ReturnType<typeof vi.fn>;
    confirmEmail: ReturnType<typeof vi.fn>;
  };

  let userDataService: {
    setUserData: ReturnType<typeof vi.fn>;
  };

  let toasterService: {
    success: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockRegisterResponse = {
    token: 'test-token',
    user: {
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER' as const,
      firstName: 'Ali',
      lastName: 'Mohamed',
    },
  };

  beforeEach(async () => {
    authService = {
      register: vi.fn().mockReturnValue(of(mockRegisterResponse)),
      sendEmailVerification: vi.fn().mockReturnValue(
        of({
          message: 'Verification email sent',
          code: '200',
        }),
      ),
      confirmEmail: vi.fn().mockReturnValue(
        of({
          message: 'Email verified successfully',
        }),
      ),
    };

    userDataService = {
      setUserData: vi.fn(),
    };

    toasterService = {
      success: vi.fn(),
    };

    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateAccountComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: UserDataService,
          useValue: userDataService,
        },
        {
          provide: ToastrService,
          useValue: toasterService,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with step 1', () => {
    expect(component.step()).toBe(1);
  });

  it('should not register when form is invalid', () => {
    const passwordTouchedSpy = vi.spyOn(component.passwordController, 'markAsTouched');

    const confirmPasswordTouchedSpy = vi.spyOn(
      component.confirmPasswordController,
      'markAsTouched',
    );

    component.register();

    expect(authService.register).not.toHaveBeenCalled();
    expect(passwordTouchedSpy).toHaveBeenCalled();
    expect(confirmPasswordTouchedSpy).toHaveBeenCalled();
  });

  it('should register successfully', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Ali',
      lastName: 'Mohamed',
      phone: '01012345678',
    });

    component.register();

    expect(authService.register).toHaveBeenCalledWith(component.registerForm.getRawValue());
  });

  it('should store user data after successful registration', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Ali',
      lastName: 'Mohamed',
      phone: '01012345678',
    });

    component.register();

    expect(userDataService.setUserData).toHaveBeenCalledWith({
      token: 'test-token',
      user: {
        email: 'test@example.com',
        username: 'testuser',
        role: 'USER',
        fName: 'Ali',
        lName: 'Mohamed',
      },
    });
  });

  it('should show success toast after successful registration', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Ali',
      lastName: 'Mohamed',
      phone: '01012345678',
    });

    component.register();

    expect(toasterService.success).toHaveBeenCalledWith('Signedup Successfully', 'Success');
  });

  it('should navigate to main after successful registration', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Ali',
      lastName: 'Mohamed',
      phone: '01012345678',
    });

    component.register();

    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should set error when registration fails', () => {
    authService.register.mockReturnValue(
      throwError(() => ({
        status: 400,
        message: 'Registration failed',
      })),
    );

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Ali',
      lastName: 'Mohamed',
      phone: '01012345678',
    });

    component.register();

    expect(component.err()).toBe(true);
  });

  it('should mark email as touched when email is invalid in step 1', () => {
    const markAsTouchedSpy = vi.spyOn(component.emailController, 'markAsTouched');

    component.increaseStep();

    expect(markAsTouchedSpy).toHaveBeenCalled();
    expect(authService.sendEmailVerification).not.toHaveBeenCalled();
  });

  it('should send verification email when email is valid', () => {
    component.emailController.setValue('test@example.com');

    component.increaseStep();

    expect(authService.sendEmailVerification).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });

  it('should move to step 2 after sending verification email', () => {
    component.emailController.setValue('test@example.com');

    component.increaseStep();

    expect(component.step()).toBe(2);
  });

  it('should show success toast after sending verification email', () => {
    component.emailController.setValue('test@example.com');

    component.increaseStep();

    expect(toasterService.success).toHaveBeenCalledWith('Verification email sent', 'Success');
  });

  it('should set error when sending verification email fails', () => {
    authService.sendEmailVerification.mockReturnValue(
      throwError(() => ({
        status: 400,
        message: 'Failed to send email',
      })),
    );

    component.emailController.setValue('test@example.com');

    component.increaseStep();

    expect(component.err()).toBe(true);
    expect(component.step()).toBe(1);
  });

  it('should mark OTP form as touched when OTP is invalid', () => {
    component.step.set(2);

    const markAllAsTouchedSpy = vi.spyOn(component.otpForm, 'markAllAsTouched');

    component.increaseStep();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(authService.confirmEmail).not.toHaveBeenCalled();
  });

  it('should confirm email with OTP when OTP is valid', () => {
    component.step.set(2);

    component.emailController.setValue('test@example.com');

    component.otpForm.setValue({
      digit1: '1',
      digit2: '2',
      digit3: '3',
      digit4: '4',
      digit5: '5',
      digit6: '6',
    });

    component.increaseStep();

    expect(authService.confirmEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      code: '123456',
    });
  });

  it('should move to step 3 after confirming email', () => {
    component.step.set(2);

    component.emailController.setValue('test@example.com');

    component.otpForm.setValue({
      digit1: '1',
      digit2: '2',
      digit3: '3',
      digit4: '4',
      digit5: '5',
      digit6: '6',
    });

    component.increaseStep();

    expect(component.step()).toBe(3);
  });

  it('should show success toast after confirming email', () => {
    component.step.set(2);

    component.emailController.setValue('test@example.com');

    component.otpForm.setValue({
      digit1: '1',
      digit2: '2',
      digit3: '3',
      digit4: '4',
      digit5: '5',
      digit6: '6',
    });

    component.increaseStep();

    expect(toasterService.success).toHaveBeenCalledWith('Email verified successfully', 'Success');
  });

  it('should set error when confirming email fails', () => {
    authService.confirmEmail.mockReturnValue(
      throwError(() => ({
        status: 400,
        message: 'Invalid OTP',
      })),
    );

    component.step.set(2);

    component.emailController.setValue('test@example.com');

    component.otpForm.setValue({
      digit1: '1',
      digit2: '2',
      digit3: '3',
      digit4: '4',
      digit5: '5',
      digit6: '6',
    });

    component.increaseStep();

    expect(component.err()).toBe(true);
    expect(component.step()).toBe(2);
  });

  it('should mark profile fields as touched when invalid in step 3', () => {
    component.step.set(3);

    const firstNameSpy = vi.spyOn(component.firstNameController, 'markAsTouched');
    const lastNameSpy = vi.spyOn(component.lastNameController, 'markAsTouched');
    const phoneSpy = vi.spyOn(component.phoneController, 'markAsTouched');
    const usernameSpy = vi.spyOn(component.userNameController, 'markAsTouched');

    component.increaseStep();

    expect(firstNameSpy).toHaveBeenCalled();
    expect(lastNameSpy).toHaveBeenCalled();
    expect(phoneSpy).toHaveBeenCalled();
    expect(usernameSpy).toHaveBeenCalled();
  });

  it('should move to step 4 when profile fields are valid in step 3', () => {
    component.step.set(3);

    component.firstNameController.setValue('Ali');
    component.lastNameController.setValue('Mohamed');
    component.userNameController.setValue('testuser');
    component.phoneController.setValue('01012345678');

    component.increaseStep();

    expect(component.step()).toBe(4);
  });

  it('should decrease step', () => {
    component.step.set(3);

    component.decreaseStep();

    expect(component.step()).toBe(2);
  });

  it('should return username controller', () => {
    expect(component.userNameController).toBe(component.registerForm.controls.username);
  });

  it('should return email controller', () => {
    expect(component.emailController).toBe(component.registerForm.controls.email);
  });

  it('should return password controller', () => {
    expect(component.passwordController).toBe(component.registerForm.controls.password);
  });

  it('should return confirm password controller', () => {
    expect(component.confirmPasswordController).toBe(
      component.registerForm.controls.confirmPassword,
    );
  });

  it('should return first name controller', () => {
    expect(component.firstNameController).toBe(component.registerForm.controls.firstName);
  });

  it('should return last name controller', () => {
    expect(component.lastNameController).toBe(component.registerForm.controls.lastName);
  });

  it('should return phone controller', () => {
    expect(component.phoneController).toBe(component.registerForm.controls.phone);
  });
});
