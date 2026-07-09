import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { SalasService } from '@core/services/salas.service';
import { ServiciosService } from '@core/services/servicios.service';
import { ReservaService } from '@core/services/reserva.service';
import { AuthService } from '@core/services/auth.service';
import { ServicioSeleccionado } from '@models/reserva.model';

type Paso = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-nueva-reserva',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Nueva reserva</h1>
        <p class="panel-subtitle">Reserva tu sala y agrega servicios de producción si los necesitas.</p>
      </div>
    </div>

    <div
      class="stepper"
      role="progressbar"
      [attr.aria-valuenow]="paso()"
      aria-valuemin="1"
      aria-valuemax="4"
    >
      <div
        *ngFor="let p of [1, 2, 3, 4]"
        class="step"
        [class.active]="paso() >= p"
        [class.current]="paso() === p"
      >
        <div class="step-circle">{{ p }}</div>
        <div class="step-label">
          {{ ['Sala', 'Horario', 'Servicios', 'Confirmación'][p - 1] }}
        </div>
      </div>
      <div class="step-line"></div>
    </div>

    <!-- PASO 1: SALA -->
    <div *ngIf="paso() === 1" class="paso-panel">
      <h2 class="paso-title">// 01 — Selecciona tu sala</h2>
      <div class="sala-selector-grid">
        <div
          *ngFor="let s of salas"
          class="sala-option"
          [class.selected]="salaId() === s.id"
          (click)="salaId.set(s.id)"
        >
          <div class="sala-opt-name">{{ s.name }}</div>
          <div class="sala-opt-precio">&#36;{{ s.precio }}<span>/hora</span></div>
          <div class="sala-opt-cap">{{ s.capacidad }} músicos · {{ s.m2 }}m²</div>
          <div class="sala-opt-check" *ngIf="salaId() === s.id">✓ Seleccionada</div>
        </div>
      </div>
      <div class="paso-btns">
        <button class="btn-paso" [disabled]="!salaId()" (click)="paso.set(2)">
          Continuar → Elegir horario
        </button>
      </div>
    </div>

    <!-- PASO 2: HORARIO -->
    <div *ngIf="paso() === 2" class="paso-panel">
      <h2 class="paso-title">// 02 — Fecha y horario</h2>
      <div class="form-grid">
        <div class="np-field">
          <label for="nr-fecha">Fecha</label>
          <input
            id="nr-fecha"
            type="date"
            style="color-scheme:dark"
            [(ngModel)]="fecha"
            name="fecha"
            [min]="hoy"
          />
        </div>
        <div class="np-field">
          <label for="nr-hora">Hora de inicio</label>
          <select id="nr-hora" [(ngModel)]="hora" name="hora">
            <option *ngFor="let h of horas" [value]="h">{{ h }}</option>
          </select>
        </div>
        <div class="np-field">
          <label for="nr-duracion">Duración</label>
          <select id="nr-duracion" [(ngModel)]="duracionHoras" name="duracion">
            <option [value]="1">1 hora</option>
            <option [value]="2">2 horas</option>
            <option [value]="3">3 horas</option>
            <option [value]="8">Jornada (8h)</option>
          </select>
        </div>
      </div>
      <div class="precio-preview">
        <span>Subtotal sala:</span>
        <strong>&#36;{{ precioSala() }} MXN</strong>
      </div>
      <div class="paso-btns">
        <button class="btn-back" (click)="paso.set(1)">← Volver</button>
        <button class="btn-paso" [disabled]="!fecha() || !hora()" (click)="paso.set(3)">
          Continuar → Servicios adicionales
        </button>
      </div>
    </div>

    <!-- PASO 3: SERVICIOS ADICIONALES -->
    <div *ngIf="paso() === 3" class="paso-panel">
      <h2 class="paso-title">// 03 — Servicios adicionales (opcional)</h2>

      <div class="servicios-grid">
        <div
          *ngFor="let s of servicios"
          class="servicio-card"
          [class.selected]="isSeleccionado(s.id)"
        >
          <div class="servicio-top" (click)="toggleServicio(s)">
            <div class="servicio-icon">{{ s.icono }}</div>
            <div class="servicio-info">
              <div class="servicio-nombre">{{ s.nombre }}</div>
              <div class="servicio-precio">&#36;{{ s.precio }} <span>{{ s.unidad }}</span></div>
            </div>
            <div class="servicio-check">{{ isSeleccionado(s.id) ? '✓' : '+' }}</div>
          </div>
          <p class="servicio-desc">{{ s.descripcion }}</p>

          <div class="servicio-cantidad" *ngIf="isSeleccionado(s.id) && s.requiereCantidad">
            <label [for]="'cant-' + s.id">{{ s.cantidadLabel }}</label>
            <input
              [id]="'cant-' + s.id"
              type="number"
              min="1"
              [ngModel]="getCantidad(s.id)"
              (ngModelChange)="setCantidad(s.id, $event)"
              [name]="'cant-' + s.id"
            />
          </div>
        </div>
      </div>

      <div class="precio-preview">
        <span>Subtotal servicios:</span>
        <strong>&#36;{{ precioServicios() }} MXN</strong>
      </div>

      <div class="paso-btns">
        <button class="btn-back" (click)="paso.set(2)">← Volver</button>
        <button class="btn-paso" (click)="paso.set(4)">Continuar → Confirmación</button>
      </div>
    </div>

    <!-- PASO 4: CONFIRMACIÓN -->
    <div *ngIf="paso() === 4" class="paso-panel">
      <h2 class="paso-title">// 04 — Confirma tu reserva</h2>

      <div class="np-field full" style="margin-bottom: 24px;">
        <label for="nr-notas">Notas adicionales (opcional)</label>
        <textarea
          id="nr-notas"
          rows="3"
          placeholder="Necesitas alguna configuración especial..."
          [(ngModel)]="notas"
          name="notas"
        ></textarea>
      </div>

      <div class="resumen-box">
        <div class="resumen-title">// Resumen de reserva</div>
        <div class="resumen-row">
          <span>Sala:</span><strong>{{ salaSeleccionada()?.name }}</strong>
        </div>
        <div class="resumen-row">
          <span>Fecha:</span><strong>{{ fecha() }}</strong>
        </div>
        <div class="resumen-row">
          <span>Hora:</span><strong>{{ hora() }} · {{ duracionHoras() }}h</strong>
        </div>
        <div class="resumen-row">
          <span>Sala ({{ duracionHoras() }}h):</span><strong>&#36;{{ precioSala() }}</strong>
        </div>
        <div class="resumen-row" *ngFor="let s of serviciosSeleccionados()">
          <span>{{ s.nombre }} &times; {{ s.cantidad }}:</span><strong>&#36;{{ s.subtotal }}</strong>
        </div>
        <div class="resumen-row total">
          <span>Total:</span><strong>&#36;{{ precioTotal() }} MXN</strong>
        </div>
      </div>

      <div *ngIf="error()" class="auth-error">{{ error() }}</div>

      <div class="paso-btns">
        <button class="btn-back" (click)="paso.set(3)">← Volver</button>
        <button class="btn-confirmar" [disabled]="creando()" (click)="confirmar()">
          {{ creando() ? 'Confirmando...' : '✓ Confirmar reserva' }}
        </button>
      </div>
    </div>

    <div *ngIf="confirmado()" class="confirmacion">
      <div class="conf-icon">✓</div>
      <h2>¡Reserva confirmada!</h2>
      <p>Tu sesión en <strong>{{ salaSeleccionada()?.name }}</strong> quedó agendada para el {{ fecha() }}.</p>
      <button class="btn-paso" (click)="irAMisReservas()">Ver mis reservas</button>
    </div>
  `,
  styles: [`
    .auth-error {
      background: rgba(255, 77, 0, 0.1);
      border: 1px solid var(--np-accent2);
      color: var(--np-accent2);
      font-size: 13px;
      padding: 10px 14px;
      margin-bottom: 20px;
    }
    .servicios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }
    .servicio-card {
      background: var(--np-surface);
      border: 1px solid #2a2a2a;
      padding: 18px;
      transition: border-color 0.2s;
      &.selected { border-color: var(--np-accent); }
    }
    .servicio-top { display: flex; align-items: center; gap: 12px; cursor: pointer; }
    .servicio-icon {
      width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center;
      background: #141414; border: 1px solid #2a2a2a;
      color: var(--np-accent); font-size: 11px; font-weight: 700;
      flex-shrink: 0;
    }
    .servicio-info { flex: 1; }
    .servicio-nombre { color: var(--np-white); font-weight: 700; font-size: 14.5px; }
    .servicio-precio { color: var(--np-gray); font-size: 12.5px; margin-top: 2px; span { text-transform: lowercase; } }
    .servicio-check {
      width: 26px; height: 26px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid #333; color: var(--np-gray); font-size: 13px; flex-shrink: 0;
      .selected & { background: var(--np-accent); color: var(--np-black); border-color: var(--np-accent); }
    }
    .servicio-desc { color: var(--np-gray); font-size: 12.5px; line-height: 1.5; margin-top: 10px; }
    .servicio-cantidad {
      margin-top: 12px;
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      label { font-size: 11.5px; color: var(--np-gray); text-transform: uppercase; letter-spacing: 0.5px; }
      input {
        width: 70px; background: #0f0f0f; border: 1px solid #2a2a2a; color: var(--np-white);
        font-family: var(--font-mono); padding: 6px 8px; text-align: center;
      }
    }
  `],
})
export class NuevaReservaComponent {
  private salasService = inject(SalasService);
  private serviciosService = inject(ServiciosService);
  private reservaService = inject(ReservaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  paso = signal<Paso>(1);
  confirmado = signal(false);
  creando = signal(false);
  error = signal<string | null>(null);

  hoy = new Date().toISOString().split('T')[0];
  horas = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  salas = this.salasService.getSalas();
  servicios = this.serviciosService.getServicios();

  salaId = signal<string>('');
  fecha = signal<string>(this.hoy);
  hora = signal<string>('10:00');
  duracionHoras = signal<number>(1);
  notas = signal<string>('');

  // servicioId -> cantidad
  private cantidades = signal<Record<string, number>>({});
  seleccionados = signal<Set<string>>(new Set());

  salaSeleccionada = computed(() => this.salas.find((s) => s.id === this.salaId()));

  precioSala = computed(() => (this.salaSeleccionada()?.precio ?? 0) * Number(this.duracionHoras()));

  serviciosSeleccionados = computed<ServicioSeleccionado[]>(() =>
    Array.from(this.seleccionados()).map((id) => {
      const servicio = this.servicios.find((s) => s.id === id)!;
      const cantidad = servicio.requiereCantidad ? this.getCantidad(id) : 1;
      return {
        servicioId: servicio.id,
        nombre: servicio.nombre,
        cantidad,
        precioUnitario: servicio.precio,
        subtotal: servicio.precio * cantidad,
      };
    }),
  );

  precioServicios = computed(() =>
    this.serviciosSeleccionados().reduce((sum, s) => sum + s.subtotal, 0),
  );

  precioTotal = computed(() => this.precioSala() + this.precioServicios());

  isSeleccionado(id: string): boolean {
    return this.seleccionados().has(id);
  }

  toggleServicio(servicio: { id: string; requiereCantidad: boolean }): void {
    const set = new Set(this.seleccionados());
    if (set.has(servicio.id)) {
      set.delete(servicio.id);
    } else {
      set.add(servicio.id);
      if (servicio.requiereCantidad && !this.cantidades()[servicio.id]) {
        this.setCantidad(servicio.id, 1);
      }
    }
    this.seleccionados.set(set);
  }

  getCantidad(servicioId: string): number {
    return this.cantidades()[servicioId] ?? 1;
  }

  setCantidad(servicioId: string, valor: number): void {
    const cantidad = Math.max(1, Number(valor) || 1);
    this.cantidades.update((c) => ({ ...c, [servicioId]: cantidad }));
  }

  async confirmar(): Promise<void> {
    const usuarioId = this.auth.currentUser()?.id;
    if (!usuarioId) {
      this.error.set('Tu sesión expiró. Vuelve a iniciar sesión.');
      return;
    }

    this.error.set(null);
    this.creando.set(true);
    try {
      await this.reservaService.crearReserva({
        usuarioId,
        salaId: this.salaId(),
        fecha: this.fecha(),
        hora: this.hora(),
        duracionHoras: Number(this.duracionHoras()),
        servicios: this.serviciosSeleccionados(),
        notas: this.notas() || undefined,
      });
      this.confirmado.set(true);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se pudo crear la reserva.');
    } finally {
      this.creando.set(false);
    }
  }

  irAMisReservas(): void {
    this.router.navigate(['/usuario/mis-reservas']);
  }
}
