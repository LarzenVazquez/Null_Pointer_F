import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservaService } from '@core/services/reserva.service';
import { AuthService } from '@core/services/auth.service';
import { MensajesService } from '@core/services/mensajes.service';
import { SalasService } from '@core/services/salas.service';
import { User } from '@models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Dashboard</h1>
        <p class="panel-subtitle">Vista general del negocio.</p>
      </div>
    </div>

    <div class="panel-stats-grid">
      <div class="stat-card">
        <div class="stat-card-label">Ingresos totales</div>
        <div class="stat-card-value accent">&#36;{{ ingresosTotales() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Reservas activas</div>
        <div class="stat-card-value">{{ reservasActivas().length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Usuarios registrados</div>
        <div class="stat-card-value">{{ usuarios().length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Mensajes sin responder</div>
        <div class="stat-card-value">{{ mensajesNuevos().length }}</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Ingresos por servicio adicional</div>
      <div class="bar-row" *ngFor="let s of ingresosPorServicio()">
        <div class="bar-label">{{ s.nombre }}</div>
        <div class="bar-track">
          <div class="bar-fill" [style.width.%]="s.porcentaje"></div>
        </div>
        <div class="bar-value">&#36;{{ s.total }}</div>
      </div>
      <div class="panel-empty" *ngIf="!ingresosPorServicio().length">
        Aún no hay servicios adicionales vendidos.
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Reservas por sala</div>
      <div class="bar-row" *ngFor="let s of reservasPorSala()">
        <div class="bar-label">{{ s.nombre }}</div>
        <div class="bar-track">
          <div class="bar-fill alt" [style.width.%]="s.porcentaje"></div>
        </div>
        <div class="bar-value">{{ s.cantidad }}</div>
      </div>
      <div class="panel-empty" *ngIf="!reservasPorSala().length">
        Aún no hay reservas registradas.
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Accesos rápidos</div>
      <div class="quick-grid">
        <a routerLink="/admin/reservas" class="quick-item">▦ Gestionar reservas</a>
        <a routerLink="/admin/mensajes" class="quick-item">✉ Ver mensajes</a>
        <a routerLink="/admin/salas" class="quick-item">▧ Editar salas</a>
        <a routerLink="/admin/reportes" class="quick-item">≡ Ver reportes</a>
      </div>
    </div>
  `,
  styles: [`
    .bar-row { display: grid; grid-template-columns: 140px 1fr 80px; align-items: center; gap: 12px; margin-bottom: 14px; }
    .bar-label { font-size: 13px; color: var(--np-light); }
    .bar-track { height: 8px; background: #1a1a1a; border: 1px solid #262626; }
    .bar-fill { height: 100%; background: var(--np-accent); }
    .bar-fill.alt { background: var(--np-accent2); }
    .bar-value { font-size: 12.5px; color: var(--np-gray); text-align: right; }
    .quick-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
    .quick-item {
      display: block;
      background: #141414;
      border: 1px solid #262626;
      color: var(--np-light);
      text-decoration: none;
      padding: 14px 16px;
      font-size: 13.5px;
      &:hover { border-color: var(--np-accent); color: var(--np-white); }
    }
  `],
})
export class AdminDashboardComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private auth = inject(AuthService);
  private mensajesService = inject(MensajesService);
  private salasService = inject(SalasService);

  private reservas = computed(() => this.reservaService.getAllReservas());
  reservasActivas = computed(() => this.reservas().filter((r) => r.estado !== 'cancelada'));
  usuarios = signal<User[]>([]);
  private mensajes = computed(() => this.mensajesService.getMensajes());
  mensajesNuevos = computed(() => this.mensajes().filter((m) => m.estado === 'nuevo'));

  ngOnInit(): void {
    this.auth.getAllUsers().then((lista) => this.usuarios.set(lista));
  }

  ingresosTotales = computed(() =>
    this.reservasActivas().reduce((sum, r) => sum + r.precioTotal, 0),
  );

  ingresosPorServicio = computed(() => {
    const totales = new Map<string, number>();
    for (const r of this.reservasActivas()) {
      for (const s of r.servicios) {
        totales.set(s.nombre, (totales.get(s.nombre) ?? 0) + s.subtotal);
      }
    }
    const max = Math.max(1, ...Array.from(totales.values()));
    return Array.from(totales.entries()).map(([nombre, total]) => ({
      nombre,
      total,
      porcentaje: (total / max) * 100,
    }));
  });

  reservasPorSala = computed(() => {
    const salas = this.salasService.getSalas();
    const conteos = salas.map((s) => ({
      nombre: s.name,
      cantidad: this.reservasActivas().filter((r) => r.salaId === s.id).length,
    }));
    const max = Math.max(1, ...conteos.map((c) => c.cantidad));
    return conteos
      .filter((c) => c.cantidad > 0)
      .map((c) => ({ ...c, porcentaje: (c.cantidad / max) * 100 }));
  });
}
