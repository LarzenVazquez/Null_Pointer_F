import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { NgIf, NgClass, NgFor, isPlatformBrowser } from '@angular/common';

interface SubMenuItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  submenu?: SubMenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, NgClass, NgFor], // <-- ¡Añadido NgFor aquí!
  template: `
    <nav class="np-nav">
      <div class="np-logo">NULL<span>_</span>POINTER</div>

      <div class="np-nav-links">
        <div
          *ngFor="let item of navItems"
          class="np-nav-item"
          (mouseenter)="onHover(item.label)"
          (mouseleave)="onLeave()"
          (click)="onClickItem(item.label)"
        >
          <a [href]="item.href" (click)="$event.preventDefault()">
            {{ item.label }}
            <span
              *ngIf="item.submenu"
              class="arrow"
              [class.open]="activeMenu() === item.label"
              >▾</span
            >
          </a>

          <div
            *ngIf="item.submenu && activeMenu() === item.label"
            class="np-dropdown"
          >
            <a
              *ngFor="let sub of item.submenu"
              [href]="sub.href"
              class="np-dropdown-item"
              >→ {{ sub.label }}</a
            >
          </div>
        </div>
      </div>

      <button class="np-cta-btn" (click)="onReservar()">Reservar ahora</button>
    </nav>

    <div *ngIf="activeMenu()" class="np-overlay" (click)="onLeave()"></div>
  `,
  styles: [
    `
      .np-nav {
        background: var(--np-black);
        border-bottom: 1px solid #222;
        padding: 21px 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 100;
      }

      .np-logo {
        font-size: 25px;
        font-weight: 700;
        color: var(--np-white);
        letter-spacing: 3.5px;
        text-transform: uppercase;
        span {
          color: var(--np-accent);
        }
      }

      .np-nav-links {
        display: flex;
        gap: 35px;
        align-items: center;
      }

      .np-nav-item {
        position: relative;

        a {
          font-size: 18px;
          letter-spacing: 1.75px;
          color: var(--np-gray);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;

          &:hover {
            color: var(--np-accent);
          }
        }
      }

      .arrow {
        font-size: 12px;
        transition: transform 0.2s;
        &.open {
          transform: rotate(180deg);
          color: var(--np-accent);
        }
      }

      /* ---- Dropdown ---- */
      .np-dropdown {
        position: absolute;
        top: calc(100% + 16px);
        left: -16px;
        background: #0f0f0f;
        border: 1px solid var(--np-accent);
        border-top: 2px solid var(--np-accent);
        min-width: 200px;
        z-index: 200;
        animation: dropIn 0.15s ease;
      }

      @keyframes dropIn {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .np-dropdown-item {
        display: block;
        padding: 12px 20px;
        font-size: 14px;
        color: var(--np-gray);
        text-decoration: none;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        border-bottom: 1px solid #1a1a1a;
        transition: all 0.15s;

        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background: #1a1a1a;
          color: var(--np-accent);
          padding-left: 28px;
        }
      }

      /* CTA */
      .np-cta-btn {
        background: var(--np-accent);
        color: var(--np-black);
        font-family: var(--font-mono);
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 2.6px;
        text-transform: uppercase;
        padding: 10px 25px;
        border: none;
        cursor: pointer;
        transition: opacity 0.2s;
        &:hover {
          opacity: 0.85;
        }
      }

      /* Overlay para cerrar dropdown */
      .np-overlay {
        position: fixed;
        inset: 0;
        z-index: 50;
      }
    `,
  ],
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);
  activeMenu = signal<string | null>(null);

  navItems: NavItem[] = [
    {
      label: 'Salas',
      href: '#salas',
      submenu: [
        { label: 'Sala A — Premium', href: '#salas' },
        { label: 'Sala B — Pro', href: '#salas' },
        { label: 'Sala C — Estándar', href: '#salas' },
      ],
    },
    {
      label: 'Equipo',
      href: '#equipo',
      submenu: [
        { label: 'Percusión', href: '#equipo' },
        { label: 'Amplificación', href: '#equipo' },
        { label: 'Mezcla', href: '#equipo' },
      ],
    },
    { label: 'Tarifas', href: '#tarifas' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ];

  // Evento: mouseenter — despliega el submenú
  onHover(label: string): void {
    const item = this.navItems.find((n) => n.label === label);
    if (item?.submenu) {
      this.activeMenu.set(label);
    }
  }

  // Evento: mouseleave — cierra el submenú
  onLeave(): void {
    this.activeMenu.set(null);
  }

  // Evento: click — toggle para items con submenu (touch-friendly)
  onClickItem(label: string): void {
    const item = this.navItems.find((n) => n.label === label);
    if (!item?.submenu) return;
    this.activeMenu.update((cur) => (cur === label ? null : label));
  }

  onReservar(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById('reserva');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
