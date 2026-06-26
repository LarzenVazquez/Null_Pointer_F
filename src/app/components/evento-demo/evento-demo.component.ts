import { Component, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  EventoCalendarioService,
  EventoCalendario,
  EventoTipo,
} from '../../services/evento-calendario.service';

interface FechaDemo {
  label: string;
  fecha: Date;
  tipo: EventoTipo;
}

@Component({
  selector: 'app-evento-demo',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="demo-bar">
      <span class="demo-label"> Simular fecha:</span>
      <div class="demo-btns">
        <button
          *ngFor="let f of fechas"
          class="demo-btn"
          [class.active]="fechaActiva() === f.tipo"
          (click)="simular(f)"
        >
          {{ f.label }}
        </button>
      </div>
      <span class="demo-current">
        Evento activo:
        <strong>{{ eventoActivo().nombre || 'Sin evento' }}</strong>
        {{ eventoActivo().emoji }}
      </span>
    </div>
  `,
  styles: [
    `
      .demo-bar {
        background: #111;
        border-bottom: 1px solid #2a2a2a;
        border-top: 2px dashed #333;
        padding: 10px 42px;
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
        font-family: var(--font-mono);
        font-size: 13px;
      }

      .demo-label {
        color: var(--np-accent);
        letter-spacing: 1.5px;
        white-space: nowrap;
      }

      .demo-btns {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .demo-btn {
        background: #1a1a1a;
        border: 1px solid #333;
        color: var(--np-gray);
        font-family: var(--font-mono);
        font-size: 12px;
        padding: 5px 12px;
        cursor: pointer;
        letter-spacing: 1px;
        transition: all 0.15s;

        &:hover {
          border-color: var(--np-accent);
          color: var(--np-white);
        }
        &.active {
          background: var(--np-accent);
          color: var(--np-black);
          border-color: var(--np-accent);
          font-weight: 700;
        }
      }

      .demo-current {
        margin-left: auto;
        color: var(--np-gray);
        strong {
          color: var(--np-white);
        }
      }
    `,
  ],
})
export class EventoDemoComponent {
  private svc = inject(EventoCalendarioService);

  eventoActivo = signal<EventoCalendario>(this.svc.getEventoActivo());
  fechaActiva = signal<EventoTipo>('default');

  fechas: FechaDemo[] = [
    { label: 'Hoy', fecha: new Date(), tipo: 'default' },
    {
      label: 'Navidad',
      fecha: new Date(new Date().getFullYear(), 11, 25),
      tipo: 'navidad',
    },
    {
      label: 'Año Nuevo',
      fecha: new Date(new Date().getFullYear(), 0, 1),
      tipo: 'anio_nuevo',
    },
    {
      label: 'Muertos',
      fecha: new Date(new Date().getFullYear(), 10, 2),
      tipo: 'dia_muertos',
    },
    {
      label: 'Halloween',
      fecha: new Date(new Date().getFullYear(), 9, 31),
      tipo: 'halloween',
    },
    {
      label: 'S.Valentín',
      fecha: new Date(new Date().getFullYear(), 1, 14),
      tipo: 'san_valentin',
    },
  ];

  simular(f: FechaDemo): void {
    this.fechaActiva.set(f.tipo);
    const evento = this.svc.getEventoActivo(f.fecha);
    this.eventoActivo.set(evento);
    // Comunicar al HeroComponent vía evento en el DOM
    document.dispatchEvent(
      new CustomEvent('np:cambiar-evento', { detail: evento }),
    );
  }
}
