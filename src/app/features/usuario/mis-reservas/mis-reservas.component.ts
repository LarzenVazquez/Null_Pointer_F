import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ReservaService } from '@core/services/reserva.service';
import { EstadoReserva, Reserva } from '@models/reserva.model';

type Filtro = 'todas' | EstadoReserva;

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Mis reservas</h1>
        <p class="panel-subtitle">Historial completo de tus sesiones en Null Pointer.</p>
      </div>
      <a routerLink="/usuario/nueva-reserva" class="btn-main">+ Nueva reserva</a>
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

    <div class="panel-card" *ngIf="reservasFiltradas().length; else vacio">
      <table class="panel-table">
        <thead>
          <tr>
            <th>Sala</th>
            <th>Fecha</th>
            <th>Duración</th>
            <th>Servicios</th>
            <th>Total</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reservasFiltradas()">
            <td>{{ r.salaNombre }}</td>
            <td>{{ r.fecha }} · {{ r.hora }}</td>
            <td>{{ r.duracionHoras }}h</td>
            <td>
              <span *ngIf="r.servicios.length; else sinServ">
                {{ r.servicios.length }} adicional(es)
              </span>
              <ng-template #sinServ>—</ng-template>
            </td>
            <td>&#36;{{ r.precioTotal }}</td>
            <td>
              <span class="status-badge" [ngClass]="'status-' + r.estado">{{ r.estado }}</span>
            </td>
            <td>
              <button
                *ngIf="r.estado === 'confirmada' || r.estado === 'pendiente'"
                class="cancel-btn"
                (click)="cancelar(r)"
                [disabled]="cancelandoId() === r.id"
              >
                {{ cancelandoId() === r.id ? '...' : 'Cancelar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #vacio>
      <div class="panel-card panel-empty">
        No tienes reservas {{ filtro() === 'todas' ? '' : ('en estado ' + filtro()) }} todavía.
        <div>
          <a routerLink="/usuario/nueva-reserva" class="btn-main">+ Hacer mi primera reserva</a>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .filtros-row { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .filtro-chip {
      background: #141414;
      border: 1px solid #2a2a2a;
      color: var(--np-gray);
      font-family: var(--font-mono);
      font-size: 12.5px;
      padding: 7px 14px;
      cursor: pointer;
      letter-spacing: 0.5px;
      text-transform: capitalize;
      &:hover { border-color: var(--np-accent); color: var(--np-white); }
      &.active { background: var(--np-accent); color: var(--np-black); border-color: var(--np-accent); font-weight: 700; }
    }
    .cancel-btn {
      background: transparent;
      border: 1px solid #4a2000;
      color: var(--np-accent2);
      font-family: var(--font-mono);
      font-size: 11.5px;
      padding: 6px 12px;
      cursor: pointer;
      letter-spacing: 0.5px;
      &:hover { background: rgba(255,77,0,0.08); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `],
})
export class MisReservasComponent {
  private auth = inject(AuthService);
  private reservaService = inject(ReservaService);

  private refresh = signal(0);
  cancelandoId = signal<string | null>(null);
  filtro = signal<Filtro>('todas');

  filtros: { value: Filtro; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  private reservas = computed<Reserva[]>(() => {
    this.refresh();
    const usuarioId = this.auth.currentUser()?.id ?? '';
    return this.reservaService.getReservasDeUsuario(usuarioId);
  });

  reservasFiltradas = computed(() =>
    this.filtro() === 'todas'
      ? this.reservas()
      : this.reservas().filter((r) => r.estado === this.filtro()),
  );

  async cancelar(reserva: Reserva): Promise<void> {
    if (!confirm(`¿Cancelar la reserva de ${reserva.salaNombre} el ${reserva.fecha}?`)) return;
    this.cancelandoId.set(reserva.id);
    await this.reservaService.cancelarReserva(reserva.id);
    this.cancelandoId.set(null);
    this.refresh.update((v) => v + 1);
  }
}
