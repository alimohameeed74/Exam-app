import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ExamCardComponent } from './exam-card.component';
import { DiplomaExamResponse } from '../../../domain/models/response/diploma-exam-response.js';

describe('ExamCardComponent', () => {
  let component: ExamCardComponent;
  let fixture: ComponentFixture<ExamCardComponent>;

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockCard: DiplomaExamResponse = {
    id: '1',
  } as DiplomaExamResponse;

  beforeEach(async () => {
    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExamCardComponent],
      providers: [
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

    fixture = TestBed.createComponent(ExamCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('card', mockCard);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set card input', () => {
    expect(component.card()).toEqual(mockCard);
  });

  it('should navigate to questions relative to the current route', () => {
    component.goToQuestions('1');

    expect(router.navigate).toHaveBeenCalledWith(['1', 'questions'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });
});
