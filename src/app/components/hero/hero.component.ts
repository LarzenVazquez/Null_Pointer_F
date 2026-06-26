import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { NgIf, isPlatformBrowser } from '@angular/common';
import {
  EventoCalendarioService,
  EventoCalendario,
} from '../../services/evento-calendario.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      *ngIf="evento?.banner"
      class="np-event-banner"
      [style.background]="evento.accentColor"
    >
      <span>{{ evento.banner }}</span>
      <button class="np-event-close" (click)="cerrarBanner()">✕</button>
    </div>

    <section class="np-hero" [style.background]="evento.bgColor">
      <div class="np-hero-bg-text">NP</div>

      <div
        *ngIf="evento?.emoji"
        class="np-event-badge"
        [style.border-color]="evento.accentColor"
      >
        <span>{{ evento.emoji }}</span>
        <span [style.color]="evento.accentColor">{{ evento.nombre }}</span>
      </div>

      <div class="np-hero-eyebrow">// Queretaro, Mexico</div>
      <h1>
        Donde el<br />
        sonido
        <span class="glitch" [style.color]="evento.accentColor">importa</span>.
      </h1>
      <p class="np-hero-sub">
        Salas de ensayo profesionales con acustica de estudio.
      </p>
      <div class="np-hero-actions">
        <button
          class="btn-primary"
          [style.background]="evento.accentColor"
          [style.color]="evento.tipo !== 'default' ? '#fff' : 'var(--np-black)'"
        >
          → Reservar sala
        </button>
        <button class="btn-secondary">Ver salas</button>
      </div>
      <div class="np-hero-stats">
        <div class="np-stat">
          <div class="np-stat-val">3</div>
          <div class="np-stat-lbl">Salas disponibles</div>
        </div>
        <div class="np-stat">
          <div class="np-stat-val">24h</div>
          <div class="np-stat-lbl">Acceso</div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* ---- Banner de evento ---- */
      .np-event-banner {
        width: 100%;
        padding: 10px 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1.5px;
        color: #fff;
        animation: slideDown 0.4s ease;
      }

      @keyframes slideDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .np-event-close {
        background: rgba(0, 0, 0, 0.2);
        border: none;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        padding: 4px 10px;
        font-family: var(--font-mono);
        &:hover {
          background: rgba(0, 0, 0, 0.4);
        }
      }

      /* ---- Badge de evento ---- */
      .np-event-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid;
        padding: 6px 14px;
        margin-bottom: 18px;
        font-size: 13px;
        letter-spacing: 2px;
        text-transform: uppercase;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }

      /* ---- Hero ---- */
      .np-hero {
        padding: 70px 42px 56px;
        border-bottom: 1px solid #222;
        position: relative;
        overflow: hidden;
        transition: background 0.6s ease;
      }

      .np-hero-bg-text {
        position: absolute;
        right: -17.5px;
        top: 17.5px;
        font-size: 158px;
        font-weight: 900;
        color: #ffffff06;
        letter-spacing: -7px;
        pointer-events: none;
        line-height: 1;
        user-select: none;
      }

      .np-hero-eyebrow {
        font-size: 16px;
        letter-spacing: 5.25px;
        color: var(--np-accent);
        text-transform: uppercase;
        margin-bottom: 21px;
      }

      h1 {
        font-size: 63px;
        font-weight: 700;
        line-height: 1.05;
        letter-spacing: -1.75px;
        color: var(--np-white);
        margin-bottom: 14px;
      }

      .np-hero-sub {
        font-size: 19px;
        color: var(--np-gray);
        max-width: 560px;
        line-height: 1.6;
        margin-bottom: 35px;
        letter-spacing: 0.8px;
      }

      .np-hero-actions {
        display: flex;
        gap: 17.5px;
        align-items: center;
      }

      .btn-primary {
        font-family: var(--font-mono);
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 2.6px;
        text-transform: uppercase;
        padding: 17.5px 35px;
        border: none;
        cursor: pointer;
        transition:
          background 0.4s,
          color 0.4s;
      }

      .btn-secondary {
        background: transparent;
        color: var(--np-white);
        font-family: var(--font-mono);
        font-size: 16px;
        letter-spacing: 1.75px;
        text-transform: uppercase;
        padding: 17.5px 35px;
        border: 1px solid #333;
        cursor: pointer;
      }

      .np-hero-stats {
        display: flex;
        gap: 42px;
        margin-top: 35px;
        padding-top: 35px;
        border-top: 1px solid #1e1e1e;
      }

      .np-stat-val {
        font-size: 35px;
        font-weight: 700;
        color: var(--np-white);
      }

      .np-stat-lbl {
        font-size: 16px;
        color: var(--np-gray);
        letter-spacing: 1.75px;
        text-transform: uppercase;
        margin-top: 3.5px;
      }
    `,
  ],
})
export class HeroComponent implements OnInit {
  private eventoService = inject(EventoCalendarioService);
  private platformId = inject(PLATFORM_ID);

  evento!: EventoCalendario;
  bannerVisible = true;

  ngOnInit(): void {
    // Práctica 6: detecta el evento basado en la fecha actual del sistema
    this.evento = this.eventoService.getEventoActivo();

    // Solo se escucha la simulación si estamos ejecutándonos en el Navegador
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('np:cambiar-evento', (e: Event) => {
        const custom = e as CustomEvent;
        this.evento = { ...custom.detail };
      });
    }
  }

  cerrarBanner(): void {
    this.evento = { ...this.evento, banner: '' };
  }
}
