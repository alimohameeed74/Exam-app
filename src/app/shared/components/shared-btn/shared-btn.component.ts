import { Component, input, InputSignal, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-shared-btn',
  templateUrl: './shared-btn.component.html',
  styleUrls: ['./shared-btn.component.css'],
})
export class SharedBtnComponent implements OnInit {
  mess: InputSignal<string> = input.required();
  onBtnClicked = output<void>();
  constructor() {}

  ngOnInit() {}
  btnClicked() {
    this.onBtnClicked.emit();
  }
}
