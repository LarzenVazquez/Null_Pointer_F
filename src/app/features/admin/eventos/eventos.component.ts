import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { EventoCalendarioService, EventoTipo } from '@services/evento-calendario.service';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Eventos estacionales</h1>
        <p class="panel-subtitle">
          Previsualiza cómo se ve el sitio con cada tema de temporada. El tema real se activa
          solo, según la fecha del sistema.
        </p>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Tema activo ahora mismo</div>
      <div class="evento-actual">
        <span class="evento-emoji">{{ eventoService.activeEvent().emoji || '—' }}</span>
        <div>
          <div class="evento-nombre">{{ eventoService.activeEvent().nombre || 'Sin evento (tema por defecto)' }}</div>
          <div class="evento-desc">{{ eventoService.activeEvent().descripcion }}</div>
        </div>
      </div>
    </div>

    <div class="eventos-grid">
      <div class="evento-card" *ngFor="let ev of eventos">
        <div class="evento-emoji-lg">{{ ev.emoji }}</div>
        <div class="evento-card-nombre">{{ ev.nombre }}</div>
        <div class="evento-fechas">
          {{ ev.startDay }}/{{ ev.startMonth }} — {{ ev.endDay }}/{{ ev.endMonth }}
        </div>
        <p class="evento-banner">{{ ev.banner }}</p>
        <button class="submit-btn evento-btn" (click)="previsualizar(ev.tipo)">
          Previsualizar
        </button>
      </div>
    </div>

    <div class="reset-row">
      <button class="btn-back" (click)="restaurar()">← Volver a la fecha real</button>
    </div>
  `,
  styles: [`
    .evento-actual { display: flex; align-items: center; gap: 16px; }
    .evento-emoji { font-size: 36px; }
    .evento-nombre { color: var(--np-white); font-weight: 700; font-size: 16px; }
    .evento-desc { color: var(--np-gray); font-size: 13px; margin-top: 4px; }

    .eventos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }
    .evento-card {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 20px;
      text-align: center;
    }
    .evento-emoji-lg { font-size: 32px; margin-bottom: 10px; }
    .evento-card-nombre { color: var(--np-white); font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .evento-fechas { color: var(--np-gray); font-size: 11.5px; margin-bottom: 12px; }
    .evento-banner { color: var(--np-gray); font-size: 12px; line-height: 1.5; margin-bottom: 16px; min-height: 36px; }
    .evento-btn { width: 100%; }
    .reset-row { margin-top: 8px; }
  `],
})
export class AdminEventosComponent {
  eventoService = inject(EventoCalendarioService);

  eventos = this.eventoService.getTodosLosEventos();

  previsualizar(tipo: EventoTipo): void {
    this.eventoService.previewEvento(tipo);
  }

  restaurar(): void {
    this.eventoService.resetDate();
  }
}
