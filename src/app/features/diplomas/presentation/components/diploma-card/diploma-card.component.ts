import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { DiplomaResponse } from '../../../domain/models/response/diploma-response.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diploma-card',
  templateUrl: './diploma-card.component.html',
  styleUrls: ['./diploma-card.component.css'],
})
export class DiplomaCardComponent implements OnInit {
  private router = inject(Router);
  diploma: InputSignal<DiplomaResponse> = input.required();
  constructor() {}

  ngOnInit() {}
  showDiplomaDetails(id: string) {
    this.router.navigate(['/main/diplomas/', id, 'exams']);
  }
}
