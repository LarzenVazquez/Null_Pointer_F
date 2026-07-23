import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ReservaService } from '@core/services/reserva.service';
import { FavoritosService } from '@core/services/favoritos.service';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Mi dashboard</h1>
        <p class="panel-subtitle">Resumen de tu actividad en Null Pointer.</p>
      </div>
      <a routerLink="/usuario/nueva-reserva" class="btn-main"
        >+ Nueva reserva</a
      >
    </div>

    <div class="panel-stats-grid">
      <div class="stat-card">
        <div class="stat-card-label">Próximas reservas</div>
        <div class="stat-card-value accent">{{ proximas().length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Reservas totales</div>
        <div class="stat-card-value">{{ reservas().length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Salas favoritas</div>
        <div class="stat-card-value">{{ favoritos().length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Total invertido</div>
        <div class="stat-card-value">&#36;{{ totalInvertido() }}</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Próxima sesión</div>

      <ng-container *ngIf="proximas()[0] as reserva; else sinProximas">
        <div class="proxima-row">
          <div>
            <div class="proxima-sala">{{ reserva.salaNombre }}</div>
            <div class="proxima-fecha">
              {{ reserva.fecha }} · {{ reserva.hora }} ·
              {{ reserva.duracionHoras }}h
            </div>
            <div class="proxima-servicios" *ngIf="reserva.servicios.length">
              + {{ reserva.servicios.length }} servicio(s) adicional(es)
            </div>
          </div>
          <div class="proxima-total">&#36;{{ reserva.precioTotal }} MXN</div>
        </div>
      </ng-container>
      <ng-template #sinProximas>
        <div class="panel-empty">
          No tienes reservas próximas.
          <div>
            <a routerLink="/usuario/nueva-reserva" class="btn-main"
              >+ Reservar ahora</a
            >
          </div>
        </div>
      </ng-template>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Accesos rápidos</div>
      <div class="quick-grid">
        <a routerLink="/usuario/mis-reservas" class="quick-item"
          >▦ Ver mis reservas</a
        >
        <a routerLink="/usuario/favoritos" class="quick-item"
          >★ Mis salas favoritas</a
        >
        <a routerLink="/servicios" class="quick-item"
          >≡ Servicios de producción</a
        >
        <a routerLink="/usuario/soporte" class="quick-item"
          >? Contactar soporte</a
        >
      </div>
    </div>
  `,
  styles: [
    `
      .proxima-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }
      .proxima-sala {
        color: var(--np-white);
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .proxima-fecha {
        color: var(--np-gray);
        font-size: 13px;
      }
      .proxima-servicios {
        color: var(--np-accent);
        font-size: 12px;
        margin-top: 4px;
      }
      .proxima-total {
        color: var(--np-accent);
        font-size: 22px;
        font-weight: 700;
      }

      .quick-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }
      .quick-item {
        display: block;
        background: #141414;
        border: 1px solid #262626;
        color: var(--np-light);
        text-decoration: none;
        padding: 14px 16px;
        font-size: 13.5px;
        transition: border-color 0.15s;
        &:hover {
          border-color: var(--np-accent);
          color: var(--np-white);
        }
      }
    `,
  ],
})
export class UsuarioDashboardComponent {
  private auth = inject(AuthService);
  private reservaService = inject(ReservaService);
  private favoritosService = inject(FavoritosService);

  private usuarioId = () => String(this.auth.currentUser()?.id ?? '');

  reservas = computed(() =>
    this.reservaService.getReservasDeUsuario(this.usuarioId()),
  );

  proximas = computed(() =>
    this.reservas().filter(
      (r) =>
        r.estado !== 'cancelada' && new Date(r.fecha) >= this.hoyMedianoche(),
    ),
  );

  favoritos = computed(() =>
    this.favoritosService.getFavoritos(this.usuarioId()),
  );

  totalInvertido = computed(() =>
    this.reservas()
      .filter((r) => r.estado !== 'cancelada')
      .reduce((sum, r) => sum + r.precioTotal, 0),
  );

  private hoyMedianoche(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
