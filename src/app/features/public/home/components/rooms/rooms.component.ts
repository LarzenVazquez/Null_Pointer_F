import { Component, inject } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalasService } from '@core/services/salas.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, RouterLink],
  template: `
    <section class="np-section" id="salas">
      <div class="np-section-header">
        <div class="np-section-title"><span>//</span> Nuestras salas</div>
        <a class="np-section-link" routerLink="/salas">Ver todas →</a>
      </div>

      <div class="np-rooms-grid">
        <div
          *ngFor="let sala of salas()"
          class="np-room-card"
          [class.featured]="sala.featured"
        >
          <div
            class="np-room-image"
            [ngStyle]="sala.imagenUrl ? { 'background-image': 'url(' + sala.imagenUrl + ')' } : {}"
          >
            <span *ngIf="!sala.imagenUrl" class="np-room-image-fallback">{{ sala.name }}</span>
          </div>

          <div
            class="np-room-badge"
            [class.badge-popular]="sala.badge === 'popular'"
            [class.badge-pro]="sala.badge === 'pro'"
            [class.badge-std]="sala.badge === 'std'"
          >
            {{ sala.badgeLabel }}
          </div>

          <div class="np-room-name">{{ sala.name }}</div>
          <div class="np-room-price">
            {{ '$' + sala.precio }} <span>/ hora</span>
          </div>

          <div class="np-room-features">
            <div *ngFor="let eq of sala.equipo.slice(0, 3)" class="np-room-feat">
              {{ eq }}
            </div>
          </div>

          <a class="np-room-cta" routerLink="/reservas" [queryParams]="{ sala: sala.name }">
            Reservar →
          </a>
        </div>

        <div class="np-rooms-empty" *ngIf="salas().length === 0">
          Aún no hay salas disponibles.
        </div>
      </div>
    </section>
  `,
  styles: [`
    .np-section-link {
      text-decoration: none;
      &:hover { opacity: 0.85; }
    }
    .np-room-image {
      height: 140px;
      margin: -1px -1px 14px -1px;
      background-size: cover;
      background-position: center;
      background-color: #141414;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #222;
    }
    .np-room-image-fallback {
      color: var(--np-gray);
      font-size: 13px;
      letter-spacing: 1px;
    }
    .np-room-cta {
      display: inline-block;
      margin-top: 14px;
      color: var(--np-accent);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
      text-decoration: none;
      &:hover { opacity: 0.8; }
    }
    .np-rooms-empty {
      grid-column: 1 / -1;
      color: var(--np-gray);
      text-align: center;
      padding: 30px;
      font-size: 14px;
    }
  `],
})
export class RoomsComponent {
  private salasService = inject(SalasService);

  salas = this.salasService.salas;
}
