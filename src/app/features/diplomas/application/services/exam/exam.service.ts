import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development.js';
import { ExamQuestionsResponse } from '../../../domain/models/response/exam-questions-response.js';
import { ApiResponse } from '../../../../../core/models/response/api-response.js';
import { ExamFullDetails } from '../../../domain/models/response/exam-full-details.js';
import { SubmitExamRequest } from '../../../domain/models/request/submit-exam-request.js';
import { ExamSubmitResponse } from '../../../domain/models/response/exam-submit-response.js';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private httpClient = inject(HttpClient);
  constructor() {}

  getExamQuestions(id: string): Observable<ExamQuestionsResponse> {
    return this.httpClient
      .get<ApiResponse<ExamQuestionsResponse>>(`${environment.apiURL}/questions/exam/${id}`)
      .pipe(map((res) => res.payload));
  }
  getExamDetails(id: string): Observable<ExamFullDetails> {
    return this.httpClient
      .get<ApiResponse<{ exam: ExamFullDetails }>>(`${environment.apiURL}/exams/${id}`)
      .pipe(map((res) => res.payload.exam));
  }
  getQuestion(id: string) {}
  submitExam(data: SubmitExamRequest): Observable<ExamSubmitResponse> {
    return this.httpClient
      .post<ApiResponse<ExamSubmitResponse>>(`${environment.apiURL}/submissions`, data)
      .pipe(map((res) => res.payload));
  }
}
