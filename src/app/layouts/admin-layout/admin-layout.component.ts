import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Router,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AdminSearchComponent } from '@shared/components/admin-search/admin-search.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    AdminSearchComponent,
  ],
  template: `
    <div class="panel-layout">
      <aside class="panel-sidebar" aria-label="Navegación de administración">
        <div class="panel-sidebar-header">
          <div class="panel-brand">
            <img src="/assets/logo_null.png" alt="Null Pointer Studio" class="panel-brand-img" width="24" height="24" />
            <span>NULL_POINTER</span>
          </div>
          <div class="panel-suite-title">Admin suite</div>
        </div>

        <div class="panel-user-box">
          <div class="panel-user-name">{{ auth.currentUser()?.nombre }}</div>
          <div class="panel-user-role">{{ auth.currentUser()?.rol }}</div>
        </div>

        <nav class="panel-nav">
          <a
            routerLink="/admin/dashboard"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">▤</span> Dashboard
          </a>
          <a
            routerLink="/admin/reservas"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">▦</span> Reservas
          </a>
          <a
            routerLink="/admin/salas"
            routerLinkActive="active"
            class="panel-nav-item"
          >
            <span class="panel-nav-icon">▧</span> Salas
          </a>
          <ng-container *ngIf="auth.isAdmin()">
            <a
              routerLink="/admin/usuarios"
              routerLinkActive="active"
              class="panel-nav-item"
            >
              <span class="panel-nav-icon">☺</span> Usuarios
            </a>
            <a
              routerLink="/admin/mensajes"
              routerLinkActive="active"
              class="panel-nav-item"
            >
              <span class="panel-nav-icon">✉</span> Mensajes
            </a>
            <a
              routerLink="/admin/eventos"
              routerLinkActive="active"
              class="panel-nav-item"
            >
              <span class="panel-nav-icon">✦</span> Eventos
            </a>
            <a
              routerLink="/admin/reportes"
              routerLinkActive="active"
              class="panel-nav-item"
            >
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
        <div class="panel-topbar" *ngIf="auth.isAdmin()">
          <app-admin-search></app-admin-search>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .panel-layout {
        display: grid;
        grid-template-columns: 260px 1fr;
        min-height: 100vh;
        width: 100%;
      }
      .panel-sidebar {
        background: #111;
        border-right: 1px solid #222;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 24px 16px;
        height: 100vh;
        position: sticky;
        top: 0;
        box-sizing: border-box;
        overflow-y: auto;
      }
      .panel-sidebar-header {
        padding-bottom: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid #222;
      }
      .panel-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--np-white);
        font-weight: 800;
        font-size: 14px;
        letter-spacing: 1px;
      }
      .panel-brand-img {
        display: block;
        object-fit: contain;
        flex-shrink: 0;
      }
      .panel-suite-title {
        color: var(--np-accent);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-top: 2px;
      }
      .panel-user-box {
        padding-bottom: 20px;
        border-bottom: 1px solid #222;
        margin-bottom: 20px;
      }
      .panel-user-name {
        color: var(--np-white);
        font-weight: 700;
        font-size: 15px;
      }
      .panel-user-role {
        color: var(--np-accent);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 4px;
      }
      .panel-nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }
      .panel-nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        color: var(--np-gray);
        text-decoration: none;
        font-size: 14px;
        transition: all 0.2s;
        &:hover {
          color: var(--np-white);
          background: rgba(255, 255, 255, 0.03);
        }
        &.active {
          color: var(--np-accent);
          background: rgba(255, 77, 0, 0.08);
          border-left: 2px solid var(--np-accent);
        }
      }
      .panel-nav-icon {
        font-size: 16px;
        width: 20px;
        text-align: center;
      }
      .panel-logout-item {
        padding-top: 16px;
        border-top: 1px solid #222;
      }
      .panel-logout-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        background: transparent;
        border: none;
        color: var(--np-gray);
        font-size: 14px;
        cursor: pointer;
        text-align: left;
        transition: color 0.2s;
        &:hover {
          color: var(--np-accent2);
        }
      }
      .panel-content {
        padding: 32px;
        background: var(--bg);
        overflow-y: auto;
        min-height: 100vh;
      }
      .panel-topbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 24px;
      }
    `,
  ],
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
