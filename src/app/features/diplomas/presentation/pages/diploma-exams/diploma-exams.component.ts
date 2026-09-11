import { DiplomaResponse } from './../../../domain/models/response/diploma-response';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiplomaService } from '../../../application/services/diploma/diploma.service.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DiplomaExamResponse } from '../../../domain/models/response/diploma-exam-response.js';
import { ExamCardComponent } from '../../components/exam-card/exam-card.component';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';

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
  diplomaDetails: WritableSignal<DiplomaResponse | null> = signal(null);
  constructor() {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getDiplomaDetails(id);
      }
    });
  }

  getDiplomaDetails(id: string) {
    this.diplomaService
      .getDiplomaDetails(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: DiplomaResponse) => {
          this.diplomaDetails.set(res);
        },
      });
  }

  back() {
    this.loc.back();
  }
}
