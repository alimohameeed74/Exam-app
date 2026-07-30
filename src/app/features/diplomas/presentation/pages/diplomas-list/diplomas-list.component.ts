import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DiplomaService } from '../../../application/services/diploma.service.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DiplomaResponse } from '../../../domain/models/response/diploma-response.js';
import { DiplomaCardComponent } from '../../components/diploma-card/diploma-card.component';

@Component({
  selector: 'app-diplomas-list',
  templateUrl: './diplomas-list.component.html',
  styleUrls: ['./diplomas-list.component.css'],
  imports: [DiplomaCardComponent],
})
export class DiplomasListComponent implements OnInit {
  private diplomaService = inject(DiplomaService);
  private destroyRef = inject(DestroyRef);
  diplomas: WritableSignal<DiplomaResponse[]> = signal([]);
  pages: WritableSignal<number> = signal(1);
  constructor() {}

  ngOnInit() {
    this.getDiplomas(1);
  }
  getDiplomas(pages: number) {
    this.diplomaService
      .getAll(pages)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: DiplomaResponse[]) => {
          if (res.length !== 0) {
            console.log(res);
            this.diplomas.update((v) => [...v, ...res]);
          }
        },
      });
  }
  seeMore() {
    this.pages.set(this.pages() + 1);
    this.getDiplomas(this.pages());
  }
}
