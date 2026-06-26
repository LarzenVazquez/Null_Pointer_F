import {
  Component,
  signal,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  href: string;
  angle: number; // grados desde el centro
}

@Component({
  selector: 'app-radial-menu',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  template: `
    <!-- Botón disparador (fijo en pantalla) -->
    <button
      class="radial-trigger"
      [class.open]="isOpen()"
      (click)="toggle($event)"
      (pointerenter)="onTriggerHover(true)"
      (pointerleave)="onTriggerHover(false)"
      aria-label="Menú de navegación"
    >
      <span class="trigger-icon">{{ isOpen() ? '✕' : '⊕' }}</span>
      <span class="trigger-label" *ngIf="!isOpen()">MENU</span>
    </button>

    <!-- Overlay oscuro -->
    <div
      class="radial-overlay"
      *ngIf="isOpen()"
      (click)="close()"
    ></div>

    <!-- Items radiales -->
    <div class="radial-ring" [class.open]="isOpen()">
      <a
        *ngFor="let item of menuItems; let i = index"
        class="radial-item"
        [href]="item.href"
        [class.visible]="isOpen()"
        [style.--angle]="item.angle + 'deg'"
        [style.transition-delay]="(i * 45) + 'ms'"
        (pointerenter)="hoveredItem.set(item.label)"
        (pointerleave)="hoveredItem.set('')"
        (click)="close()"
      >
        <span class="ri-icon">{{ item.icon }}</span>
      </a>
    </div>

    <!-- Tooltip del item hover -->
    <div class="radial-tooltip" *ngIf="isOpen() && hoveredItem()">
      {{ hoveredItem() }}
    </div>
  `,
  styles: [`
    /* ---- Trigger ---- */
    .radial-trigger {
      position: fixed;
      bottom: 36px;
      right: 36px;
      z-index: 2000;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--np-accent);
      color: var(--np-black);
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 1px;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      box-shadow: 0 0 0 0 var(--np-accent);
      transition: transform 0.25s, box-shadow 0.25s, background 0.2s;

      &:hover, &.open {
        transform: scale(1.12);
        box-shadow: 0 0 20px 4px color-mix(in srgb, var(--np-accent) 40%, transparent);
      }

      &.open {
        background: #ff4d4d;
        color: #fff;
      }
    }

    .trigger-icon {
      font-size: 22px;
      line-height: 1;
    }

    .trigger-label {
      font-size: 9px;
      letter-spacing: 2px;
    }

    /* ---- Overlay ---- */
    .radial-overlay {
      position: fixed;
      inset: 0;
      z-index: 1500;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(2px);
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ---- Ring & Items ---- */
    .radial-ring {
      position: fixed;
      bottom: 68px;   /* centro del trigger */
      right: 68px;
      width: 0;
      height: 0;
      z-index: 1600;
      pointer-events: none;

      &.open { pointer-events: auto; }
    }

    .radial-item {
      position: absolute;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--np-surface);
      border: 2px solid var(--np-accent);
      color: var(--np-accent);
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      cursor: pointer;
      opacity: 0;
      transform: translate(0, 0) scale(0.4);
      transition:
        opacity 0.3s ease,
        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      /* Posición radial: mover 130px en la dirección del ángulo */
      --r: 130px;
      --x: calc(cos(var(--angle)) * var(--r) * -1);
      --y: calc(sin(var(--angle)) * var(--r) * -1);

      &.visible {
        opacity: 1;
        transform: translate(var(--x), var(--y)) scale(1);
      }

      &:hover {
        background: var(--np-accent);
        color: var(--np-black);
        border-color: var(--np-accent);
        transform: translate(var(--x), var(--y)) scale(1.18);
      }
    }

    /* ---- Tooltip ---- */
    .radial-tooltip {
      position: fixed;
      bottom: 150px;
      right: 36px;
      z-index: 1700;
      background: var(--np-surface);
      border: 1px solid var(--np-accent);
      color: var(--np-accent);
      font-family: var(--font-mono);
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 14px;
      pointer-events: none;
      animation: fadeIn 0.15s ease;
    }
  `],
})
export class RadialMenuComponent {
  isOpen   = signal(false);
  hoveredItem = signal('');

  menuItems: MenuItem[] = [
    { label: 'Inicio',    icon: '⌂', href: '#',        angle: 270 }, // arriba
    { label: 'Salas',     icon: '🎸', href: '#salas',   angle: 225 }, // arr-izq
    { label: 'Reservar',  icon: '📅', href: '#reserva', angle: 180 }, // izquierda
    { label: 'Equipo',    icon: '🥁', href: '#equipo',  angle: 135 }, // abj-izq
    { label: 'Contacto',  icon: '💬', href: '#contacto',angle: 315 }, // arr-der
  ];

  toggle(e: Event): void {
    e.stopPropagation();
    this.isOpen.update(v => !v);
    if (!this.isOpen()) this.hoveredItem.set('');
  }

  close(): void {
    this.isOpen.set(false);
    this.hoveredItem.set('');
  }

  onTriggerHover(entering: boolean): void {
    // efecto visual extra al pasar el puntero — handled via CSS
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.close(); }
}
