import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { ErrorMessComponent } from '../../../../../shared/components/error-mess/error-mess.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterLink, SharedInputComponent, AlertComponent, ErrorMessComponent],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
