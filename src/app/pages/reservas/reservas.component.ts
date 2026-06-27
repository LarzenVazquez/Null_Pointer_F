import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

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
            *ngFor="let s of salas"
            class="sala-option"
            [class.selected]="form.sala === s.id"
            (click)="form.sala = s.id"
          >
            <div class="sala-opt-badge" [ngClass]="'badge-' + s.badge">
              {{ s.badgeLabel }}
            </div>
            <div class="sala-opt-name">{{ s.id }}</div>
            <div class="sala-opt-precio">$ {{ s.precio }}<span>/h</span></div>
            <div class="sala-opt-cap">
              {{ s.capacidad }} músicos · {{ s.m2 }}m²
            </div>
            <div class="sala-opt-check" *ngIf="form.sala === s.id">
              ✓ Seleccionada
            </div>
          </div>
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
            <span>Sala:</span><strong>{{ form.sala }}</strong>
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
  styles: [
    `
      /* Mantengo los estilos originales intactos como solicitaste */
      .np-breadcrumb {
        padding: 14px 42px;
        font-size: 13px;
        color: var(--np-gray);
        border-bottom: 1px solid #1a1a1a;
        display: flex;
        gap: 8px;
        a {
          color: var(--np-accent);
          text-decoration: none;
        }
        .sep {
          color: #444;
        }
      }
      .reservas-container {
        max-width: 860px;
        margin: 0 auto;
        padding: 48px 42px;
      }
      .reservas-header {
        margin-bottom: 40px;
        .section-eyebrow {
          font-size: 13px;
          letter-spacing: 3px;
          color: var(--np-accent);
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        h1 {
          font-size: 42px;
          color: var(--np-white);
          font-weight: 700;
          margin-bottom: 10px;
        }
        p {
          color: var(--np-gray);
          font-size: 16px;
          line-height: 1.6;
        }
      }
      .stepper {
        display: flex;
        gap: 0;
        margin-bottom: 48px;
        position: relative;
      }
      .step-line {
        position: absolute;
        top: 16px;
        left: 16px;
        right: 16px;
        height: 1px;
        background: #2a2a2a;
        z-index: 0;
      }
      .step {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        position: relative;
        z-index: 1;
        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1a1a1a;
          border: 1px solid #333;
          color: var(--np-gray);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .step-label {
          font-size: 12px;
          color: var(--np-gray);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        &.active .step-circle {
          background: var(--np-accent);
          border-color: var(--np-accent);
          color: var(--np-black);
        }
        &.current .step-circle {
          box-shadow: 0 0 0 4px rgba(200, 255, 0, 0.2);
        }
      }
      .paso-panel {
        animation: fadeIn 0.25s ease;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      .paso-title {
        font-size: 18px;
        color: var(--np-gray);
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 28px;
        font-weight: 400;
      }
      .sala-selector-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        margin-bottom: 28px;
      }
      .sala-option {
        background: var(--np-surface);
        border: 1px solid #2a2a2a;
        padding: 20px;
        cursor: pointer;
        transition: border-color 0.2s;
        &:hover {
          border-color: #555;
        }
        &.selected {
          border-color: var(--np-accent);
        }
      }
      .sala-opt-badge {
        font-size: 11px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 2px 8px;
        display: inline-block;
        margin-bottom: 10px;
        &.badge-popular {
          background: var(--np-accent);
          color: var(--np-black);
        }
        &.badge-pro {
          background: var(--np-accent2);
          color: #fff;
        }
        &.badge-std {
          background: #222;
          color: var(--np-gray);
          border: 1px solid #333;
        }
      }
      .sala-opt-name {
        font-size: 20px;
        font-weight: 700;
        color: var(--np-white);
        margin-bottom: 6px;
      }
      .sala-opt-precio {
        font-size: 22px;
        font-weight: 700;
        color: var(--np-white);
        margin-bottom: 4px;
        span {
          font-size: 14px;
          color: var(--np-gray);
        }
      }
      .sala-opt-cap {
        font-size: 12px;
        color: var(--np-gray);
        margin-bottom: 10px;
      }
      .sala-opt-check {
        font-size: 12px;
        color: var(--np-accent);
        letter-spacing: 1px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
        .full {
          grid-column: 1 / -1;
        }
      }
      .np-field {
        label {
          display: block;
          font-size: 12px;
          color: var(--np-gray);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        input,
        select,
        textarea {
          width: 100%;
          background: #0f0f0f;
          border: 1px solid #2a2a2a;
          color: var(--np-white);
          font-family: var(--font-mono);
          font-size: 16px;
          padding: 11px 16px;
          transition: border-color 0.2s;
          &:focus {
            outline: none;
            border-color: var(--np-accent);
          }
        }
        textarea {
          resize: vertical;
        }
      }
      .precio-preview {
        background: #0f0f0f;
        border: 1px solid #2a2a2a;
        border-left: 2px solid var(--np-accent);
        padding: 14px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        font-size: 15px;
        color: var(--np-gray);
        strong {
          color: var(--np-accent);
          font-size: 20px;
        }
      }
      .paso-btns {
        display: flex;
        gap: 12px;
      }
      .btn-paso {
        background: var(--np-accent);
        color: var(--np-black);
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 14px 28px;
        border: none;
        cursor: pointer;
        transition: opacity 0.2s;
        &:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        &:not(:disabled):hover {
          opacity: 0.85;
        }
      }
      .btn-back {
        background: transparent;
        border: 1px solid #333;
        color: var(--np-gray);
        font-family: var(--font-mono);
        font-size: 14px;
        padding: 14px 22px;
        cursor: pointer;
        letter-spacing: 1px;
        &:hover {
          border-color: #666;
          color: var(--np-white);
        }
      }
      .btn-confirmar {
        background: var(--np-accent);
        color: var(--np-black);
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 14px 32px;
        border: none;
        cursor: pointer;
        &:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        &:not(:disabled):hover {
          opacity: 0.85;
        }
      }
      .resumen-box {
        background: #0d0d0d;
        border: 1px solid #2a2a2a;
        padding: 20px 24px;
        margin-bottom: 24px;
        .resumen-title {
          font-size: 13px;
          color: var(--np-accent);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
      }
      .resumen-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #1a1a1a;
        font-size: 14px;
        color: var(--np-gray);
        strong {
          color: var(--np-white);
        }
        &:last-child {
          border-bottom: none;
        }
        &.total {
          margin-top: 8px;
          padding-top: 14px;
          border-top: 1px solid #333;
          font-size: 16px;
          strong {
            color: var(--np-accent);
            font-size: 20px;
          }
        }
      }
      .confirmacion {
        text-align: center;
        padding: 60px 0;
        animation: fadeIn 0.4s ease;
        .conf-icon {
          width: 64px;
          height: 64px;
          background: var(--np-accent);
          color: var(--np-black);
          border-radius: 50%;
          font-size: 28px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        h2 {
          font-size: 28px;
          color: var(--np-white);
          margin-bottom: 12px;
        }
        p {
          color: var(--np-gray);
          font-size: 15px;
          margin-bottom: 8px;
          line-height: 1.6;
          strong {
            color: var(--np-white);
          }
        }
      }
      @media (max-width: 700px) {
        .reservas-container {
          padding: 28px 20px;
        }
        .sala-selector-grid {
          grid-template-columns: 1fr;
        }
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ReservasComponent {
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
  salas = [
    {
      id: 'Sala A',
      precio: 150,
      capacidad: 6,
      m2: 40,
      badge: 'popular',
      badgeLabel: 'Más popular',
    },
    {
      id: 'Sala B',
      precio: 110,
      capacidad: 4,
      m2: 28,
      badge: 'pro',
      badgeLabel: 'PRO',
    },
    {
      id: 'Sala C',
      precio: 80,
      capacidad: 3,
      m2: 18,
      badge: 'std',
      badgeLabel: 'STD',
    },
  ];
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
  precioTotal(): number {
    const sala = this.salas.find((s) => s.id === this.form.sala);
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
