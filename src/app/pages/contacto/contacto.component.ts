import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <!-- Breadcrumb -->
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Contacto</span>
    </nav>

    <div class="contacto-container">
      <!-- Encabezado -->
      <div class="contacto-header">
        <div class="eyebrow">// Habla con nosotros</div>
        <h1>Estamos <span>aqui</span> para ti.</h1>
        <p>
          Cualquier duda sobre reservas, equipo o disponibilidad, nuestro equipo
          responde en menos de 2 horas.
        </p>
      </div>

      <div class="contacto-grid">
        <!-- FORMULARIO DE CONTACTO -->
        <section
          class="contacto-form-section"
          aria-label="Formulario de contacto"
        >
          <h2 class="form-title">// Envianos un mensaje</h2>

          <div *ngIf="!enviado()" class="contact-form">
            <div class="np-field">
              <label for="c-nombre">Nombre</label>
              <input
                id="c-nombre"
                type="text"
                placeholder="Tu nombre completo"
                [(ngModel)]="form.nombre"
              />
            </div>
            <div class="np-field">
              <label for="c-email">Correo</label>
              <input
                id="c-email"
                type="email"
                placeholder="tu@email.com"
                [(ngModel)]="form.email"
              />
            </div>
            <div class="np-field">
              <label for="c-asunto">Asunto</label>
              <select id="c-asunto" [(ngModel)]="form.asunto">
                <option value="">Selecciona un tema</option>
                <option>Informacion de reservas</option>
                <option>Disponibilidad de salas</option>
                <option>Equipo y tecnica</option>
                <option>Tarifas y paquetes</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="np-field">
              <label for="c-msg">Mensaje</label>
              <textarea
                id="c-msg"
                rows="5"
                placeholder="Cuentanos en que podemos ayudarte..."
                [(ngModel)]="form.mensaje"
              ></textarea>
            </div>
            <button
              class="submit-btn"
              [disabled]="!form.nombre || !form.email || !form.mensaje"
              (click)="enviar()"
            >
              → Enviar mensaje
            </button>
          </div>

          <!-- Confirmación de envío -->
          <div *ngIf="enviado()" class="enviado-ok">
            <div class="ok-icon">✓</div>
            <h3>Mensaje enviado</h3>
            <p>
              Gracias <strong>{{ form.nombre }}</strong
              >. Te respondemos en menos de 2 horas.
            </p>
            <button (click)="enviado.set(false); resetForm()">
              Enviar otro mensaje
            </button>
          </div>
        </section>

        <!-- INFORMACIÓN DE CONTACTO -->
        <aside class="contacto-info" aria-label="Datos de contacto">
          <h2 class="info-title">// Informacion</h2>

          <div class="info-item">
            <div class="info-icon">📍</div>
            <div>
              <div class="info-label">Ubicacion</div>
              <div class="info-val">Queretaro, Qro., Mexico</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">📞</div>
            <div>
              <div class="info-label">Telefono</div>
              <a class="info-val" href="tel:+524420000000">+52 442 000 0000</a>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">✉️</div>
            <div>
              <div class="info-label">Correo</div>
              <a class="info-val" href="mailto:contacto@nullpointer.mx"
                >contacto&#64;nullpointer.mx</a
              >
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">🕐</div>
            <div>
              <div class="info-label">Horario</div>
              <div class="info-val">24 horas · 7 dias de la semana</div>
            </div>
          </div>

          <!-- Mapa placeholder -->
          <div class="map-placeholder">
            <div class="map-label">// Ubicacion</div>
            <div class="map-pin">📍</div>
            <div class="map-text">Queretaro, Qro.</div>
            <a
              class="map-link"
              href="https://maps.google.com/?q=Queretaro,Qro,Mexico"
              target="_blank"
              rel="noopener"
            >
              Ver en Google Maps →
            </a>
          </div>

          <!-- Redes sociales -->
          <div class="socials">
            <div class="info-label" style="margin-bottom:12px">
              Redes sociales
            </div>
            <a class="social-btn" href="#" target="_blank" rel="noopener"
              >📷 Instagram</a
            >
            <a class="social-btn" href="#" target="_blank" rel="noopener"
              >🎵 TikTok</a
            >
            <a class="social-btn" href="#" target="_blank" rel="noopener"
              >▶ YouTube</a
            >
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [
    `
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
      }

      .contacto-container {
        padding: 48px 42px;
        max-width: 1100px;
        margin: 0 auto;
      }

      .contacto-header {
        margin-bottom: 48px;
        .eyebrow {
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
          span {
            color: var(--np-accent);
          }
        }
        p {
          color: var(--np-gray);
          font-size: 16px;
          line-height: 1.6;
          max-width: 500px;
        }
      }

      .contacto-grid {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 40px;
        align-items: start;
      }

      /* Form section */
      .form-title,
      .info-title {
        font-size: 14px;
        letter-spacing: 3px;
        color: var(--np-gray);
        text-transform: uppercase;
        margin-bottom: 24px;
        font-weight: 400;
      }

      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
          font-size: 15px;
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

      .submit-btn {
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
        align-self: flex-start;
        transition: opacity 0.2s;
        &:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        &:not(:disabled):hover {
          opacity: 0.85;
        }
      }

      /* Enviado ok */
      .enviado-ok {
        text-align: center;
        padding: 48px 20px;
        animation: fadeIn 0.3s ease;

        .ok-icon {
          width: 56px;
          height: 56px;
          background: var(--np-accent);
          color: var(--np-black);
          border-radius: 50%;
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        h3 {
          font-size: 22px;
          color: var(--np-white);
          margin-bottom: 10px;
        }
        p {
          color: var(--np-gray);
          font-size: 14px;
          line-height: 1.6;
          strong {
            color: var(--np-white);
          }
          margin-bottom: 20px;
        }

        button {
          background: transparent;
          border: 1px solid var(--np-accent);
          color: var(--np-accent);
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 10px 20px;
          cursor: pointer;
          letter-spacing: 1px;
        }
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

      /* Info aside */
      .contacto-info {
        background: #0d0d0d;
        border: 1px solid #1a1a1a;
        padding: 28px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .info-item {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }
      .info-icon {
        font-size: 20px;
        line-height: 1.4;
      }
      .info-label {
        font-size: 11px;
        color: var(--np-gray);
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .info-val {
        font-size: 14px;
        color: var(--np-white);
        line-height: 1.4;
        text-decoration: none;
        a {
          color: var(--np-white);
        }
      }
      a.info-val {
        color: var(--np-accent);
      }

      /* Map placeholder */
      .map-placeholder {
        background: var(--np-surface);
        border: 1px solid #2a2a2a;
        padding: 32px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .map-label {
          font-size: 11px;
          color: var(--np-accent);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .map-pin {
          font-size: 36px;
        }
        .map-text {
          font-size: 14px;
          color: var(--np-gray);
        }
        .map-link {
          font-size: 13px;
          color: var(--np-accent);
          text-decoration: none;
          letter-spacing: 1px;
          margin-top: 4px;
          &:hover {
            text-decoration: underline;
          }
        }
      }

      /* Socials */
      .socials {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .social-btn {
        display: block;
        background: var(--np-surface);
        border: 1px solid #2a2a2a;
        color: var(--np-gray);
        font-family: var(--font-mono);
        font-size: 13px;
        padding: 10px 16px;
        text-decoration: none;
        letter-spacing: 1px;
        transition: all 0.15s;
        &:hover {
          border-color: var(--np-accent);
          color: var(--np-white);
        }
      }

      @media (max-width: 900px) {
        .contacto-container {
          padding: 28px 20px;
        }
        .contacto-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ContactoComponent {
  enviado = signal(false);

  form = { nombre: '', email: '', asunto: '', mensaje: '' };

  enviar(): void {
    if (!this.form.nombre || !this.form.email || !this.form.mensaje) return;
    this.enviado.set(true);
  }

  resetForm(): void {
    this.form = { nombre: '', email: '', asunto: '', mensaje: '' };
  }
}
