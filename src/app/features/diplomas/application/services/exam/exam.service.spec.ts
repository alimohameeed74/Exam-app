import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExamService } from './exam.service.js';
import { environment } from '../../../../../../environments/environment.development.js';
import { SubmitExamRequest } from '../../../domain/models/request/submit-exam-request.js';

describe('ExamService', () => {
  let service: ExamService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ExamService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get exam questions', () => {
    const mockResponse = {
      code: 200,
      status: true,
      payload: {
        examId: '1',
        questions: [],
      },
    };

    service.getExamQuestions('1').subscribe((result) => {
      expect(result).toEqual(mockResponse.payload);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/questions/exam/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get exam details', () => {
    const mockResponse = {
      code: 200,
      status: true,
      payload: {
        exam: {
          id: '1',
          title: 'Angular Exam',
        },
      },
    };

    service.getExamDetails('1').subscribe((result) => {
      expect(result).toEqual(mockResponse.payload.exam);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/exams/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should submit exam', () => {
    const data: SubmitExamRequest = {
      examId: '1',
      startedAt: '2026-09-10T12:00:00Z',
      answers: [
        {
          questionId: '10',
          answerId: '100',
        },
        {
          questionId: '11',
          answerId: '101',
        },
      ],
    };

    const mockResponse = {
      code: 200,
      status: true,
      payload: {
        id: 'submission-1',
        score: 90,
      },
    };

    service.submitExam(data).subscribe((result) => {
      expect(result).toEqual(mockResponse.payload);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/submissions`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush(mockResponse);
  });
});
