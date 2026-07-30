import { Component, input, InputSignal, OnInit } from '@angular/core';
import { DiplomaExamResponse } from '../../../domain/models/response/diploma-exam-response.js';

@Component({
  selector: 'app-exam-card',
  templateUrl: './exam-card.component.html',
  styleUrls: ['./exam-card.component.css'],
})
export class ExamCardComponent implements OnInit {
  card: InputSignal<DiplomaExamResponse> = input.required();
  constructor() {}

  ngOnInit() {}
}
