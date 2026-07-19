// src/app/components/evento-demo/evento-demo.component.ts
import { Component, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { NgFor, isPlatformBrowser } from '@angular/common';
import {
  EventoCalendarioService,
  EventoTipo,
} from '@services/evento-calendario.service';

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
        <strong>{{ svc.activeEvent().nombre || 'Sin evento' }}</strong>
        {{ svc.activeEvent().emoji }}
      </span>
    </div>
  `,
})
export class EventoDemoComponent {
  svc = inject(EventoCalendarioService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

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

  constructor() {
    // Cada vez que el backend confirma un nuevo evento activo, notifica
    // al resto de la app (mismo evento custom que usaba la versión mock,
    // por si algún componente externo lo escucha).
    effect(() => {
      const evento = this.svc.activeEvent();
      if (!this.isBrowser) return;
      document.dispatchEvent(
        new CustomEvent('np:cambiar-evento', { detail: evento }),
      );
    });
  }

  simular(f: FechaDemo): void {
    this.fechaActiva.set(f.tipo);
    // Dispara la consulta real a GET /api/eventos/activo?fecha=... — el
    // resultado llega de forma asíncrona y actualiza svc.activeEvent(),
    // que ya está enlazado reactivamente en el template.
    this.svc.setTestDate(f.fecha);
  }
}
