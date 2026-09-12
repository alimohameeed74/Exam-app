import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ForgetPasswordComponent } from './forget-password.component';
import { AuthService } from 'auth-lib';
import { ToastrService } from 'ngx-toastr';

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;

  let authService: {
    forgetPassword: ReturnType<typeof vi.fn>;
    resetPassword: ReturnType<typeof vi.fn>;
  };

  let toaster: {
    success: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      forgetPassword: vi.fn().mockReturnValue(
        of({
          status: true,
          code: 200,
          message: 'Reset link sent successfully',
        }),
      ),
      resetPassword: vi.fn().mockReturnValue(
        of({
          status: true,
          code: 200,
          message: 'Password reset successfully',
        }),
      ),
    };

    toaster = {
      success: vi.fn(),
    };

    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ForgetPasswordComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: ToastrService,
          useValue: toaster,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: () => null,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with step 1', () => {
    expect(component.step()).toBe(1);
  });

  it('should mark email form as touched when email form is invalid', () => {
    const markAllAsTouchedSpy = vi.spyOn(component.emailForm, 'markAllAsTouched');

    component.increaseStep();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(authService.forgetPassword).not.toHaveBeenCalled();
  });

  it('should call forget password when email form is valid', () => {
    component.emailForm.setValue({
      email: 'test@example.com',
    });

    component.increaseStep();

    expect(authService.forgetPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });

  it('should move to step 2 after forget password succeeds', () => {
    component.emailForm.setValue({
      email: 'test@example.com',
    });

    component.increaseStep();

    expect(component.step()).toBe(2);
  });

  it('should show success toast after forget password succeeds', () => {
    component.emailForm.setValue({
      email: 'test@example.com',
    });

    component.increaseStep();

    expect(toaster.success).toHaveBeenCalledWith('Reset link sent successfully', 'Success');
  });

  it('should set error when forget password fails', () => {
    authService.forgetPassword.mockReturnValue(
      throwError(() => ({
        status: 400,
        message: 'Something went wrong',
      })),
    );

    component.emailForm.setValue({
      email: 'test@example.com',
    });

    component.increaseStep();

    expect(component.err()).toBe(true);
    expect(component.step()).toBe(1);
  });

  it('should move to step 3 when token exists in query params', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);

    component.ngOnInit();

    expect(component.step()).toBe(1);

    activatedRoute.queryParamMap.subscribe();
  });

  it('should mark password form as touched when password form is invalid', () => {
    component.step.set(3);

    const markAllAsTouchedSpy = vi.spyOn(component.passwordsForm, 'markAllAsTouched');

    component.increaseStep();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  it('should call reset password when password form is valid', () => {
    component.step.set(3);

    component.passwordsForm.setValue({
      token: 'reset-token',
      newPassword: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });

    component.increaseStep();

    expect(authService.resetPassword).toHaveBeenCalledWith({
      token: 'reset-token',
      newPassword: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });
  });

  it('should navigate to signin after reset password succeeds', () => {
    component.step.set(3);

    component.passwordsForm.setValue({
      token: 'reset-token',
      newPassword: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });

    component.increaseStep();

    expect(router.navigate).toHaveBeenCalledWith(['/auth/signin']);
  });

  it('should show success toast after reset password succeeds', () => {
    component.step.set(3);

    component.passwordsForm.setValue({
      token: 'reset-token',
      newPassword: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });

    component.increaseStep();

    expect(toaster.success).toHaveBeenCalledWith('Password reset successfully', 'Success');
  });

  it('should set error when reset password fails', () => {
    authService.resetPassword.mockReturnValue(
      throwError(() => ({
        status: 400,
        message: 'Invalid token',
      })),
    );

    component.step.set(3);

    component.passwordsForm.setValue({
      token: 'reset-token',
      newPassword: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });

    component.increaseStep();

    expect(component.err()).toBe(true);
  });

  it('should decrease step and reset forms', () => {
    component.step.set(2);

    component.emailForm.setValue({
      email: 'test@example.com',
    });

    component.passwordsForm.setValue({
      token: 'token',
      newPassword: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });

    component.decreaseStep();

    expect(component.step()).toBe(1);
    expect(component.emailForm.getRawValue()).toEqual({
      email: '',
    });

    expect(component.passwordsForm.getRawValue()).toEqual({
      token: '',
      newPassword: '',
      confirmPassword: '',
    });
  });

  it('should return email controller', () => {
    expect(component.emailController).toBe(component.emailForm.controls.email);
  });

  it('should return new password controller', () => {
    expect(component.newPasswordController).toBe(component.passwordsForm.controls.newPassword);
  });

  it('should return confirm password controller', () => {
    expect(component.confirmPasswordController).toBe(
      component.passwordsForm.controls.confirmPassword,
    );
  });
});
