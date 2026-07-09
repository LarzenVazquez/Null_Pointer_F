import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MensajesService } from '@core/services/mensajes.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Contacto</span>
    </nav>

    <div class="contacto-container">
      <div class="contacto-header">
        <div class="eyebrow">// Habla con nosotros</div>
        <h1>Estamos <span>aqui</span> para ti.</h1>
        <p>
          Cualquier duda sobre reservas, equipo o disponibilidad, nuestro equipo
          responde en menos de 2 horas.
        </p>
      </div>

      <div class="contacto-grid">
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
          <div class="map-placeholder">
            <div class="map-label">// Ubicacion</div>
            <div class="map-pin">📍</div>
            <div class="map-text">Queretaro, Qro.</div>
            <a
              class="map-link"
              href="https://maps.google.com/?q=Queretaro,Qro,Mexico"
              target="_blank"
              rel="noopener"
              >Ver en Google Maps →</a
            >
          </div>
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
})
export class ContactoComponent {
  private mensajesService = inject(MensajesService);

  enviado = signal(false);
  form = { nombre: '', email: '', asunto: '', mensaje: '' };

  enviar(): void {
    if (!this.form.nombre || !this.form.email || !this.form.mensaje) return;
    this.mensajesService.enviarMensaje({
      nombre: this.form.nombre,
      email: this.form.email,
      asunto: this.form.asunto || 'Sin asunto',
      mensaje: this.form.mensaje,
      origen: 'contacto',
    });
    this.enviado.set(true);
  }

  resetForm(): void {
    this.form = { nombre: '', email: '', asunto: '', mensaje: '' };
  }
}
