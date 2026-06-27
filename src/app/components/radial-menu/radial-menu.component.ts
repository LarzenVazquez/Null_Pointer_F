import { Component, signal, HostListener } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  href: string;
  angle: number;
}

@Component({
  selector: 'app-radial-menu',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <button
      class="radial-trigger"
      [class.open]="isOpen()"
      (click)="toggle($event)"
      aria-label="Menú de navegación"
    >
      <span class="trigger-icon">{{ isOpen() ? '✕' : '⊕' }}</span>
      <span class="trigger-label" *ngIf="!isOpen()">MENU</span>
    </button>

    <div class="radial-overlay" *ngIf="isOpen()" (click)="close()"></div>

    <div class="radial-ring" [class.open]="isOpen()">
      <a
        *ngFor="let item of menuItems; let i = index"
        class="radial-item"
        [href]="item.href"
        [class.visible]="isOpen()"
        [style.--angle]="item.angle + 'deg'"
        [style.transition-delay]="i * 45 + 'ms'"
        (pointerenter)="hoveredItem.set(item.label)"
        (pointerleave)="hoveredItem.set('')"
        (click)="close()"
      >
        <span class="ri-icon">{{ item.icon }}</span>
      </a>
    </div>

    <div class="radial-tooltip" *ngIf="isOpen() && hoveredItem()">
      {{ hoveredItem() }}
    </div>
  `,
})
export class RadialMenuComponent {
  isOpen = signal(false);
  hoveredItem = signal('');

  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: '⌂', href: '#', angle: 270 },
    { label: 'Salas', icon: '🎸', href: '#salas', angle: 225 },
    { label: 'Reservar', icon: '📅', href: '#reserva', angle: 180 },
    { label: 'Equipo', icon: '🥁', href: '#equipo', angle: 135 },
    { label: 'Contacto', icon: '💬', href: '#contacto', angle: 315 },
  ];

  toggle(e: Event): void {
    e.stopPropagation();
    this.isOpen.update((v) => !v);
    if (!this.isOpen()) this.hoveredItem.set('');
  }

  close(): void {
    this.isOpen.set(false);
    this.hoveredItem.set('');
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.close();
  }
}
