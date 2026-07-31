import { Component, computed, input, InputSignal, OnInit } from '@angular/core';
import { Submission } from '../../../domain/models/response/exam-submit-response.js';

@Component({
  selector: 'app-analytic-card',
  templateUrl: './analytic-card.component.html',
  styleUrls: ['./analytic-card.component.css'],
})
export class AnalyticCardComponent implements OnInit {
  submission: InputSignal<Submission> = input.required();
  constructor() {}

  ngOnInit() {}
  scorePercentage = computed(() => {
    const total = this.submission().totalQuestions;

    if (total === 0) {
      return 0;
    }

    return (this.submission().correctAnswers / total) * 100;
  });
}
