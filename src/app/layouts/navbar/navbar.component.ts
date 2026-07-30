import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  links: WritableSignal<string[]> = signal([]);
  ngOnInit() {
    this.links.update((prev) => [...prev, this.router.url]);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        this.links.update((prev) => [...prev, `/   ${event.urlAfterRedirects}`]);
      });
  }
}
