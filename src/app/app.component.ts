import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="site-shell">
      <app-navbar />
      <main class="site-main">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    .site-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--np-black);
    }
    .site-main {
      flex: 1;
    }
  `],
})
export class AppComponent {}
