import { isPlatformBrowser, Location } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { ExamService } from '../../../application/services/exam/exam.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ExamQuestionsResponse,
  Question,
} from '../../../domain/models/response/exam-questions-response.js';
import { forkJoin, interval, Subscription } from 'rxjs';
import { ExamFullDetails } from '../../../domain/models/response/exam-full-details.js';
import { SubmitExamRequest } from '../../../domain/models/request/submit-exam-request.js';
import { ToastrService } from 'ngx-toastr';
import { ExamSubmitResponse } from '../../../domain/models/response/exam-submit-response.js';
import { AnalyticCardComponent } from '../../components/analytic-card/analytic-card.component';
@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css'],
  imports: [AnalyticCardComponent],
})
export class ExamQuestionsComponent implements OnInit {
  private loc = inject(Location);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private examService = inject(ExamService);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private toaster = inject(ToastrService);
  private timerSubscription?: Subscription;
  submissionDetails: WritableSignal<ExamSubmitResponse | null> = signal(null);
  selectedAnswers: WritableSignal<Record<string, string>> = signal({});
  questions: WritableSignal<Question[]> = signal([]);
  selectedAnswerId = signal<string>('');
  examId = signal<string>('');
  examFullDetails: WritableSignal<ExamFullDetails | null> = signal(null);
  examStartedAt: WritableSignal<string> = signal('');
  remainingSeconds: WritableSignal<number> = signal(0);
  currentIndex: WritableSignal<number> = signal(0);
  examState: WritableSignal<'taking' | 'submitted'> = signal('taking');
  readonly radius = 16;
  readonly circumference = 2 * Math.PI * this.radius;
  currentQuestion = computed(() => {
    return this.questions()[this.currentIndex()];
  });
  formattedTime = computed(() => {
    const total = this.remainingSeconds();

    const minutes = Math.floor(total / 60);
    const seconds = total % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
  progressOffset = computed(() => {
    const totalSeconds = (this.examFullDetails()?.duration ?? 0) * 60;

    if (totalSeconds === 0) {
      return this.circumference;
    }

    const progress = this.remainingSeconds() / totalSeconds;

    return this.circumference * (1 - progress);
  });
  constructor() {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('examId');
      if (id) {
        this.examId.set(id);
        this.getData(id);
      }
    });
  }
  isSelected(questionId: string, answerId: string) {
    return this.selectedAnswers()[questionId] === answerId;
  }
  selectAnswer(questionId: string, answerId: string) {
    this.selectedAnswers.update((answers) => ({
      ...answers,
      [questionId]: answerId,
    }));
  }
  examQuestions(id: string) {
    return this.examService.getExamQuestions(id);
  }

  getExamFullDetails(id: string) {
    return this.examService.getExamDetails(id);
  }

  getData(id: string) {
    forkJoin({ examDetails: this.getExamFullDetails(id), examQuestions: this.examQuestions(id) })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: { examDetails: ExamFullDetails; examQuestions: ExamQuestionsResponse }) => {
          this.questions.set(res.examQuestions.questions);
          this.examFullDetails.set(res.examDetails);
          this.examStartedAt.set(new Date().toISOString());
          this.remainingSeconds.set(res.examDetails.duration * 60);
          if (isPlatformBrowser(this.platformId)) {
            this.startTimer();
          }
        },
      });
  }
  nextQuestion() {
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update((i) => i + 1);
    }
  }
  previousQuestion() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }
  back() {
    this.loc.back();
  }

  submitExam() {
    this.stopTimer();
    const result: SubmitExamRequest = {
      examId: this.examId(),
      startedAt: this.examStartedAt(),
      answers: Object.entries(this.selectedAnswers()).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      })),
    };

    this.examService
      .submitExam(result)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ExamSubmitResponse) => {
          this.submissionDetails.set(res);
          this.toaster.success('End of exam', 'Success');
          this.examState.set('submitted');
        },
      });
  }

  startTimer() {
    this.timerSubscription = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.remainingSeconds() > 0) {
          this.remainingSeconds.update((time) => time - 1);
        } else {
          this.submitExam();
        }
      });
  }
  stopTimer() {
    this.timerSubscription?.unsubscribe();
  }
  restartExam() {
    this.stopTimer();

    this.examState.set('taking');

    this.selectedAnswers.set({});

    this.currentIndex.set(0);

    this.submissionDetails.set(null);

    this.examStartedAt.set(new Date().toISOString());

    const duration = this.examFullDetails()?.duration ?? 0;
    this.remainingSeconds.set(duration * 60);

    if (isPlatformBrowser(this.platformId)) {
      this.startTimer();
    }
  }
  explore() {
    this.router.navigate(['/main']);
  }
}
