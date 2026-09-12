import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from 'auth-lib';
import { UserDataService } from '../../../application/services/user-data.service.js';
import { ToastrService } from 'ngx-toastr';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authService: {
    login: ReturnType<typeof vi.fn>;
  };

  let userDataService: {
    setUserData: ReturnType<typeof vi.fn>;
  };

  let toaster: {
    success: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockLoginResponse = {
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
      login: vi.fn().mockReturnValue(of(mockLoginResponse)),
    };

    userDataService = {
      setUserData: vi.fn(),
    };

    toaster = {
      success: vi.fn(),
    };

    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
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
          useValue: toaster,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should mark form as touched when form is invalid', () => {
    const markAllAsTouchedSpy = vi.spyOn(component.loginForm, 'markAllAsTouched');

    component.login();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should login successfully', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'TestPassword123!',
    });

    component.login();

    expect(authService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'TestPassword123!',
    });
  });

  it('should store user data after successful login', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'TestPassword123!',
    });

    component.login();

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

  it('should show success toast after successful login', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'TestPassword123!',
    });

    component.login();

    expect(toaster.success).toHaveBeenCalledWith('Signedin successfully', 'Success');
  });

  it('should navigate to main after successful login', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'TestPassword123!',
    });

    component.login();

    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should set error signal when login fails', () => {
    authService.login.mockReturnValue(
      throwError(() => ({
        status: 401,
        message: 'Invalid credentials',
      })),
    );

    component.loginForm.setValue({
      username: 'testuser',
      password: 'TestPassword123!',
    });

    component.login();

    expect(component.err()).toBe(true);
  });

  it('should reset error signal after successful login', () => {
    component.err.set(true);

    component.loginForm.setValue({
      username: 'testuser',
      password: 'TestPassword123!',
    });

    component.login();

    expect(component.err()).toBe(false);
  });

  it('should return username controller', () => {
    expect(component.userNameController).toBe(component.loginForm.controls.username);
  });

  it('should return password controller', () => {
    expect(component.passwordController).toBe(component.loginForm.controls.password);
  });
});
