import { UserDataService } from './../../features/auth/application/services/user-data.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  showDropDown_: WritableSignal<boolean> = signal(false);
  userDataService = inject(UserDataService);

  constructor() {}

  ngOnInit() {}
  showDropDown() {
    this.showDropDown_.update((v) => !v);
  }
  logout() {
    console.log('ss');
    this.userDataService.logout();
    this.router.navigate(['/auth']);
  }
}
