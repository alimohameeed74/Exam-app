import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
