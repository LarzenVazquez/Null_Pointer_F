import { Component, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { SalasService } from '@core/services/salas.service';
import { FavoritosService } from '@core/services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Mis favoritos</h1>
        <p class="panel-subtitle">Salas que has guardado para reservar rápido.</p>
      </div>
    </div>

    <div class="fav-grid" *ngIf="favoritas().length; else vacio">
      <div class="fav-card" *ngFor="let sala of favoritas()">
        <button class="fav-toggle" (click)="quitar(sala.id)" title="Quitar de favoritos">★</button>
        <div class="fav-name">{{ sala.name }}</div>
        <div class="fav-precio">&#36;{{ sala.precio }}<span>/hora</span></div>
        <div class="fav-cap">{{ sala.capacidad }} músicos · {{ sala.m2 }}m²</div>
        <a
          class="np-cta-btn fav-cta"
          routerLink="/usuario/nueva-reserva"
        >
          Reservar →
        </a>
      </div>
    </div>

    <ng-template #vacio>
      <div class="panel-card panel-empty">
        Aún no tienes salas favoritas.
        <div>
          <a routerLink="/salas" class="btn-main">Explorar salas</a>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .fav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .fav-card {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 20px;
      position: relative;
    }
    .fav-toggle {
      position: absolute; top: 14px; right: 14px;
      background: transparent; border: none; color: var(--np-accent);
      font-size: 18px; cursor: pointer;
    }
    .fav-name { font-size: 18px; font-weight: 700; color: var(--np-white); margin-bottom: 8px; padding-right: 24px; }
    .fav-precio { font-size: 22px; font-weight: 700; color: var(--np-white); span { font-size: 13px; color: var(--np-gray); font-weight: 400; } }
    .fav-cap { font-size: 12.5px; color: var(--np-gray); margin: 8px 0 16px; }
    .fav-cta { display: inline-block; width: 100%; text-align: center; }
  `],
})
export class FavoritosComponent {
  private auth = inject(AuthService);
  private salasService = inject(SalasService);
  favoritosService = inject(FavoritosService);

  private usuarioId = () => String(this.auth.currentUser()?.id ?? '');

  favoritas = computed(() => {
    const ids = this.favoritosService.getFavoritos(this.usuarioId());
    return this.salasService.salas().filter((s) => ids.includes(s.id));
  });

  quitar(salaId: string): void {
    this.favoritosService.toggleFavorito(this.usuarioId(), salaId);
  }
}
