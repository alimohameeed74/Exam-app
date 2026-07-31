import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development.js';
import { DiplomaResponse } from '../../../domain/models/response/diploma-response.js';
import { ApiResponse } from '../../../../../core/models/response/api-response.js';
import { PaginatedResponse } from '../../../../../core/models/response/paginated-response.js';
import { DiplomaExamResponse } from '../../../domain/models/response/diploma-exam-response.js';

@Injectable({
  providedIn: 'root',
})
export class DiplomaService {
  private httpClient = inject(HttpClient);
  constructor() {}
  getAll(page: number): Observable<DiplomaResponse[]> {
    return this.httpClient
      .get<ApiResponse<PaginatedResponse<DiplomaResponse>>>(
        `${environment.apiURL}/diplomas?page=${page}&limit=12`,
      )
      .pipe(map((res) => res.payload.data));
  }
  getDiplomaDetails(id: string): Observable<DiplomaResponse> {
    return this.httpClient
      .get<ApiResponse<{ diploma: DiplomaResponse }>>(`${environment.apiURL}/diplomas/${id}`)
      .pipe(map((res) => res.payload.diploma));
  }
  getDiplomaExamsId(id: string): Observable<DiplomaExamResponse[]> {
    return this.httpClient
      .get<ApiResponse<PaginatedResponse<DiplomaExamResponse>>>(
        `${environment.apiURL}/exams?diplomaId=${id}&page=1&limit=12`,
      )
      .pipe(map((res) => res.payload.data));
  }
}
