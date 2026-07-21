import { Component, OnInit } from '@angular/core';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [SharedInputComponent, ErrorMessComponent, AlertComponent, RouterLink],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
