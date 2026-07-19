import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { MensajesService } from '@core/services/mensajes.service';

interface Faq {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Soporte</h1>
        <p class="panel-subtitle">¿Dudas con tu reserva o los servicios de producción? Aquí te ayudamos.</p>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Preguntas frecuentes</div>
      <div class="faq-list">
        <div class="faq-item" *ngFor="let f of faqs">
          <button class="faq-q" (click)="toggleFaq(f.pregunta)">
            {{ f.pregunta }}
            <span>{{ abierta() === f.pregunta ? '−' : '+' }}</span>
          </button>
          <p class="faq-a" *ngIf="abierta() === f.pregunta">{{ f.respuesta }}</p>
        </div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Envíanos un mensaje</div>

      <div *ngIf="!enviado(); else confirmacion" class="contact-form">
        <div class="np-field">
          <label for="s-asunto">Asunto</label>
          <select id="s-asunto" [(ngModel)]="asunto" name="asunto">
            <option value="">Selecciona un tema</option>
            <option>Problema con una reserva</option>
            <option>Dudas sobre grabación / mastering</option>
            <option>Facturación</option>
            <option>Otro</option>
          </select>
        </div>
        <div class="np-field">
          <label for="s-msg">Mensaje</label>
          <textarea
            id="s-msg"
            rows="4"
            placeholder="Cuéntanos en qué podemos ayudarte..."
            [(ngModel)]="mensaje"
            name="mensaje"
          ></textarea>
        </div>
        <button class="submit-btn" [disabled]="!asunto || !mensaje" (click)="enviar()">
          → Enviar mensaje
        </button>
      </div>

      <ng-template #confirmacion>
        <div class="enviado-ok">
          <div class="ok-icon">✓</div>
          <h3>Mensaje enviado</h3>
          <p>Gracias, <strong>{{ auth.currentUser()?.nombre }}</strong>. Te respondemos en menos de 2 horas a tu correo registrado.</p>
          <button (click)="enviado.set(false)">Enviar otro mensaje</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .faq-list { display: flex; flex-direction: column; gap: 4px; }
    .faq-item { border-bottom: 1px solid #1a1a1a; }
    .faq-q {
      width: 100%;
      background: transparent;
      border: none;
      color: var(--np-white);
      font-family: var(--font-mono);
      font-size: 14px;
      text-align: left;
      padding: 14px 4px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span { color: var(--np-accent); font-size: 18px; }
    }
    .faq-a { color: var(--np-gray); font-size: 13px; line-height: 1.6; padding: 0 4px 16px; }
  `],
})
export class SoporteComponent {
  auth = inject(AuthService);
  private mensajesService = inject(MensajesService);

  asunto = '';
  mensaje = '';
  enviado = signal(false);
  abierta = signal<string | null>(null);

  faqs: Faq[] = [
    {
      pregunta: '¿Cómo cancelo o cambio una reserva?',
      respuesta:
        'Ve a "Mis reservas" en tu panel y usa el botón Cancelar. Para cambios de horario, cancela y crea una nueva reserva, o escríbenos aquí mismo.',
    },
    {
      pregunta: '¿Cómo funciona el servicio de mastering?',
      respuesta:
        'Se cobra por pista. Al agregarlo en el paso 3 de "Nueva reserva" indicas cuántas pistas necesitas masterizar; incluye hasta 2 rondas de revisión.',
    },
    {
      pregunta: '¿En qué formato recibo mis masters?',
      respuesta:
        'Entregamos archivos WAV de 24-bit/48kHz por pista mediante un enlace de descarga privado, disponible durante 90 días.',
    },
    {
      pregunta: '¿Puedo agregar grabación a una reserva ya confirmada?',
      respuesta:
        'Por ahora no desde el panel; escríbenos con el número de tu reserva y lo agregamos manualmente.',
    },
  ];

  toggleFaq(pregunta: string): void {
    this.abierta.set(this.abierta() === pregunta ? null : pregunta);
  }

  enviar(): void {
    const user = this.auth.currentUser();
    this.mensajesService.enviarMensaje({
      nombre: user?.nombre ?? 'Usuario',
      email: user?.email ?? '',
      asunto: this.asunto,
      mensaje: this.mensaje,
      origen: 'soporte',
      usuarioId: user?.id !== undefined ? String(user.id) : undefined,
    });
    this.enviado.set(true);
    this.asunto = '';
    this.mensaje = '';
  }
}
