import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Pregunta {
  q: string;
  a: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Preguntas frecuentes</span>
    </nav>

    <section class="legal-page">
      <div class="legal-eyebrow">// Ayuda</div>
      <h1 class="legal-title">Preguntas frecuentes</h1>
      <p class="legal-intro">
        Resolvemos las dudas más comunes sobre nuestras salas, reservaciones
        y funcionamiento. Si no encuentras lo que buscas, escríbenos a
        <a href="mailto:contacto@nullpointer.mx">contacto&#64;nullpointer.mx</a>.
      </p>

      <div class="faq-list">
        <details *ngFor="let item of preguntas" class="faq-item">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </div>

      <div class="legal-contacto">
        <h2>¿No encontraste tu respuesta?</h2>
        <p>
          Escríbenos a
          <a href="mailto:contacto@nullpointer.mx"
            >contacto&#64;nullpointer.mx</a
          >
          o visita nuestra
          <a routerLink="/contacto">página de contacto</a>.
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .legal-page {
        max-width: 780px;
        margin: 0 auto;
        padding: 24px 16px 80px;
      }
      .legal-eyebrow {
        color: var(--np-accent, #c8ff00);
        font-size: 12px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .legal-title {
        font-size: clamp(28px, 4vw, 40px);
        margin: 0 0 4px;
      }
      .legal-intro {
        color: #ccc;
        line-height: 1.7;
        margin-bottom: 32px;
      }
      .legal-intro a {
        color: var(--np-accent, #c8ff00);
      }
      .faq-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .faq-item {
        border: 1px solid #222;
        background: var(--np-surface, #0d0d0d);
        padding: 16px 18px;
      }
      .faq-item summary {
        cursor: pointer;
        font-weight: 700;
        color: var(--np-white, #fff);
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .faq-item summary::-webkit-details-marker {
        display: none;
      }
      .faq-item summary::after {
        content: '+';
        color: var(--np-accent, #c8ff00);
        font-size: 20px;
        flex-shrink: 0;
      }
      .faq-item[open] summary::after {
        content: '−';
      }
      .faq-item p {
        color: #bbb;
        line-height: 1.7;
        margin: 12px 0 0;
      }
      .legal-contacto {
        margin-top: 40px;
        padding-top: 24px;
        border-top: 1px solid #222;
      }
      .legal-contacto h2 {
        font-size: 16px;
        margin-bottom: 8px;
      }
      .legal-contacto p {
        color: #bbb;
      }
      .legal-contacto a {
        color: var(--np-accent, #c8ff00);
      }
    `,
  ],
})
export class FaqComponent {
  preguntas: Pregunta[] = [
    {
      q: '¿Cómo reservo una sala de ensayo?',
      a: 'Crea una cuenta gratuita, elige la sala que te interese en la sección "Salas", selecciona fecha y horario disponible, y confirma tu pago. Recibirás la confirmación al instante por correo.',
    },
    {
      q: '¿Las salas tienen equipo incluido?',
      a: 'Sí. Cada sala incluye batería, amplificadores, mesa de mezclas y sistema de monitoreo según su nivel (STD, PRO o Popular). Puedes ver el equipo específico de cada sala en su ficha.',
    },
    {
      q: '¿Puedo cancelar o reprogramar mi reservación?',
      a: 'Sí, siempre que canceles o reprogrames con al menos 24 horas de anticipación no tiene costo. Cancelaciones con menos anticipación pueden estar sujetas a una penalización, como se indica en nuestros Términos y condiciones.',
    },
    {
      q: '¿Tienen acceso 24/7?',
      a: 'Sí, nuestras instalaciones están disponibles las 24 horas, los 7 días de la semana mediante reservación previa.',
    },
    {
      q: '¿Cuántas personas caben en cada sala?',
      a: 'La capacidad varía por sala, desde tríos hasta bandas completas. Puedes filtrar por capacidad directamente en la sección "Salas" para ver las opciones disponibles.',
    },
    {
      q: '¿Qué pasa si dañó algún equipo durante mi ensayo?',
      a: 'Te pedimos hacer un uso cuidadoso del equipo. En caso de daño por mal uso o negligencia, el costo de reparación o reposición podrá ser cobrado al usuario responsable.',
    },
    {
      q: '¿Cómo puedo contactar a soporte?',
      a: 'Puedes escribirnos a contacto@nullpointer.mx o usar el formulario en nuestra página de contacto. Si ya tienes cuenta, también puedes abrir un ticket desde tu panel de usuario.',
    },
  ];
}
