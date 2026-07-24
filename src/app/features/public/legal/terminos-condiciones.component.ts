import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SeccionLegal {
  titulo: string;
  parrafos: string[];
}

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Términos y condiciones</span>
    </nav>

    <section class="legal-page">
      <div class="legal-eyebrow">// Legal</div>
      <h1 class="legal-title">Términos y condiciones</h1>
      <p class="legal-updated">Última actualización: 23 de julio de 2026</p>

      <p class="legal-intro">
        Estos Términos y Condiciones regulan el uso del sitio web, la
        reservación y el uso de las salas de ensayo de Null Pointer Studio
        ("nosotros", "la empresa"). Al crear una cuenta, reservar una sala o
        usar nuestras instalaciones, aceptas estos términos en su totalidad. Si
        no estás de acuerdo, te pedimos no utilizar el servicio.
      </p>

      <article *ngFor="let s of secciones" class="legal-section">
        <h2>{{ s.titulo }}</h2>
        <p *ngFor="let p of s.parrafos">{{ p }}</p>
      </article>

      <div class="legal-contacto">
        <h2>¿Dudas sobre estos términos?</h2>
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
export class TerminosCondicionesComponent {
  secciones: SeccionLegal[] = [
    {
      titulo: '1. Sobre el servicio',
      parrafos: [
        'Null Pointer Studio ofrece salas de ensayo musical por hora, disponibles mediante reservación a través de nuestro sitio web. El uso del sitio, la creación de cuenta y la reservación de salas están sujetos a estos términos.',
      ],
    },
    {
      titulo: '2. Cuentas de usuario',
      parrafos: [
        'Para reservar una sala necesitas crear una cuenta con información veraz y mantenerla actualizada. Eres responsable de la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.',
        'Nos reservamos el derecho de suspender o cancelar cuentas que proporcionen información falsa, incumplan estos términos o hagan un uso indebido de la plataforma.',
      ],
    },
    {
      titulo: '3. Reservaciones y pagos',
      parrafos: [
        'Las reservaciones se confirman una vez procesado el pago correspondiente. Los precios mostrados en el sitio están sujetos a cambios sin previo aviso, pero toda reservación ya confirmada respeta el precio pactado al momento de la compra.',
        'Es responsabilidad del usuario llegar puntual a su horario reservado. El tiempo no utilizado por retrasos atribuibles al usuario no es reembolsable ni acumulable.',
      ],
    },
    {
      titulo: '4. Cancelaciones',
      parrafos: [
        'Las cancelaciones realizadas con al menos 24 horas de anticipación al horario reservado son elegibles para reembolso o reprogramación sin costo. Cancelaciones con menos anticipación podrán estar sujetas a una penalización.',
        'Null Pointer Studio se reserva el derecho de cancelar o reprogramar una reservación por causas de fuerza mayor (fallas eléctricas, mantenimiento urgente, etc.), notificando al usuario a la brevedad y ofreciendo reembolso o reprogramación sin costo.',
      ],
    },
    {
      titulo: '5. Uso de las instalaciones',
      parrafos: [
        'El usuario se compromete a hacer un uso adecuado y cuidadoso del equipo e instalaciones. Cualquier daño causado por mal uso, negligencia o uso indebido del equipo podrá ser cobrado al usuario responsable, conforme al costo de reparación o reposición.',
        'Está prohibido el consumo de sustancias ilegales dentro de las instalaciones, así como cualquier conducta que ponga en riesgo la seguridad de otros usuarios o del personal.',
        'El aforo máximo de cada sala está indicado en su ficha de reservación y debe respetarse en todo momento.',
      ],
    },
    {
      titulo: '6. Responsabilidad',
      parrafos: [
        'Null Pointer Studio no se hace responsable por la pérdida, robo o daño de instrumentos, equipo personal u objetos de valor dejados en las instalaciones. Recomendamos a los usuarios cuidar sus pertenencias en todo momento.',
        'El uso de las instalaciones es bajo el propio riesgo del usuario. Null Pointer Studio no será responsable por lesiones derivadas de un uso negligente o indebido del equipo.',
      ],
    },
    {
      titulo: '7. Propiedad intelectual',
      parrafos: [
        'Todo el contenido del sitio web (textos, imágenes, marca, diseño) es propiedad de Null Pointer Studio y no puede reproducirse, distribuirse o utilizarse con fines comerciales sin autorización previa por escrito.',
      ],
    },
    {
      titulo: '8. Privacidad de datos',
      parrafos: [
        'Los datos personales proporcionados (nombre, correo, teléfono) se utilizan únicamente para gestionar tu cuenta, tus reservaciones y comunicarnos contigo. No compartimos tu información con terceros salvo obligación legal.',
      ],
    },
    {
      titulo:
        '9. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)',
      parrafos: [
        'De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, tienes derecho a Acceder a tus datos personales, Rectificarlos si son inexactos o incompletos, Cancelarlos cuando consideres que no se requieren para alguna de las finalidades señaladas en estos términos, así como a Oponerte al uso de tus datos personales para fines específicos ("Derechos ARCO").',
        'Para ejercer cualquiera de estos derechos, envía tu solicitud a contacto@nullpointer.mx indicando: (1) tu nombre completo, (2) el derecho que deseas ejercer, (3) una descripción clara de los datos sobre los que solicitas el acceso, rectificación, cancelación u oposición, y (4) cualquier documento que sustente tu solicitud.',
        'Daremos respuesta a tu solicitud en un plazo máximo de 20 días hábiles a partir de su recepción, conforme a lo establecido por la ley. En caso de proceder, los cambios se harán efectivos dentro de los 15 días hábiles siguientes a la fecha de respuesta.',
        'También puedes revocar el consentimiento que, en su caso, nos hayas otorgado para el tratamiento de tus datos personales, así como limitar su uso o divulgación, enviando tu solicitud al mismo correo.',
      ],
    },
    {
      titulo: '10. Modificaciones a estos términos',
      parrafos: [
        'Podemos actualizar estos Términos y Condiciones en cualquier momento. Los cambios entran en vigor a partir de su publicación en esta misma página. El uso continuo del servicio después de una actualización implica la aceptación de los nuevos términos.',
      ],
    },
    {
      titulo: '11. Legislación aplicable',
      parrafos: [
        'Estos términos se rigen por las leyes aplicables en el estado de Querétaro, México. Cualquier controversia derivada de su interpretación o cumplimiento se resolverá ante los tribunales competentes de Querétaro, Qro.',
      ],
    },
  ];
}
