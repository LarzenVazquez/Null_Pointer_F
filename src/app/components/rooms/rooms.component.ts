import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <section class="np-section" id="salas">
      <div class="np-section-header">
        <div class="np-section-title"><span>//</span> Nuestras salas</div>
        <div class="np-section-link">Ver todas →</div>
      </div>

      <div class="np-rooms-grid">
        <div
          *ngFor="let room of rooms"
          class="np-room-card"
          [class.featured]="room.featured"
        >
          <div
            class="np-room-badge"
            [ngClass]="{
              'badge-popular': room.badge === 'popular',
              'badge-pro':     room.badge === 'pro',
              'badge-std':     room.badge === 'std'
            }"
          >{{ room.badgeLabel }}</div>

          <div class="np-room-name">{{ room.name }}</div>
          <div class="np-room-price">
            {{ '$' + room.price }} <span>/ hora</span>
          </div>

          <div class="np-room-features">
            <div *ngFor="let feat of room.features" class="np-room-feat">
              {{ feat }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .np-section {
      padding: 49px 42px;
      border-bottom: 1px solid #1a1a1a;
    }

    .np-section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 28px;
    }

    .np-section-title {
      font-size: 19px;
      letter-spacing: 3.5px;
      color: var(--np-gray);
      text-transform: uppercase;
      span { color: var(--np-accent); margin-right: 10.5px; }
    }

    .np-section-link {
      font-size: 16px;
      color: var(--np-accent);
      letter-spacing: 1.75px;
      cursor: pointer;
    }

    .np-rooms-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
    }

    .np-room-card {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 24.5px;
      cursor: pointer;
      transition: border-color 0.2s;

      &:hover { border-color: var(--np-accent); }
      &.featured { border-color: var(--np-accent); }
    }

    .np-room-badge {
      font-size: 14px;
      letter-spacing: 1.75px;
      text-transform: uppercase;
      padding: 3.5px 10.5px;
      margin-bottom: 14px;
      display: inline-block;

      &.badge-popular { background: var(--np-accent); color: var(--np-black); }
      &.badge-pro     { background: var(--np-accent2); color: #fff; }
      &.badge-std     { background: #222; color: var(--np-gray); border: 1px solid #333; }
    }

    .np-room-name {
      font-size: 21px;
      font-weight: 700;
      color: var(--np-white);
      margin-bottom: 7px;
      letter-spacing: 0.8px;
    }

    .np-room-price {
      font-size: 28px;
      font-weight: 700;
      color: var(--np-white);
      span { font-size: 16px; color: var(--np-gray); font-weight: 400; }
    }

    .np-room-features {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 5.25px;
    }

    .np-room-feat {
      font-size: 14px;
      color: var(--np-gray);
      letter-spacing: 0.8px;

      &::before { content: "→ "; color: var(--np-accent); }
    }
  `],
})
export class RoomsComponent {
  rooms: Room[] = [
    {
      id: 'a',
      name: 'Sala A',
      price: 150,
      badge: 'popular',
      badgeLabel: 'Mas popular',
      featured: true,
      features: ['Bateria Pearl Export Pro', 'Monitoreo independiente', 'Cabina de control'],
    },
    {
      id: 'b',
      name: 'Sala B',
      price: 110,
      badge: 'pro',
      badgeLabel: 'PRO',
      featured: false,
      features: ['Bateria Mapex Saturn', 'Mesa Behringer X32', 'PA profesional'],
    },
    {
      id: 'c',
      name: 'Sala C',
      price: 80,
      badge: 'std',
      badgeLabel: 'STD',
      featured: false,
      features: ['Bateria Pearl Roadshow', 'Amplificadores basicos', 'Ideal para trios'],
    },
  ];
}
