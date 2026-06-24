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
  styles: [
    `
      .np-section {
        padding: 49px 42px;
        border-bottom: 1px solid #1a1a1a;
      }

      /* ---- Tabs ---- */
      .np-tabs {
        display: flex;
        border-bottom: 1px solid #222;
        margin-bottom: 28px;
      }

      .np-tab {
        font-family: var(--font-mono);
        font-size: 16px;
        letter-spacing: 1.75px;
        text-transform: uppercase;
        padding: 14px 28px;
        cursor: pointer;
        color: var(--np-gray);
        border-bottom: 2px solid transparent;
        transition: all 0.2s;

        &.active {
          color: var(--np-accent);
          border-bottom-color: var(--np-accent);
        }
      }

      /* ---- Equipo ---- */
      .np-equipo-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      .np-equip-item {
        background: var(--np-surface);
        border: 1px solid #222;
        padding: 17.5px;
      }

      .np-equip-cat {
        font-size: 14px;
        color: var(--np-accent);
        letter-spacing: 2.6px;
        text-transform: uppercase;
        margin-bottom: 7px;
      }

      .np-equip-name {
        font-size: 17.5px;
        color: var(--np-white);
        font-weight: 700;
        margin-bottom: 3.5px;
      }

      .np-equip-desc {
        font-size: 14px;
        color: var(--np-gray);
        line-height: 1.4;
      }

      /* ---- Tarifas ---- */
      .np-tarifas {
        font-size: 17.5px;
        color: var(--np-gray);
        line-height: 1.8;
      }

      .tarifa-row {
        display: flex;
        justify-content: space-between;
        padding: 10.5px 0;
        border-bottom: 1px solid #1e1e1e;

        &.accent {
          color: var(--np-accent);
          border-bottom: none;
        }
      }

      .tarifa-price {
        color: var(--np-white);
      }
      .tarifa-row.accent .tarifa-price {
        color: var(--np-accent);
      }

      /* ---- Normas ---- */
      .np-normas {
        color: var(--np-gray);
        font-size: 15.75px;
        line-height: 2;
        letter-spacing: 0.5px;
      }

      .norma-item::before {
        content: '→ ';
        color: var(--np-accent);
      }
    `,
  ],
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
    { label: 'Presentar identificacion oficial al ingresar' },
    { label: 'Respeto al horario reservado. Sin tolerancia.' },
    { label: 'Prohibido alimentos y bebidas en las salas' },
    { label: 'El equipo dañado se carga al responsable' },
    { label: 'Cancelaciones con 24h de anticipacion' },
  ].map((n) => n.label);

  switchTab(id: TabId): void {
    this.activeTab.set(id);
  }
}
