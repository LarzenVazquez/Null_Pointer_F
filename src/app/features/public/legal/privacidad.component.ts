import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SeccionLegal {
  titulo: string;
  parrafos: string[];
}

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Política de privacidad</span>
    </nav>

    <section class="legal-page">
      <div class="legal-eyebrow">// Legal</div>
      <h1 class="legal-title">Política de privacidad</h1>
      <p class="legal-updated">Última actualización: 23 de julio de 2026</p>

      <p class="legal-intro">
        En Null Pointer Studio respetamos tu privacidad y nos comprometemos a
        proteger los datos personales que nos compartes al usar nuestro sitio
        web, crear una cuenta o reservar una sala de ensayo. Esta política
        explica qué información recopilamos, cómo la usamos y qué derechos
        tienes sobre ella.
      </p>

      <article *ngFor="let s of secciones" class="legal-section">
        <h2>{{ s.titulo }}</h2>
        <p *ngFor="let p of s.parrafos">{{ p }}</p>
      </article>

      <div class="legal-contacto">
        <h2>¿Dudas sobre tu privacidad?</h2>
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
      .legal-updated {
        color: #888;
        font-size: 13px;
        margin-bottom: 24px;
      }
      .legal-intro {
        color: #ccc;
        line-height: 1.7;
        margin-bottom: 32px;
      }
      .legal-section {
        margin-bottom: 28px;
      }
      .legal-section h2 {
        font-size: 18px;
        margin-bottom: 10px;
        color: var(--np-white, #fff);
      }
      .legal-section p {
        color: #bbb;
        line-height: 1.7;
        margin: 0 0 10px;
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
export class PrivacidadComponent {
  secciones: SeccionLegal[] = [
    {
      titulo: '1. Responsable del tratamiento de datos',
      parrafos: [
        'Null Pointer Studio, con domicilio operativo en Querétaro, Qro., México, es responsable del tratamiento de los datos personales que nos proporcionas a través de este sitio web, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
      ],
    },
    {
      titulo: '2. Datos que recopilamos',
      parrafos: [
        'Al crear una cuenta o reservar una sala recopilamos datos como nombre, correo electrónico, número de teléfono y, en su caso, datos de facturación necesarios para procesar el pago de tu reservación.',
        'También recopilamos datos de uso del sitio (páginas visitadas, salas consultadas, historial de reservaciones) con fines de mejora del servicio, y datos técnicos básicos como el tipo de navegador o dirección IP para fines de seguridad.',
      ],
    },
    {
      titulo: '3. Finalidades del tratamiento',
      parrafos: [
        'Usamos tus datos personales para: crear y administrar tu cuenta, procesar y confirmar tus reservaciones, enviarte notificaciones relacionadas con tu servicio (confirmaciones, recordatorios, cambios), atender solicitudes de soporte, y mejorar la calidad de nuestras instalaciones y del sitio web.',
        'De forma opcional, y solo si nos das tu consentimiento, podemos usar tu correo electrónico para enviarte promociones o novedades de Null Pointer Studio. Puedes darte de baja de estas comunicaciones en cualquier momento.',
      ],
    },
    {
      titulo: '4. Con quién compartimos tu información',
      parrafos: [
        'No vendemos ni rentamos tus datos personales a terceros. Podemos compartir información limitada con proveedores que nos ayudan a operar el servicio (por ejemplo, procesadores de pago), quienes están obligados contractualmente a proteger tus datos y usarlos únicamente para el fin encomendado.',
        'Podremos divulgar tus datos cuando así lo requiera una autoridad competente, conforme a la legislación aplicable.',
      ],
    },
    {
      titulo: '5. Conservación de los datos',
      parrafos: [
        'Conservamos tus datos personales mientras tu cuenta permanezca activa y durante el tiempo adicional necesario para cumplir con obligaciones legales, fiscales o contables. Una vez cumplida esa finalidad, los datos se eliminan o anonimizan de forma segura.',
      ],
    },
    {
      titulo: '6. Seguridad de la información',
      parrafos: [
        'Implementamos medidas administrativas, técnicas y físicas razonables para proteger tus datos personales contra pérdida, acceso no autorizado, alteración o divulgación indebida. Ningún sistema es 100% infalible, por lo que te recomendamos usar contraseñas seguras y no compartirlas.',
      ],
    },
    {
      titulo: '7. Derechos ARCO',
      parrafos: [
        'Tienes derecho a Acceder a tus datos personales, Rectificarlos si son inexactos, Cancelarlos cuando consideres que no son necesarios, y Oponerte a su uso para fines específicos.',
        'Para ejercer estos derechos, envía tu solicitud a contacto@nullpointer.mx indicando tu nombre completo, el derecho que deseas ejercer y una descripción de los datos correspondientes. Responderemos en un plazo máximo de 20 días hábiles.',
      ],
    },
    {
      titulo: '8. Uso de cookies',
      parrafos: [
        'Nuestro sitio utiliza cookies para mejorar tu experiencia de navegación. Puedes consultar el detalle de su uso en nuestro Aviso de cookies.',
      ],
    },
    {
      titulo: '9. Cambios a esta política',
      parrafos: [
        'Podemos actualizar esta Política de Privacidad periódicamente. Cualquier cambio será publicado en esta misma página junto con su fecha de actualización.',
      ],
    },
  ];
}
