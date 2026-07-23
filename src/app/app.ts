import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDataService } from './features/auth/application/services/user-data.service.js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Exam_App');
  private userDataService = inject(UserDataService);
  ngOnInit() {
    this.userDataService.init();
  }
}
