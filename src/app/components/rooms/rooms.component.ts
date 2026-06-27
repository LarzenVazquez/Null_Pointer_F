import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NgFor],
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
            [class.badge-popular]="room.badge === 'popular'"
            [class.badge-pro]="room.badge === 'pro'"
            [class.badge-std]="room.badge === 'std'"
          >
            {{ room.badgeLabel }}
          </div>

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
      features: [
        'Bateria Pearl Export Pro',
        'Monitoreo independiente',
        'Cabina de control',
      ],
    },
    {
      id: 'b',
      name: 'Sala B',
      price: 110,
      badge: 'pro',
      badgeLabel: 'PRO',
      featured: false,
      features: [
        'Bateria Mapex Saturn',
        'Mesa Behringer X32',
        'PA profesional',
      ],
    },
    {
      id: 'c',
      name: 'Sala C',
      price: 80,
      badge: 'std',
      badgeLabel: 'STD',
      featured: false,
      features: [
        'Bateria Pearl Roadshow',
        'Amplificadores basicos',
        'Ideal para trios',
      ],
    },
  ];
}
