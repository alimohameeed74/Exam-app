import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { NgClass } from '../../../../../../../node_modules/@angular/common/types/_common_module-chunk';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterLink, SharedInputComponent, AlertComponent],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
