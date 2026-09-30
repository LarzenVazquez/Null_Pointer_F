import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WearableService } from '@core/services/wearable.service';
import { mensajeDeError } from '@core/utils/http-error.util';
import { TipoNotificacion } from '@models/wearable.model';

interface TipoAviso {
  tipo: TipoNotificacion;
  icono: string;
  etiqueta: string;
}

@Component({
  selector: 'app-mi-reloj',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Mi reloj</h1>
        <p class="panel-subtitle">
          Vincula tu smartwatch Wear OS para recibir avisos de tus reservas y
          salas favoritas.
        </p>
      </div>
    </div>

    <!-- ── Vincular ── -->
    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Vincular un reloj</div>

      <ol class="pasos">
        <li>Abre <strong>Null Pointer Wear</strong> en tu reloj.</li>
        <li>Aparecerá un código de 6 dígitos. Escríbelo aquí.</li>
      </ol>

      <form class="vincular-row" (submit)="vincular($event)">
        <input
          class="codigo-input"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="7"
          placeholder="000 000"
          aria-label="Código del reloj"
          [ngModel]="codigo()"
          (ngModelChange)="onCodigo($event)"
          name="codigo"
        />
        <button
          type="submit"
          class="submit-btn"
          [disabled]="codigoLimpio().length !== 6 || vinculando()"
        >
          {{ vinculando() ? 'Vinculando...' : 'Vincular' }}
        </button>
      </form>

      @if (mensajeOk()) {
        <div class="msg-ok">✓ {{ mensajeOk() }}</div>
      }
      @if (error()) {
        <div class="msg-error">{{ error() }}</div>
      }
    </div>

    <!-- ── Mis relojes ── -->
    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Mis relojes</div>

      @if (wear.dispositivos().length) {
        <div class="relojes">
          @for (d of wear.dispositivos(); track d.id) {
            <div class="reloj">
              <div class="reloj-icono">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="6" y="6" width="12" height="12" rx="3" />
                  <path d="M9 6V3h6v3M9 18v3h6v-3M18 10.5h1.5v3H18" />
                </svg>
              </div>
              <div class="reloj-info">
                <div class="reloj-nombre">{{ d.nombre }}</div>
                <div class="reloj-meta">{{ d.modelo || 'Wear OS' }}</div>
                <div class="reloj-meta">
                  Vinculado {{ d.vinculadoEn | date: 'd MMM y, HH:mm' }}
                  @if (d.ultimoAcceso) {
                    · activo {{ d.ultimoAcceso | date: 'd MMM, HH:mm' }}
                  }
                </div>
              </div>
              <span class="badge" [class.badge-on]="d.pushHabilitado">
                {{
                  d.pushHabilitado ? 'Push activo' : 'Sincronización periódica'
                }}
              </span>
              <button
                class="btn-desvincular"
                (click)="desvincular(d.id, d.nombre)"
              >
                Desvincular
              </button>
            </div>
          }
        </div>
      } @else {
        <p class="panel-subtitle">Aún no tienes relojes vinculados.</p>
      }
    </div>

    <!-- ── Probar avisos ── -->
    @if (wear.dispositivos().length) {
      <div class="panel-card">
        <div class="panel-card-title"><span>//</span> Probar avisos</div>
        <p class="panel-subtitle" style="margin-bottom:14px">
          Envía un aviso de ejemplo para ver cada tarjeta en tu reloj.
        </p>
        <div class="tipos">
          @for (t of tipos; track t.tipo) {
            <button
              class="tipo-btn"
              [disabled]="enviando()"
              (click)="probar(t.tipo)"
            >
              <span class="tipo-icono">{{ t.icono }}</span
              >{{ t.etiqueta }}
            </button>
          }
        </div>
      </div>
    }

    <!-- ── Últimos avisos ── -->
    <div class="panel-card">
      <div class="panel-card-title avisos-head">
        <span><span>//</span> Últimos avisos</span>
        @if (wear.noLeidas()) {
          <button class="link-btn" (click)="wear.marcarTodasLeidas()">
            Marcar {{ wear.noLeidas() }} como leídos
          </button>
        }
      </div>

      @for (n of wear.notificaciones(); track n.id) {
        <div class="aviso" [class.leido]="n.leida">
          <span class="tipo-icono">{{ iconoDe(n.tipo) }}</span>
          <div>
            <div class="aviso-titulo">{{ n.titulo }}</div>
            <div class="aviso-cuerpo">{{ n.cuerpo }}</div>
            <div class="aviso-hora">
              {{ n.creadoEn | date: 'd MMM, HH:mm' }}
            </div>
          </div>
        </div>
      } @empty {
        <p class="panel-subtitle">Todavía no hay avisos.</p>
      }
    </div>
  `,
  styles: [
    `
      .pasos {
        color: var(--np-light);
        font-size: 13.5px;
        line-height: 1.8;
        margin: 0 0 18px;
        padding-left: 18px;
      }
      .vincular-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
      }
      .codigo-input {
        font-family: var(--font-mono);
        font-size: 28px;
        letter-spacing: 6px;
        text-align: center;
        width: 220px;
        max-width: 100%;
        padding: 10px 12px;
        background: var(--np-black);
        color: var(--np-accent);
        border: 1px solid #333;
        outline: none;
      }
      .codigo-input:focus {
        border-color: var(--np-accent);
      }
      .vincular-row .submit-btn {
        width: auto;
        margin: 0;
      }
      .msg-ok {
        color: var(--np-accent);
        font-size: 13px;
        margin-top: 14px;
      }
      .msg-error {
        color: var(--np-accent2);
        font-size: 13px;
        margin-top: 14px;
      }

      .relojes {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .reloj {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        padding: 14px;
        border: 1px solid #222;
        background: var(--np-black);
      }
      .reloj-icono {
        color: var(--np-accent);
        display: flex;
      }
      .reloj-info {
        flex: 1;
        min-width: 180px;
      }
      .reloj-nombre {
        color: var(--np-white);
        font-weight: 700;
      }
      .reloj-meta {
        color: var(--np-gray);
        font-size: 12px;
        margin-top: 2px;
      }
      .badge {
        font-size: 11px;
        padding: 4px 8px;
        border: 1px solid #444;
        color: var(--np-gray);
      }
      .badge-on {
        border-color: var(--np-accent);
        color: var(--np-accent);
      }
      .btn-desvincular {
        background: transparent;
        border: 1px solid var(--np-accent2);
        color: var(--np-accent2);
        padding: 7px 12px;
        cursor: pointer;
        font-size: 12.5px;
      }

      .tipos {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        gap: 10px;
      }
      .tipo-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        cursor: pointer;
        background: var(--np-black);
        color: var(--np-white);
        border: 1px solid #2a2a2a;
        text-align: left;
      }
      .tipo-btn:hover:not(:disabled) {
        border-color: var(--np-accent);
      }
      .tipo-icono {
        display: inline-grid;
        place-items: center;
        width: 30px;
        height: 30px;
        flex: none;
        border-radius: 50%;
        background: var(--np-accent);
        color: var(--np-black);
        font-weight: 700;
      }

      .avisos-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .link-btn {
        background: none;
        border: none;
        color: var(--np-accent);
        cursor: pointer;
        font-size: 12px;
      }
      .aviso {
        display: flex;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #1f1f1f;
      }
      .aviso:last-child {
        border-bottom: none;
      }
      .aviso.leido {
        opacity: 0.55;
      }
      .aviso-titulo {
        color: var(--np-white);
        font-weight: 700;
        font-size: 14px;
      }
      .aviso-cuerpo {
        color: var(--np-light);
        font-size: 13px;
        margin-top: 2px;
      }
      .aviso-hora {
        color: var(--np-gray);
        font-size: 11.5px;
        margin-top: 4px;
      }
    `,
  ],
})
export class MiRelojComponent implements OnInit, OnDestroy {
  wear = inject(WearableService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private refrescos: ReturnType<typeof setTimeout>[] = [];

  codigo = signal('');
  vinculando = signal(false);
  enviando = signal(false);
  mensajeOk = signal('');
  error = signal('');

  readonly tipos: TipoAviso[] = [
    { tipo: 'reserva_confirmada', icono: '✓', etiqueta: 'Reserva confirmada' },
    { tipo: 'reserva_cancelada', icono: '✕', etiqueta: 'Reserva cancelada' },
    { tipo: 'recordatorio_reserva', icono: '◷', etiqueta: 'Recordatorio' },
    {
      tipo: 'cambio_sala_favorita',
      icono: '★',
      etiqueta: 'Cambio en favorita',
    },
  ];

  ngOnInit(): void {
    // En SSR no hay token (vive en localStorage), así que solo se consulta en el navegador.
    if (!this.isBrowser) return;
    this.refrescar();
  }

  ngOnDestroy(): void {
    this.refrescos.forEach(clearTimeout);
  }

  codigoLimpio(): string {
    return this.codigo().replace(/\D/g, '');
  }

  /** Formatea mientras se escribe: "123456" -> "123 456". */
  onCodigo(valor: string): void {
    const d = valor.replace(/\D/g, '').slice(0, 6);
    this.codigo.set(d.length > 3 ? `${d.slice(0, 3)} ${d.slice(3)}` : d);
  }

  iconoDe(tipo: TipoNotificacion): string {
    return this.tipos.find((t) => t.tipo === tipo)?.icono ?? '•';
  }

  async vincular(e: Event): Promise<void> {
    e.preventDefault();
    this.error.set('');
    this.mensajeOk.set('');
    this.vinculando.set(true);
    try {
      const mensaje = await this.wear.confirmarCodigo(this.codigoLimpio());
      this.mensajeOk.set(mensaje);
      this.codigo.set('');
      // El reloj consulta cada ~5 s; refrescamos la lista unas cuantas veces.
      [4000, 8000, 15000].forEach((ms) =>
        this.refrescos.push(
          setTimeout(() => this.wear.cargarDispositivos().catch(() => {}), ms),
        ),
      );
    } catch (err) {
      this.error.set(mensajeDeError(err, 'No se pudo vincular el reloj.'));
    } finally {
      this.vinculando.set(false);
    }
  }

  async desvincular(id: number, nombre: string): Promise<void> {
    if (!confirm(`¿Desvincular "${nombre}"? Dejará de recibir avisos.`)) return;
    try {
      await this.wear.desvincular(id);
    } catch (err) {
      this.error.set(mensajeDeError(err, 'No se pudo desvincular.'));
    }
  }

  async probar(tipo: TipoNotificacion): Promise<void> {
    this.enviando.set(true);
    this.error.set('');
    try {
      await this.wear.enviarPrueba(tipo);
      this.mensajeOk.set(
        'Aviso enviado. Si tu reloj no tiene push, aparecerá al sincronizar.',
      );
    } catch (err) {
      this.error.set(
        mensajeDeError(err, 'No se pudo enviar el aviso de prueba.'),
      );
    } finally {
      this.enviando.set(false);
    }
  }

  private refrescar(): void {
    this.wear
      .cargarDispositivos()
      .catch((err) => this.error.set(mensajeDeError(err)));
    this.wear.cargarNotificaciones().catch(() => {});
  }
}
