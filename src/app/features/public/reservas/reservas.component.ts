import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SalasService } from '@core/services/salas.service';

type Paso = 1 | 2 | 3;

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, RouterLink],
  template: `
    <nav class="np-breadcrumb" aria-label="Ruta de navegacion">
      <a routerLink="/">Inicio</a>
      <span class="sep">/</span>
      <span>Reservas</span>
    </nav>

    <div class="reservas-container">
      <div class="reservas-header">
        <div class="section-eyebrow">// Reservas en linea</div>
        <h1>Asegura tu sala</h1>
        <p>Selecciona sala, fecha y horario. Confirmacion inmediata.</p>
      </div>

      <div
        class="stepper"
        role="progressbar"
        aria-valuenow="1"
        aria-valuemin="1"
        aria-valuemax="3"
      >
        <div
          *ngFor="let p of [1, 2, 3]"
          class="step"
          [class.active]="paso() >= p"
          [class.current]="paso() === p"
        >
          <div class="step-circle">{{ p }}</div>
          <div class="step-label">
            {{ ['Sala', 'Horario', 'Confirmacion'][p - 1] }}
          </div>
        </div>
        <div class="step-line"></div>
      </div>

      <div *ngIf="paso() === 1" class="paso-panel">
        <h2 class="paso-title">// 01 — Selecciona tu sala</h2>
        <div class="sala-selector-grid">
          <div
            *ngFor="let s of salas()"
            class="sala-option"
            [class.selected]="form.sala === s.id"
            (click)="form.sala = s.id"
          >
            <div class="sala-opt-badge" [ngClass]="'badge-' + s.badge">
              {{ s.badgeLabel }}
            </div>
            <div class="sala-opt-name">{{ s.name }}</div>
            <div class="sala-opt-precio">$ {{ s.precio }}<span>/h</span></div>
            <div class="sala-opt-cap">
              {{ s.capacidad }} músicos · {{ s.m2 }}m²
            </div>
            <div class="sala-opt-check" *ngIf="form.sala === s.id">
              ✓ Seleccionada
            </div>
          </div>
        </div>
        <div class="panel-empty" *ngIf="salas().length === 0">
          No hay salas disponibles por el momento.
        </div>
        <button class="btn-paso" [disabled]="!form.sala" (click)="paso.set(2)">
          Continuar → Elegir horario
        </button>
      </div>

      <div *ngIf="paso() === 2" class="paso-panel">
        <h2 class="paso-title">// 02 — Fecha y horario</h2>
        <div class="form-grid">
          <div class="np-field">
            <label for="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              style="color-scheme:dark"
              [(ngModel)]="form.fecha"
              [min]="hoy"
            />
          </div>
          <div class="np-field">
            <label for="hora">Hora de inicio</label>
            <select id="hora" [(ngModel)]="form.hora">
              <option *ngFor="let h of horas" [value]="h">{{ h }}</option>
            </select>
          </div>
          <div class="np-field">
            <label for="duracion">Duración</label>
            <select id="duracion" [(ngModel)]="form.duracion">
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="3">3 horas</option>
              <option value="8">Jornada (8h)</option>
            </select>
          </div>
          <div class="np-field">
            <label for="musicos">Numero de músicos</label>
            <select id="musicos" [(ngModel)]="form.musicos">
              <option *ngFor="let n of [1, 2, 3, 4, 5, 6]" [value]="n">
                {{ n }}
              </option>
            </select>
          </div>
        </div>
        <div class="precio-preview" *ngIf="form.sala && form.duracion">
          <span>Subtotal estimado:</span>
          <strong>$ {{ precioTotal() }} MXN</strong>
        </div>
        <div class="paso-btns">
          <button class="btn-back" (click)="paso.set(1)">← Volver</button>
          <button
            class="btn-paso"
            [disabled]="!form.fecha || !form.hora"
            (click)="paso.set(3)"
          >
            Continuar → Confirmar
          </button>
        </div>
      </div>

      <div *ngIf="paso() === 3" class="paso-panel">
        <h2 class="paso-title">// 03 — Tus datos</h2>
        <div class="form-grid">
          <div class="np-field">
            <label for="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              [(ngModel)]="form.nombre"
            />
          </div>
          <div class="np-field">
            <label for="email">Correo electronico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              [(ngModel)]="form.email"
            />
          </div>
          <div class="np-field full">
            <label for="notas">Notas adicionales (opcional)</label>
            <textarea
              id="notas"
              rows="3"
              placeholder="Necesitas alguna configuracion especial..."
              [(ngModel)]="form.notas"
            ></textarea>
          </div>
        </div>
        <div class="resumen-box">
          <div class="resumen-title">// Resumen de reserva</div>
          <div class="resumen-row">
            <span>Sala:</span><strong>{{ salaSeleccionada()?.name }}</strong>
          </div>
          <div class="resumen-row">
            <span>Fecha:</span><strong>{{ form.fecha }}</strong>
          </div>
          <div class="resumen-row">
            <span>Hora:</span
            ><strong>{{ form.hora }} · {{ form.duracion }}h</strong>
          </div>
          <div class="resumen-row">
            <span>Musicos:</span><strong>{{ form.musicos }}</strong>
          </div>
          <div class="resumen-row total">
            <span>Total:</span><strong>$ {{ precioTotal() }} MXN</strong>
          </div>
        </div>
        <div class="paso-btns">
          <button class="btn-back" (click)="paso.set(2)">← Volver</button>
          <button
            class="btn-confirmar"
            [disabled]="!form.nombre || !form.email"
            (click)="confirmar()"
          >
            ✓ Confirmar Reserva
          </button>
        </div>
      </div>

      <div *ngIf="confirmado()" class="confirmacion">
        <div class="conf-icon">✓</div>
        <h2>¡Reserva confirmada!</h2>
        <p>
          Recibirás un correo de confirmación en
          <strong>{{ form.email }}</strong>
        </p>
        <button class="btn-paso" (click)="resetForm()">
          Hacer otra reserva
        </button>
      </div>
    </div>
  `,
})
export class ReservasComponent {
  private salasService = inject(SalasService);
  private route = inject(ActivatedRoute);

  paso = signal<Paso>(1);
  confirmado = signal(false);
  hoy = new Date().toISOString().split('T')[0];
  horas = [
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '22:00',
  ];
  salas = this.salasService.salas;

  salaSeleccionada = computed(() =>
    this.salas().find((s) => s.id === this.form.sala),
  );

  form = {
    sala: '',
    fecha: this.hoy,
    hora: '10:00',
    duracion: '1',
    musicos: 1,
    nombre: '',
    email: '',
    notas: '',
  };

  private nombrePreseleccion = this.route.snapshot.queryParamMap.get('sala');
  private yaPreseleccionado = false;

  constructor() {
    effect(() => {
      if (this.yaPreseleccionado || !this.nombrePreseleccion) return;
      const encontrada = this.salas().find(
        (s) => s.name === this.nombrePreseleccion,
      );
      if (encontrada) {
        this.form.sala = encontrada.id;
        this.yaPreseleccionado = true;
      }
    });
  }

  precioTotal(): number {
    const sala = this.salaSeleccionada();
    return sala ? sala.precio * parseInt(this.form.duracion) : 0;
  }

  confirmar(): void {
    this.confirmado.set(true);
  }
  resetForm(): void {
    this.form = {
      sala: '',
      fecha: this.hoy,
      hora: '10:00',
      duracion: '1',
      musicos: 1,
      nombre: '',
      email: '',
      notas: '',
    };
    this.paso.set(1);
    this.confirmado.set(false);
  }
}
