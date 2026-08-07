import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserDataService } from '../../../../auth/application/services/user-data.service.js';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account-layout',
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.css'],
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class AccountLayoutComponent implements OnInit {
  private router = inject(Router);
  private userDataService = inject(UserDataService);
  private location = inject(Location);

  showDropDown_: WritableSignal<boolean> = signal(false);

  constructor() {}

  ngOnInit() {}

  logout() {
    this.userDataService.logout();
    this.router.navigate(['/auth']);
  }
  back() {
    this.location.back();
  }
}
