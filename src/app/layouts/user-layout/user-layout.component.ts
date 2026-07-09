import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="panel-layout">
      <aside class="panel-sidebar" aria-label="Navegación de mi cuenta">
        <div class="panel-user-box">
          <div class="panel-user-name">{{ auth.currentUser()?.nombre }}</div>
          <div class="panel-user-role">Cuenta usuario</div>
        </div>

        <nav class="panel-nav">
          <a
            routerLink="/usuario/dashboard"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">▤</span> Dashboard
          </a>
          <a
            routerLink="/usuario/mis-reservas"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">▦</span> Mis reservas
          </a>
          <a
            routerLink="/usuario/nueva-reserva"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">＋</span> Nueva reserva
          </a>
          <a
            routerLink="/usuario/favoritos"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">★</span> Favoritos
          </a>
          <a
            routerLink="/usuario/perfil"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">◎</span> Mi perfil
          </a>
          <a
            routerLink="/usuario/soporte"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">?</span> Soporte
          </a>
        </nav>

        <div class="panel-logout-item">
          <button class="panel-logout-btn" (click)="logout()">
            <span class="panel-nav-icon">→</span> Cerrar sesión
          </button>
        </div>
      </aside>

      <main class="panel-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class UserLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
