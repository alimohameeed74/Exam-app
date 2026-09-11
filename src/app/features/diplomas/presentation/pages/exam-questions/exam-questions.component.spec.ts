import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { ExamQuestionsComponent } from './exam-questions.component';
import { ExamService } from '../../../application/services/exam/exam.service.js';

describe('ExamQuestionsComponent', () => {
  let component: ExamQuestionsComponent;
  let fixture: ComponentFixture<ExamQuestionsComponent>;

  let examService: {
    getExamQuestions: ReturnType<typeof vi.fn>;
    getExamDetails: ReturnType<typeof vi.fn>;
    submitExam: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  let location: {
    back: ReturnType<typeof vi.fn>;
  };

  let toastr: {
    success: ReturnType<typeof vi.fn>;
  };

  const mockQuestions = [
    {
      id: 'q1',
      question: 'What is Angular?',
      answers: [
        {
          id: 'a1',
          answer: 'Framework',
        },
        {
          id: 'a2',
          answer: 'Database',
        },
      ],
    },
    {
      id: 'q2',
      question: 'What is TypeScript?',
      answers: [
        {
          id: 'a3',
          answer: 'Language',
        },
      ],
    },
  ];

  const mockExamDetails = {
    id: 'exam1',
    title: 'Angular Exam',
    duration: 30,
  };

  const mockSubmission = {
    id: 'submission1',
    score: 90,
  };

  beforeEach(async () => {
    examService = {
      getExamQuestions: vi.fn().mockReturnValue(
        of({
          questions: mockQuestions,
        }),
      ),

      getExamDetails: vi.fn().mockReturnValue(of(mockExamDetails)),

      submitExam: vi.fn().mockReturnValue(of(mockSubmission)),
    };

    router = {
      navigate: vi.fn(),
    };

    location = {
      back: vi.fn(),
    };

    toastr = {
      success: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExamQuestionsComponent],
      providers: [
        {
          provide: ExamService,
          useValue: examService,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: Location,
          useValue: location,
        },
        {
          provide: ToastrService,
          useValue: toastr,
        },
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'examId' ? 'exam1' : null),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamQuestionsComponent);
    component = fixture.componentInstance;
  });

  // ---------------------------
  // Component
  // ---------------------------

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------
  // ngOnInit
  // ---------------------------

  it('should get exam id and load data on init', () => {
    const spy = vi.spyOn(component, 'getData');

    component.ngOnInit();

    expect(component.examId()).toBe('exam1');
    expect(spy).toHaveBeenCalledWith('exam1');
  });

  // ---------------------------
  // Answer Selection
  // ---------------------------

  it('should select an answer', () => {
    component.selectAnswer('q1', 'a1');

    expect(component.selectedAnswers()).toEqual({
      q1: 'a1',
    });
  });

  it('should check if answer is selected', () => {
    component.selectAnswer('q1', 'a1');

    expect(component.isSelected('q1', 'a1')).toBe(true);
    expect(component.isSelected('q1', 'a2')).toBe(false);
  });

  // ---------------------------
  // Questions Navigation
  // ---------------------------

  it('should move to next question', () => {
    component.questions.set(mockQuestions as any);
    component.currentIndex.set(0);

    component.nextQuestion();

    expect(component.currentIndex()).toBe(1);
  });

  it('should not move next when on last question', () => {
    component.questions.set(mockQuestions as any);
    component.currentIndex.set(1);

    component.nextQuestion();

    expect(component.currentIndex()).toBe(1);
  });

  it('should move to previous question', () => {
    component.questions.set(mockQuestions as any);
    component.currentIndex.set(1);

    component.previousQuestion();

    expect(component.currentIndex()).toBe(0);
  });

  it('should not move previous when on first question', () => {
    component.currentIndex.set(0);

    component.previousQuestion();

    expect(component.currentIndex()).toBe(0);
  });

  // ---------------------------
  // Computed Values
  // ---------------------------

  it('should return current question', () => {
    component.questions.set(mockQuestions as any);
    component.currentIndex.set(0);

    expect(component.currentQuestion()).toEqual(mockQuestions[0]);
  });

  it('should format remaining time', () => {
    component.remainingSeconds.set(125);

    expect(component.formattedTime()).toBe('02:05');
  });

  it('should calculate progress offset', () => {
    component.examFullDetails.set(mockExamDetails as any);
    component.remainingSeconds.set(900);

    const totalSeconds = 30 * 60;
    const expected = component.circumference * (1 - 900 / totalSeconds);

    expect(component.progressOffset()).toBe(expected);
  });

  it('should return full circumference when exam duration is zero', () => {
    component.examFullDetails.set({
      ...mockExamDetails,
      duration: 0,
    } as any);

    component.remainingSeconds.set(0);

    expect(component.progressOffset()).toBe(component.circumference);
  });

  // ---------------------------
  // getData
  // ---------------------------

  it('should get exam details and questions', () => {
    examService.getExamDetails.mockReturnValue(of(mockExamDetails));

    examService.getExamQuestions.mockReturnValue(
      of({
        questions: mockQuestions,
      }),
    );

    component.getData('exam1');

    expect(examService.getExamDetails).toHaveBeenCalledWith('exam1');
    expect(examService.getExamQuestions).toHaveBeenCalledWith('exam1');

    expect(component.questions()).toEqual(mockQuestions);
    expect(component.examFullDetails()).toEqual(mockExamDetails);

    expect(component.remainingSeconds()).toBe(30 * 60);
    expect(component.examStartedAt()).not.toBe('');
  });

  // ---------------------------
  // examQuestions
  // ---------------------------

  it('should get exam questions', () => {
    examService.getExamQuestions.mockReturnValue(
      of({
        questions: mockQuestions,
      }),
    );

    component.examQuestions('exam1').subscribe((result) => {
      expect(result.questions).toEqual(mockQuestions);
    });

    expect(examService.getExamQuestions).toHaveBeenCalledWith('exam1');
  });

  // ---------------------------
  // getExamFullDetails
  // ---------------------------

  it('should get exam details', () => {
    examService.getExamDetails.mockReturnValue(of(mockExamDetails));

    component.getExamFullDetails('exam1').subscribe((result) => {
      expect(result).toEqual(mockExamDetails);
    });

    expect(examService.getExamDetails).toHaveBeenCalledWith('exam1');
  });

  // ---------------------------
  // Back
  // ---------------------------

  it('should go back', () => {
    component.back();

    expect(location.back).toHaveBeenCalled();
  });

  // ---------------------------
  // Submit Exam
  // ---------------------------

  it('should submit exam successfully', () => {
    const stopTimerSpy = vi.spyOn(component, 'stopTimer');

    examService.submitExam.mockReturnValue(of(mockSubmission));

    component.examId.set('exam1');
    component.examStartedAt.set('2026-09-10T12:00:00.000Z');

    component.selectedAnswers.set({
      q1: 'a1',
      q2: 'a3',
    });

    component.submitExam();

    expect(stopTimerSpy).toHaveBeenCalled();

    expect(examService.submitExam).toHaveBeenCalledWith({
      examId: 'exam1',
      startedAt: '2026-09-10T12:00:00.000Z',
      answers: [
        {
          questionId: 'q1',
          answerId: 'a1',
        },
        {
          questionId: 'q2',
          answerId: 'a3',
        },
      ],
    });

    expect(component.submissionDetails()).toEqual(mockSubmission);

    expect(component.examState()).toBe('submitted');

    expect(toastr.success).toHaveBeenCalledWith('End of exam', 'Success');
  });

  // ---------------------------
  // Stop Timer
  // ---------------------------

  it('should stop timer', () => {
    const unsubscribe = vi.fn();

    (component as any).timerSubscription = {
      unsubscribe,
    };

    component.stopTimer();

    expect(unsubscribe).toHaveBeenCalled();
  });

  // ---------------------------
  // Restart Exam
  // ---------------------------

  it('should restart exam', () => {
    component.examState.set('submitted');
    component.selectedAnswers.set({
      q1: 'a1',
      q2: 'a3',
    });
    component.currentIndex.set(1);
    component.submissionDetails.set(mockSubmission as any);
    component.examFullDetails.set(mockExamDetails as any);
    component.remainingSeconds.set(10);

    const stopTimerSpy = vi.spyOn(component, 'stopTimer');

    component.restartExam();

    expect(stopTimerSpy).toHaveBeenCalled();

    expect(component.examState()).toBe('taking');
    expect(component.selectedAnswers()).toEqual({});
    expect(component.currentIndex()).toBe(0);
    expect(component.submissionDetails()).toBe(null);
    expect(component.remainingSeconds()).toBe(30 * 60);
    expect(component.examStartedAt()).not.toBe('');
  });

  // ---------------------------
  // Explore
  // ---------------------------

  it('should navigate to main page', () => {
    component.explore();

    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  });
});
