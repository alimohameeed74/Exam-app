import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DiplomaService } from './diploma.service.js';
import { environment } from '../../../../../../environments/environment.development.js';

describe('DiplomaService', () => {
  let service: DiplomaService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(DiplomaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all diplomas', () => {
    const mockResponse = {
      code: 200,
      status: true,
      payload: {
        data: [
          {
            id: '1',
            name: 'Diploma 1',
          },
          {
            id: '2',
            name: 'Diploma 2',
          },
        ],
        total: 2,
        page: 1,
        limit: 12,
      },
    };

    service.getAll(1).subscribe((result) => {
      expect(result).toEqual(mockResponse.payload.data);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/diplomas?page=1&limit=12`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get diploma details', () => {
    const mockResponse = {
      code: 200,
      status: true,
      payload: {
        diploma: {
          id: '1',
          name: 'Diploma 1',
        },
      },
    };

    service.getDiplomaDetails('1').subscribe((result) => {
      expect(result).toEqual(mockResponse.payload.diploma);
    });

    const req = httpTestingController.expectOne(`${environment.apiURL}/diplomas/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get diploma exams', () => {
    const mockResponse = {
      code: 200,
      status: true,
      payload: {
        data: [
          {
            id: '1',
            name: 'Exam 1',
          },
          {
            id: '2',
            name: 'Exam 2',
          },
        ],
        total: 2,
        page: 1,
        limit: 12,
      },
    };

    service.getDiplomaExamsId('1').subscribe((result) => {
      expect(result).toEqual(mockResponse.payload.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiURL}/exams?diplomaId=1&page=1&limit=12`,
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
