import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="np-section" id="reserva">
      <div class="np-section-title" style="margin-bottom: 21px">
        <span>//</span> Reserva en linea
      </div>

      <div class="np-booking">
        <div class="np-booking-title">// Verificar disponibilidad</div>

        <div class="np-booking-grid">
          <div class="np-field">
            <label for="sala">Sala</label>
            <select id="sala" [(ngModel)]="booking.sala">
              <option>Sala A</option>
              <option>Sala B</option>
              <option>Sala C</option>
            </select>
          </div>

          <div class="np-field">
            <label for="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              style="color-scheme: dark"
              [(ngModel)]="booking.fecha"
            />
          </div>

          <div class="np-field">
            <label for="hora">Hora inicio</label>
            <select id="hora" [(ngModel)]="booking.hora">
              <option>10:00</option>
              <option>12:00</option>
              <option>14:00</option>
              <option>16:00</option>
              <option>18:00</option>
              <option>20:00</option>
            </select>
          </div>

          <div class="np-field">
            <label for="duracion">Duracion</label>
            <select id="duracion" [(ngModel)]="booking.duracion">
              <option>1 hora</option>
              <option>2 horas</option>
              <option>3 horas</option>
              <option>Jornada (8h)</option>
            </select>
          </div>
        </div>

        <button class="np-booking-btn" (click)="verificar()">
          → Verificar disponibilidad
        </button>
      </div>
    </section>
  `,
  styles: [`
    .np-section {
      padding: 49px 42px;
      border-bottom: 1px solid #1a1a1a;
    }

    .np-section-title {
      font-size: 19px;
      letter-spacing: 3.5px;
      color: var(--np-gray);
      text-transform: uppercase;
      span { color: var(--np-accent); margin-right: 10.5px; }
    }

    .np-booking {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 28px;
    }

    .np-booking-title {
      font-size: 17.5px;
      letter-spacing: 3.5px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 21px;
    }

    .np-booking-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .np-field {
      label {
        font-size: 14px;
        color: var(--np-gray);
        letter-spacing: 1.75px;
        text-transform: uppercase;
        display: block;
        margin-bottom: 7px;
      }

      select,
      input {
        width: 100%;
        background: #0f0f0f;
        border: 1px solid #2a2a2a;
        color: var(--np-white);
        font-family: var(--font-mono);
        font-size: 17.5px;
        padding: 12.25px 17.5px;
      }
    }

    .np-booking-btn {
      width: 100%;
      background: var(--np-accent);
      color: var(--np-black);
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 3.5px;
      text-transform: uppercase;
      padding: 17.5px;
      border: none;
      cursor: pointer;
      margin-top: 17.5px;
    }
  `],
})
export class BookingComponent {
  booking = {
    sala: 'Sala A',
    fecha: new Date().toISOString().split('T')[0],
    hora: '10:00',
    duracion: '1 hora',
  };

  verificar(): void {
    console.log('Verificando disponibilidad:', this.booking);
    // TODO: conectar con servicio de reservas
  }
}
