import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
    </nav>

    <div *ngIf="activeMenu()" class="np-overlay" (click)="onLeave()"></div>
  `,
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);
  activeMenu = signal<string | null>(null);

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
}
