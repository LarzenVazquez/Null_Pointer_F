import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="panel-layout">
      <aside class="panel-sidebar" aria-label="Navegación de administración">
        <div class="panel-user-box">
          <div class="panel-user-name">{{ auth.currentUser()?.nombre }}</div>
          <div class="panel-user-role">{{ auth.currentUser()?.rol }}</div>
        </div>

        <nav class="panel-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="panel-nav-item">
            <span class="panel-nav-icon">▤</span> Dashboard
          </a>
          <a routerLink="/admin/reservas" routerLinkActive="active" class="panel-nav-item">
            <span class="panel-nav-icon">▦</span> Reservas
          </a>
          <a routerLink="/admin/salas" routerLinkActive="active" class="panel-nav-item">
            <span class="panel-nav-icon">▧</span> Salas
          </a>
          <ng-container *ngIf="auth.isAdmin()">
            <a routerLink="/admin/usuarios" routerLinkActive="active" class="panel-nav-item">
              <span class="panel-nav-icon">☺</span> Usuarios
            </a>
            <a routerLink="/admin/mensajes" routerLinkActive="active" class="panel-nav-item">
              <span class="panel-nav-icon">✉</span> Mensajes
            </a>
            <a routerLink="/admin/eventos" routerLinkActive="active" class="panel-nav-item">
              <span class="panel-nav-icon">✦</span> Eventos
            </a>
            <a routerLink="/admin/reportes" routerLinkActive="active" class="panel-nav-item">
              <span class="panel-nav-icon">≡</span> Reportes
            </a>
          </ng-container>
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
export class AdminLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
