import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  imports: [RouterOutlet],
})
export class MainLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
