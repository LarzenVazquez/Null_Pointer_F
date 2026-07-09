import { Component, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ReservaService } from '@core/services/reserva.service';
import { SalasService } from '@core/services/salas.service';
import { ServiciosService } from '@core/services/servicios.service';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Reportes</h1>
        <p class="panel-subtitle">Desempeño de salas y servicios de producción.</p>
      </div>
    </div>

    <div class="panel-stats-grid">
      <div class="stat-card">
        <div class="stat-card-label">Ingresos por salas</div>
        <div class="stat-card-value">&#36;{{ ingresosSalas() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Ingresos por servicios</div>
        <div class="stat-card-value accent">&#36;{{ ingresosServicios() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Ticket promedio</div>
        <div class="stat-card-value">&#36;{{ ticketPromedio() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Tasa de cancelación</div>
        <div class="stat-card-value">{{ tasaCancelacion() }}%</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Uso de servicios de producción</div>
      <table class="panel-table">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Veces contratado</th>
            <th>Unidades vendidas</th>
            <th>Ingreso generado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of usoServicios()">
            <td>{{ s.nombre }}</td>
            <td>{{ s.veces }}</td>
            <td>{{ s.unidades }}</td>
            <td>&#36;{{ s.ingreso }}</td>
          </tr>
        </tbody>
      </table>
      <div class="panel-empty" *ngIf="!usoServicios().length">
        Aún no hay datos suficientes.
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Ocupación por sala</div>
      <table class="panel-table">
        <thead>
          <tr>
            <th>Sala</th>
            <th>Reservas activas</th>
            <th>Horas reservadas</th>
            <th>Ingreso generado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of ocupacionSalas()">
            <td>{{ s.nombre }}</td>
            <td>{{ s.reservas }}</td>
            <td>{{ s.horas }}h</td>
            <td>&#36;{{ s.ingreso }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class AdminReportesComponent {
  private reservaService = inject(ReservaService);
  private salasService = inject(SalasService);
  private serviciosService = inject(ServiciosService);

  private reservasActivas = computed(() =>
    this.reservaService.getAllReservas().filter((r) => r.estado !== 'cancelada'),
  );

  private todasLasReservas = computed(() => this.reservaService.getAllReservas());

  ingresosSalas = computed(() =>
    this.reservasActivas().reduce((sum, r) => sum + r.precioSala, 0),
  );

  ingresosServicios = computed(() =>
    this.reservasActivas().reduce((sum, r) => sum + r.precioServicios, 0),
  );

  ticketPromedio = computed(() => {
    const activas = this.reservasActivas();
    if (!activas.length) return 0;
    const total = activas.reduce((sum, r) => sum + r.precioTotal, 0);
    return Math.round(total / activas.length);
  });

  tasaCancelacion = computed(() => {
    const todas = this.todasLasReservas();
    if (!todas.length) return 0;
    const canceladas = todas.filter((r) => r.estado === 'cancelada').length;
    return Math.round((canceladas / todas.length) * 100);
  });

  usoServicios = computed(() => {
    const catalogo = this.serviciosService.getServicios();
    return catalogo
      .map((servicio) => {
        const seleccionados = this.reservasActivas().flatMap((r) =>
          r.servicios.filter((s) => s.servicioId === servicio.id),
        );
        return {
          nombre: servicio.nombre,
          veces: seleccionados.length,
          unidades: seleccionados.reduce((sum, s) => sum + s.cantidad, 0),
          ingreso: seleccionados.reduce((sum, s) => sum + s.subtotal, 0),
        };
      })
      .filter((s) => s.veces > 0);
  });

  ocupacionSalas = computed(() =>
    this.salasService
      .getSalas()
      .map((sala) => {
        const reservasSala = this.reservasActivas().filter((r) => r.salaId === sala.id);
        return {
          nombre: sala.name,
          reservas: reservasSala.length,
          horas: reservasSala.reduce((sum, r) => sum + r.duracionHoras, 0),
          ingreso: reservasSala.reduce((sum, r) => sum + r.precioSala, 0),
        };
      })
      .filter((s) => s.reservas > 0),
  );
}
