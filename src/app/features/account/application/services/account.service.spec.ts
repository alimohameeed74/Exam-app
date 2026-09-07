import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service.js';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggedUser } from '../../../auth/domain/models/response/logged-user.js';
import { ApiResponse } from '../../../../core/models/response/api-response.js';
import { environment } from '../../../../../environments/environment.development.js';
import { UpdateProfileReq } from '../../domian/models/request/update-profile-req.js';
import { ChangePasswordRequest } from '../../domian/models/request/change-password-request.js';
import { GeneralResponse } from '../../domian/models/response/general-response.js';
import { NewEmailRequest } from '../../domian/models/request/new-email-request.js';
describe('accountService', () => {
  let service: AccountService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AccountService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getUserProfile()
  it('should get user profile', () => {
    // Arrange

    const mockUser: LoggedUser = {
      id: '1',
      username: 'john.doe',
      email: 'john@example.com',
      phone: '01012345678',
      firstName: 'John',
      lastName: 'Doe',
      profilePhoto: '',
      emailVerified: true,
      phoneVerified: true,
      role: 'USER',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const mockResponse: ApiResponse<{ user: LoggedUser }> = {
      code: 200,
      status: true,
      payload: {
        user: mockUser,
      },
    };

    // Act
    service.getUserProfile().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
    const req = httpTestingController.expectOne(`${environment.apiURL}/users/profile`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  // updateUserProfile()
  it('should update user profile', () => {
    // Arrange
    const data: UpdateProfileReq = {
      firstName: 'Ali',
      lastName: 'Mohamed',
      profilePhoto: '',
      phone: '01012345678',
    };

    const mockUser: LoggedUser = {
      id: '1',
      username: 'john.doe',
      email: 'john@example.com',
      phone: '01012345678',
      firstName: 'Ali',
      lastName: 'Mohamed',
      profilePhoto: '',
      emailVerified: true,
      phoneVerified: true,
      role: 'USER',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const mockResponse: ApiResponse<{ user: LoggedUser }> = {
      code: 200,
      status: true,
      payload: {
        user: mockUser,
      },
    };

    // Act
    service.updateUserProfile(data).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/users/profile`);

    // Assert
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(data);

    req.flush(mockResponse);
  });

  // changePassword
  it('should change password', () => {
    // Arrange
    const data: ChangePasswordRequest = {
      currentPassword: 'OldPassword123',
      newPassword: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    };

    const mockResponse: GeneralResponse = {
      status: true,
      message: 'Password changed successfully',
      code: '200',
    };

    // Act
    service.changePassword(data).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/users/change-password`);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush(mockResponse);
  });

  // requestEmailChange
  it('should request email change', () => {
    // Arrange
    const data: NewEmailRequest = {
      newEmail: 'ali@123',
    };

    const mockResponse: GeneralResponse = {
      status: true,
      message: 'Email change request sent successfully',
      code: '200',
    };

    // Act
    service.requestEmailChange(data).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/users/email/request`);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush(mockResponse);
  });

  // confirmEmailChange
  it('should confirm email change', () => {
    // Arrange
    const data = {
      code: '123456',
    };

    const mockUser: LoggedUser = {
      id: '1',
      username: 'john.doe',
      email: 'newemail@example.com',
      phone: '01012345678',
      firstName: 'John',
      lastName: 'Doe',
      profilePhoto: '',
      emailVerified: true,
      phoneVerified: true,
      role: 'USER',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const mockResponse: ApiResponse<{ user: LoggedUser }> = {
      code: 200,
      status: true,
      payload: {
        user: mockUser,
      },
    };

    // Act
    service.confirmEmailChange(data).subscribe((result) => {
      expect(result).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/users/email/confirm`);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush(mockResponse);
  });

  // deleteAccount
  it('should delete account', () => {
    // Arrange
    const mockResponse: GeneralResponse = {
      status: true,
      message: 'Account deleted successfully',
      code: '200',
    };

    // Act
    service.deleteAccount().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/users/account`);

    // Assert
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });
});
