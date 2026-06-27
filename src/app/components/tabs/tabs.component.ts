import { Component, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

type TabId = 'equipo' | 'tarifas' | 'normas';

interface Tab {
  id: TabId;
  label: string;
}

interface EquipItem {
  category: string;
  name: string;
  desc: string;
}

interface Tarifa {
  label: string;
  price: string;
  accent?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <section class="np-section" id="equipo">
      <div class="np-tabs">
        <div
          *ngFor="let tab of tabs"
          class="np-tab"
          [class.active]="activeTab() === tab.id"
          (click)="switchTab(tab.id)"
        >
          {{ tab.label }}
        </div>
      </div>

      <div *ngIf="activeTab() === 'equipo'" class="np-equipo-grid">
        <div *ngFor="let item of equipItems" class="np-equip-item">
          <div class="np-equip-cat">{{ item.category }}</div>
          <div class="np-equip-name">{{ item.name }}</div>
          <div class="np-equip-desc">{{ item.desc }}</div>
        </div>
      </div>

      <div *ngIf="activeTab() === 'tarifas'" class="np-tarifas">
        <div
          *ngFor="let t of tarifas"
          class="tarifa-row"
          [class.accent]="t.accent"
        >
          <span>{{ t.label }}</span>
          <span class="tarifa-price">{{ t.price }}</span>
        </div>
      </div>

      <div *ngIf="activeTab() === 'normas'" class="np-normas">
        <div *ngFor="let norma of normas" class="norma-item">→ {{ norma }}</div>
      </div>
    </section>
  `,
})
export class TabsComponent {
  activeTab = signal<TabId>('equipo');

  tabs: Tab[] = [
    { id: 'equipo', label: 'Equipo incluido' },
    { id: 'tarifas', label: 'Tarifas' },
    { id: 'normas', label: 'Normas' },
  ];

  equipItems: EquipItem[] = [
    {
      category: 'Percusion',
      name: 'Pearl Export Pro',
      desc: 'Kit completo con platillos Zildjian A Series. Sala A.',
    },
    {
      category: 'Percusion',
      name: 'Mapex Saturn',
      desc: 'Kit profesional con hardware Saturn. Sala B.',
    },
    {
      category: 'Amplificacion',
      name: 'Marshall DSL40CR',
      desc: 'Combo de guitarra 40W. Disponible en todas las salas.',
    },
    {
      category: 'Bajo',
      name: 'Ampeg BA-210',
      desc: 'Combo de bajo 450W. Salas A y B.',
    },
    {
      category: 'Mezcla',
      name: 'Behringer X32',
      desc: 'Mesa digital 32 canales con efectos. Sala B.',
    },
  ];

  tarifas: Tarifa[] = [
    { label: 'Sala A — por hora', price: '$150 MXN' },
    { label: 'Sala B — por hora', price: '$110 MXN' },
    { label: 'Sala C — por hora', price: '$80 MXN' },
    { label: 'Paquete jornada (8h)', price: '$500 MXN', accent: true },
  ];

  normas: string[] = [
    'Presentar identificacion oficial al ingresar',
    'Respeto al horario reservado. Sin tolerancia.',
    'Prohibido alimentos y bebidas en las salas',
    'El equipo dañado se carga al responsable',
    'Cancelaciones con 24h de anticipacion',
  ];

  switchTab(id: TabId): void {
    this.activeTab.set(id);
  }
}
