import { Component, signal, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

interface SubMenuItem {
  label: string;
  href: string;
  route?: string;
}
interface NavItem {
  label: string;
  route: string;
  submenu?: SubMenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, RouterLinkActive],
  template: `
    <nav class="np-nav" role="navigation" aria-label="Navegacion principal">
      <a class="np-logo" routerLink="/">NULL<span>_</span>POINTER</a>

      <ul class="np-nav-links" role="menubar">
        <li
          *ngFor="let item of navItems"
          class="np-nav-item"
          role="none"
          (mouseenter)="onHover(item.label)"
          (mouseleave)="onLeave()"
        >
          <a
            [routerLink]="item.route"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
            role="menuitem"
            (click)="onClickItem(item.label)"
          >
            {{ item.label }}
            <span
              *ngIf="item.submenu"
              class="arrow"
              [class.open]="activeMenu() === item.label"
              >▾</span
            >
          </a>

          <ul
            *ngIf="item.submenu && activeMenu() === item.label"
            class="np-dropdown"
            role="menu"
          >
            <li *ngFor="let sub of item.submenu" role="none">
              <a [href]="sub.href" class="np-dropdown-item" role="menuitem">
                → {{ sub.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <a class="np-cta-btn" routerLink="/reservas">Reservar ahora</a>

      <ng-container *ngIf="auth.isAuthenticated(); else loggedOut">
        <div class="np-account" (click)="toggleAccountMenu($event)">
          <button class="np-account-btn" type="button">
            {{ auth.currentUser()?.nombre?.split(' ')?.[0] }} ▾
          </button>
          <ul *ngIf="accountMenuOpen()" class="np-dropdown np-account-dropdown" role="menu">
            <li role="none">
              <a [routerLink]="auth.isAdmin() ? '/admin' : '/usuario'" class="np-dropdown-item" role="menuitem">
                → Mi panel
              </a>
            </li>
            <li role="none">
              <a (click)="logout()" class="np-dropdown-item" role="menuitem">
                → Cerrar sesión
              </a>
            </li>
          </ul>
        </div>
      </ng-container>
      <ng-template #loggedOut>
        <a class="np-login-link" routerLink="/auth/login">Iniciar sesión</a>
      </ng-template>
    </nav>

    <div *ngIf="activeMenu()" class="np-overlay" (click)="onLeave()"></div>
  `,
  styles: [`
    .np-login-link {
      color: var(--np-gray);
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 1px;
      margin-left: 18px;
      white-space: nowrap;
      &:hover { color: var(--np-accent); }
    }
    .np-account { position: relative; margin-left: 18px; }
    .np-account-btn {
      background: transparent;
      border: 1px solid #333;
      color: var(--np-white);
      font-family: var(--font-mono);
      font-size: 13px;
      padding: 7px 12px;
      cursor: pointer;
      letter-spacing: 0.5px;
      &:hover { border-color: var(--np-accent); }
    }
    .np-account-dropdown {
      top: calc(100% + 6px);
      right: 0;
      left: auto;
    }
  `],
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  auth = inject(AuthService);

  activeMenu = signal<string | null>(null);
  accountMenuOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Inicio', route: '/' },
    {
      label: 'Salas',
      route: '/salas',
      submenu: [
        { label: 'Sala A — Premium', href: '/salas#sala-a' },
        { label: 'Sala B — Pro', href: '/salas#sala-b' },
        { label: 'Sala C — Estandar', href: '/salas#sala-c' },
      ],
    },
    { label: 'Reservas', route: '/reservas' },
    { label: 'Servicios', route: '/servicios' },
    { label: 'Nosotros', route: '/nosotros' },
    { label: 'Contacto', route: '/contacto' },
  ];

  onHover(label: string): void {
    const item = this.navItems.find((n) => n.label === label);
    if (item?.submenu) this.activeMenu.set(label);
  }

  onLeave(): void {
    this.activeMenu.set(null);
  }

  onClickItem(label: string): void {
    const item = this.navItems.find((n) => n.label === label);
    if (!item?.submenu) {
      this.onLeave();
      return;
    }
    this.activeMenu.update((cur) => (cur === label ? null : label));
  }

  toggleAccountMenu(event: Event): void {
    event.stopPropagation();
    this.accountMenuOpen.update((open) => !open);
  }

  @HostListener('document:click')
  closeAccountMenu(): void {
    this.accountMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.accountMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}
