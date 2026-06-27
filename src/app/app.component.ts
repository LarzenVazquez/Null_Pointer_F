import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventoCalendarioService } from './services/evento-calendario.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div
      class="site-shell"
      [style.--accent]="activeEvent().accentColor"
      [style.--bg]="activeEvent().bgColor || '#0a0a0a'"
    >
      <app-navbar />
      <main class="site-main">
        <router-outlet></router-outlet>
      </main>
      <app-footer />
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
  activeEvent = this.themeService.activeEvent;
}
