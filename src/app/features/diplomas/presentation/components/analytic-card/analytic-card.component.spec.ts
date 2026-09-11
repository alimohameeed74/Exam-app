import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticCardComponent } from './analytic-card.component';
import { Submission } from '../../../domain/models/response/exam-submit-response.js';

describe('AnalyticCardComponent', () => {
  let component: AnalyticCardComponent;
  let fixture: ComponentFixture<AnalyticCardComponent>;

  const mockSubmission: Submission = {
    totalQuestions: 10,
    correctAnswers: 8,
  } as Submission;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('submission', mockSubmission);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate score percentage', () => {
    expect(component.scorePercentage()).toBe(80);
  });

  it('should return 0 when there are no questions', () => {
    fixture.componentRef.setInput('submission', {
      totalQuestions: 0,
      correctAnswers: 0,
    } as Submission);

    expect(component.scorePercentage()).toBe(0);
  });

  it('should calculate 100% for all correct answers', () => {
    fixture.componentRef.setInput('submission', {
      totalQuestions: 5,
      correctAnswers: 5,
    } as Submission);

    expect(component.scorePercentage()).toBe(100);
  });

  it('should calculate 0% when no answers are correct', () => {
    fixture.componentRef.setInput('submission', {
      totalQuestions: 10,
      correctAnswers: 0,
    } as Submission);

    expect(component.scorePercentage()).toBe(0);
  });
});
