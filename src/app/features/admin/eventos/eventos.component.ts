import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  EventoCalendarioService,
  EventoTipo,
} from '@services/evento-calendario.service';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Eventos estacionales</h1>
        <p class="panel-subtitle">
          Previsualiza localmente o fija un tema globalmente en el servidor para
          todos los usuarios.
        </p>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title">
        <span>//</span> Tema activo en la plataforma
      </div>
      <div class="evento-actual">
        <span class="evento-emoji">{{
          eventoService.activeEvent().emoji || '-'
        }}</span>
        <div>
          <div class="evento-nombre">
            {{
              eventoService.activeEvent().nombre ||
                'Sin evento (tema por defecto)'
            }}
          </div>
          <div class="evento-desc">
            {{ eventoService.activeEvent().descripcion }}
          </div>
        </div>
      </div>
    </div>

    <div class="eventos-grid">
      <div class="evento-card" *ngFor="let ev of eventos()">
        <div class="evento-emoji-lg">{{ ev.emoji }}</div>
        <div class="evento-card-nombre">{{ ev.nombre }}</div>
        <div class="evento-fechas">
          {{ ev.startDay }}/{{ ev.startMonth }} — {{ ev.endDay }}/{{
            ev.endMonth
          }}
        </div>
        <p class="evento-banner">{{ ev.banner }}</p>

        <div class="evento-actions">
          <button
            class="submit-btn evento-btn secondary-btn"
            (click)="previsualizar(ev.tipo)"
          >
            Previsualizar
          </button>
          <button class="submit-btn evento-btn" (click)="fijar(ev.tipo)">
            Fijar Global
          </button>
        </div>
      </div>
    </div>

    <div class="reset-row">
      <button class="btn-back" (click)="restaurar()">
        ← Quitar evento fijado y volver a modo automático
      </button>
    </div>
  `,
  styles: [
    `
      .evento-actual {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .evento-emoji {
        font-size: 36px;
      }
      .evento-nombre {
        color: var(--np-white);
        font-weight: 700;
        font-size: 16px;
      }
      .evento-desc {
        color: var(--np-gray);
        font-size: 13px;
        margin-top: 4px;
      }

      .eventos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        margin: 24px 0;
      }
      .evento-card {
        background: var(--np-surface);
        border: 1px solid #222;
        padding: 20px;
        text-align: center;
      }
      .evento-emoji-lg {
        font-size: 32px;
        margin-bottom: 10px;
      }
      .evento-card-nombre {
        color: var(--np-white);
        font-weight: 700;
        font-size: 15px;
        margin-bottom: 4px;
      }
      .evento-fechas {
        color: var(--np-gray);
        font-size: 11.5px;
        margin-bottom: 12px;
      }
      .evento-banner {
        color: var(--np-gray);
        font-size: 12px;
        line-height: 1.5;
        margin-bottom: 16px;
        min-height: 36px;
      }
      .evento-actions {
        display: flex;
        gap: 8px;
      }
      .evento-btn {
        width: 100%;
        padding: 8px;
        font-size: 12px;
      }
      .secondary-btn {
        background: transparent;
        border: 1px solid var(--np-accent, #c8ff00);
        color: var(--np-accent, #c8ff00);
      }
      .reset-row {
        margin-top: 8px;
      }
    `,
  ],
})
export class AdminEventosComponent {
  eventoService = inject(EventoCalendarioService);
  eventos = this.eventoService.eventosDisponibles;

  previsualizar(tipo: EventoTipo): void {
    this.eventoService.previewEvento(tipo);
  }

  fijar(tipo: EventoTipo): void {
    this.eventoService.fijarEventoGlobal(tipo);
  }

  restaurar(): void {
    this.eventoService.resetDate();
  }
}
