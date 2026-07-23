import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedInputComponent } from '../../../../../shared/components/shared-input/shared-input.component';
import { FormBuilder, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  imports: [RouterLink, SharedInputComponent],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  step: WritableSignal<number> = signal(3);
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  passwordsForm = this.fb.group({
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });
  constructor() {}

  ngOnInit() {}

  icreaseStep() {}

  get emailController() {
    return this.emailForm.controls.email;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
