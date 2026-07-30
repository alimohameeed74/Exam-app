import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiplomaService } from '../../../application/services/diploma.service.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DiplomaExamResponse } from '../../../domain/models/response/diploma-exam-response.js';
import { ExamCardComponent } from '../../components/exam-card/exam-card.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-diploma-exams',
  templateUrl: './diploma-exams.component.html',
  styleUrls: ['./diploma-exams.component.css'],
  imports: [ExamCardComponent],
})
export class DiplomaExamsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private loc = inject(Location);
  private destroyRef = inject(DestroyRef);
  private diplomaService = inject(DiplomaService);

  diplomaExams: WritableSignal<DiplomaExamResponse[]> = signal([]);
  constructor() {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getDiplomaExams(id);
      }
    });
  }

  getDiplomaExams(id: string) {
    this.diplomaService
      .getDiplomaExamsId(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: DiplomaExamResponse[]) => {
          console.log(res);
          if (res.length !== 0) {
            this.diplomaExams.set(res);
          }
        },
      });
  }

  back() {
    this.loc.back();
  }
}
