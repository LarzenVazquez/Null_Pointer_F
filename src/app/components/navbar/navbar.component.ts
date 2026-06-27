import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { NgIf, NgClass, NgFor, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SubMenuItem { label: string; href: string; route?: string; }
interface NavItem { label: string; route: string; submenu?: SubMenuItem[]; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, RouterLink, RouterLinkActive],
  template: `
    <nav class="np-nav" role="navigation" aria-label="Navegacion principal">
      <!-- CABECERA / HEADER: Logo -->
      <a class="np-logo" routerLink="/">NULL<span>_</span>POINTER</a>

      <!-- MENU PRINCIPAL: enlaces con eventos de puntero -->
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
            [routerLinkActiveOptions]="{exact: item.route === '/'}"
            role="menuitem"
            (click)="onClickItem(item.label)"
          >
            {{ item.label }}
            <span *ngIf="item.submenu" class="arrow"
              [class.open]="activeMenu() === item.label">▾</span>
          </a>

          <!-- Dropdown submenu -->
          <ul *ngIf="item.submenu && activeMenu() === item.label"
              class="np-dropdown" role="menu">
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

    <!-- Overlay para cerrar dropdown -->
    <div *ngIf="activeMenu()" class="np-overlay" (click)="onLeave()"></div>
  `,
  styles: [`
    .np-nav {
      background: var(--np-black);
      border-bottom: 1px solid #222;
      padding: 18px 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 200;
      backdrop-filter: blur(8px);
    }

    .np-logo {
      font-size: 22px;
      font-weight: 700;
      color: var(--np-white);
      letter-spacing: 3.5px;
      text-transform: uppercase;
      text-decoration: none;
      span { color: var(--np-accent); }
    }

    .np-nav-links {
      display: flex;
      gap: 0;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .np-nav-item {
      position: relative;

      a {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 8px 18px;
        font-size: 15px;
        letter-spacing: 1.5px;
        color: var(--np-gray);
        text-decoration: none;
        text-transform: uppercase;
        transition: color 0.2s;
        cursor: pointer;
        white-space: nowrap;

        &:hover, &.active-link { color: var(--np-accent); }
      }
    }

    .arrow {
      font-size: 11px;
      transition: transform 0.2s;
      &.open { transform: rotate(180deg); color: var(--np-accent); }
    }

    .np-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      background: #0d0d0d;
      border: 1px solid var(--np-accent);
      border-top: 2px solid var(--np-accent);
      min-width: 210px;
      z-index: 300;
      list-style: none;
      padding: 0;
      margin: 0;
      animation: dropIn 0.15s ease;
    }

    @keyframes dropIn {
      from { opacity:0; transform:translateY(-6px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .np-dropdown-item {
      display: block;
      padding: 11px 20px;
      font-size: 13px;
      color: var(--np-gray);
      text-decoration: none;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      border-bottom: 1px solid #1a1a1a;
      transition: all 0.15s;

      &:last-child { border-bottom: none; }
      &:hover { background: #1a1a1a; color: var(--np-accent); padding-left: 28px; }
    }

    .np-cta-btn {
      background: var(--np-accent);
      color: var(--np-black);
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 9px 22px;
      text-decoration: none;
      transition: opacity 0.2s;
      white-space: nowrap;
      &:hover { opacity: 0.85; }
    }

    .np-overlay {
      position: fixed;
      inset: 0;
      z-index: 150;
    }

    @media (max-width: 768px) {
      .np-nav { padding: 14px 20px; }
      .np-nav-links { display: none; }
      .np-logo { font-size: 18px; }
    }
  `],
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);
  activeMenu = signal<string | null>(null);

  navItems: NavItem[] = [
    {
      label: 'Inicio',
      route: '/',
    },
    {
      label: 'Salas',
      route: '/salas',
      submenu: [
        { label: 'Sala A — Premium', href: '/salas#sala-a' },
        { label: 'Sala B — Pro',     href: '/salas#sala-b' },
        { label: 'Sala C — Estandar',href: '/salas#sala-c' },
      ],
    },
    { label: 'Reservas', route: '/reservas' },
    { label: 'Nosotros', route: '/nosotros' },
    { label: 'Contacto', route: '/contacto' },
  ];

  onHover(label: string): void {
    const item = this.navItems.find(n => n.label === label);
    if (item?.submenu) this.activeMenu.set(label);
  }

  onLeave(): void { this.activeMenu.set(null); }

  onClickItem(label: string): void {
    const item = this.navItems.find(n => n.label === label);
    if (!item?.submenu) { this.onLeave(); return; }
    this.activeMenu.update(cur => cur === label ? null : label);
  }
}
