/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { DiplomaService } from '../diploma/diploma.service';

describe('Service: Diploma', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiplomaService],
    });
  });

  it('should ...', inject([DiplomaService], (service: DiplomaService) => {
    expect(service).toBeTruthy();
  }));
});
