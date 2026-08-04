import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { DiplomaExamResponse } from '../../../domain/models/response/diploma-exam-response.js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exam-card',
  templateUrl: './exam-card.component.html',
  styleUrls: ['./exam-card.component.css'],
})
export class ExamCardComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  card: InputSignal<DiplomaExamResponse> = input.required();

  constructor() {}

  ngOnInit() {}
  goToQuestions(id: string) {
    this.router.navigate([id, 'questions'], {
      relativeTo: this.activatedRoute,
    });
  }
}
