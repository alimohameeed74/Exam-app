import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development.js';
import { ApiResponse } from '../../../../core/models/response/api-response.js';
import { LoggedUser } from '../../../auth/domain/models/response/logged-user.js';
import { UpdateProfileReq } from '../../domian/models/request/update-profile-req.js';
import { NewEmailRequest } from '../../domian/models/request/new-email-request.js';
import { ChangePasswordRequest } from '../../domian/models/request/change-password-request.js';
import { GeneralResponse } from '../../domian/models/response/general-response.js';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private httpClient = inject(HttpClient);
  constructor() {}
  getUserProfile(): Observable<LoggedUser> {
    return this.httpClient
      .get<ApiResponse<{ user: LoggedUser }>>(`${environment.apiURL}/users/profile`)
      .pipe(map((res) => res.payload.user));
  }
  updateUserProfile(data: UpdateProfileReq): Observable<LoggedUser> {
    return this.httpClient
      .patch<ApiResponse<{ user: LoggedUser }>>(`${environment.apiURL}/users/profile`, data)
      .pipe(map((res) => res.payload.user));
  }
  changePassword(data: ChangePasswordRequest): Observable<GeneralResponse> {
    return this.httpClient.post<GeneralResponse>(
      `${environment.apiURL}/users/change-password`,
      data,
    );
  }
  requestEmailChange(data: NewEmailRequest): Observable<GeneralResponse> {
    return this.httpClient.post<GeneralResponse>(`${environment.apiURL}/users/email/request`, data);
  }
  confirmEmailChange(data: { code: string }): Observable<LoggedUser> {
    return this.httpClient
      .post<ApiResponse<{ user: LoggedUser }>>(`${environment.apiURL}/users/email/confirm`, data)
      .pipe(map((res) => res.payload.user));
  }
  deleteAccount(): Observable<GeneralResponse> {
    return this.httpClient.delete<GeneralResponse>(`${environment.apiURL}/users/account`);
  }
}
