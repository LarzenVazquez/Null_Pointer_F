import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '@layouts/public-layout/components/navbar/navbar.component';
import { FooterComponent } from '@layouts/public-layout/components/footer/footer.component';
import { SeasonalThemeComponent } from '@shared/components/seasonal-theme/seasonal-theme.component';
import { EventoCalendarioService } from '@services/evento-calendario.service';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    NavbarComponent,
    FooterComponent,
    SeasonalThemeComponent,
  ],
  template: `
    <app-seasonal-theme />

    <div
      class="site-shell"
      [style.--accent]="activeEvent().accentColor"
      [style.--bg]="activeEvent().bgColor || '#0a0a0a'"
    >
      <app-navbar *ngIf="!isAdminRoute()" />
      <main class="site-main">
        <router-outlet></router-outlet>
      </main>
      <app-footer *ngIf="!isAdminRoute()" />
    </div>
  `,
  styles: [
    `
      .site-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--bg);
        transition: background 0.5s ease;
      }
      .site-main {
        flex: 1;
      }
    `,
  ],
})
export class AppComponent {
  private themeService = inject(EventoCalendarioService);
  private router = inject(Router);

  activeEvent = this.themeService.activeEvent;

  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/admin')),
    ),
    { initialValue: this.router.url.startsWith('/admin') },
  );
}
