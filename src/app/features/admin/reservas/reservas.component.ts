import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ReservaService } from '@core/services/reserva.service';
import { AuthService } from '@core/services/auth.service';
import { mensajeDeError } from '@core/utils/http-error.util';
import { User } from '@models/user.model';
import { EstadoReserva, Reserva } from '@models/reserva.model';

type Filtro = 'todas' | EstadoReserva;

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Reservas</h1>
        <p class="panel-subtitle">{{ reservasFiltradas().length }} reserva(s) {{ filtro() === 'todas' ? '' : ('· ' + filtro()) }}</p>
      </div>
    </div>

    <div class="filtros-row">
      <button
        *ngFor="let f of filtros"
        class="filtro-chip"
        [class.active]="filtro() === f.value"
        (click)="filtro.set(f.value)"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="cancel-error" *ngIf="error()">{{ error() }}</div>

    <div class="panel-card" *ngIf="reservasFiltradas().length; else vacio">
      <table class="panel-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Sala</th>
            <th>Fecha</th>
            <th>Servicios</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reservasFiltradas()">
            <td>{{ nombreUsuario(r.usuarioId) }}</td>
            <td>{{ r.salaNombre }}</td>
            <td>{{ r.fecha }} · {{ r.hora }} · {{ r.duracionHoras }}h</td>
            <td>
              <span *ngIf="r.servicios.length; else sinServ">{{ r.servicios.length }} adicional(es)</span>
              <ng-template #sinServ>—</ng-template>
            </td>
            <td>&#36;{{ r.precioTotal }}</td>
            <td><span class="status-badge" [ngClass]="'status-' + r.estado">{{ r.estado }}</span></td>
            <td>
              <div class="accion-btns" *ngIf="r.estado !== 'cancelada' && r.estado !== 'completada'">
                <button
                  *ngIf="r.estado === 'pendiente'"
                  class="mini-btn confirmar"
                  [disabled]="actualizandoId() === r.id"
                  (click)="cambiarEstado(r, 'confirmada')"
                >Confirmar</button>
                <button
                  class="mini-btn completar"
                  [disabled]="actualizandoId() === r.id"
                  (click)="cambiarEstado(r, 'completada')"
                >Completar</button>
                <button
                  class="mini-btn cancelar"
                  [disabled]="actualizandoId() === r.id"
                  (click)="cambiarEstado(r, 'cancelada')"
                >Cancelar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #vacio>
      <div class="panel-card panel-empty">No hay reservas {{ filtro() === 'todas' ? '' : ('en estado ' + filtro()) }}.</div>
    </ng-template>
  `,
  styles: [`
    .cancel-error {
      background: rgba(255,77,0,0.08);
      border: 1px solid #4a2000;
      color: var(--np-accent2);
      font-family: var(--font-mono);
      font-size: 12.5px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .filtros-row { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .filtro-chip {
      background: #141414;
      border: 1px solid #2a2a2a;
      color: var(--np-gray);
      font-family: var(--font-mono);
      font-size: 12.5px;
      padding: 7px 14px;
      cursor: pointer;
      text-transform: capitalize;
      &:hover { border-color: var(--np-accent); color: var(--np-white); }
      &.active { background: var(--np-accent); color: var(--np-black); border-color: var(--np-accent); font-weight: 700; }
    }
    .accion-btns { display: flex; gap: 6px; flex-wrap: wrap; }
    .mini-btn {
      background: transparent;
      font-family: var(--font-mono);
      font-size: 11px;
      padding: 5px 10px;
      cursor: pointer;
      letter-spacing: 0.3px;
      white-space: nowrap;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &.confirmar { border: 1px solid #1d4a26; color: var(--np-accent); &:hover { background: rgba(200,255,0,0.08); } }
      &.completar { border: 1px solid #333; color: var(--np-gray); &:hover { border-color: #666; color: var(--np-white); } }
      &.cancelar { border: 1px solid #4a2000; color: var(--np-accent2); &:hover { background: rgba(255,77,0,0.08); } }
    }
  `],
})
export class AdminReservasComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private auth = inject(AuthService);

  private refresh = signal(0);
  actualizandoId = signal<string | null>(null);
  filtro = signal<Filtro>('todas');
  error = signal<string | null>(null);

  filtros: { value: Filtro; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  private usuarios = signal<User[]>([]);

  ngOnInit(): void {
    this.auth.getAllUsers().then((lista) => this.usuarios.set(lista));
  }

  private reservas = computed<Reserva[]>(() => {
    this.refresh();
    return this.reservaService.getAllReservas();
  });

  reservasFiltradas = computed(() =>
    this.filtro() === 'todas'
      ? this.reservas()
      : this.reservas().filter((r) => r.estado === this.filtro()),
  );

  nombreUsuario(usuarioId: string): string {
    return (
      this.usuarios().find((u) => String(u.id) === usuarioId)?.nombre ??
      'Usuario eliminado'
    );
  }

  async cambiarEstado(reserva: Reserva, estado: EstadoReserva): Promise<void> {
    this.error.set(null);
    this.actualizandoId.set(reserva.id);
    try {
      await this.reservaService.actualizarEstado(reserva.id, estado);
      this.refresh.update((v) => v + 1);
    } catch (err) {
      this.error.set(mensajeDeError(err, 'No se pudo actualizar la reserva.'));
    } finally {
      this.actualizandoId.set(null);
    }
  }
}
