import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class SidebarComponent implements OnInit {
  showDropDown_: WritableSignal<boolean> = signal(false);
  constructor() {}

  ngOnInit() {}
  showDropDown() {
    this.showDropDown_.update((v) => !v);
  }
}
