import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="np-section" id="reserva">
      <div class="np-section-title"><span>//</span> Reserva en linea</div>

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
            <input id="fecha" type="date" [(ngModel)]="booking.fecha" />
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
  }
}
