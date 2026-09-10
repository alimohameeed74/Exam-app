import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { DiplomaCardComponent } from './diploma-card.component';
import { DiplomaResponse } from '../../../domain/models/response/diploma-response.js';

describe('DiplomaCardComponent', () => {
  let component: DiplomaCardComponent;
  let fixture: ComponentFixture<DiplomaCardComponent>;

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockDiploma: DiplomaResponse = {
    id: '1',
    title: 'Angular Diploma',
    description: 'Angular development diploma',
    image: 'angular.jpg',
    immutable: false,
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-10T10:00:00Z',
    exams: [],
  };

  beforeEach(async () => {
    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DiplomaCardComponent],
      providers: [
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiplomaCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('diploma', mockDiploma);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set diploma input', () => {
    expect(component.diploma()).toEqual(mockDiploma);
  });

  it('should navigate to diploma exams when showDiplomaDetails is called', () => {
    component.showDiplomaDetails('1');

    expect(router.navigate).toHaveBeenCalledWith(['/main/diplomas/', '1', 'exams']);
  });
});
