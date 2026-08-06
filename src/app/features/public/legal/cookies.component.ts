import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SeccionLegal {
  titulo: string;
  parrafos: string[];
}

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Aviso de cookies</span>
    </nav>

    <section class="legal-page">
      <div class="legal-eyebrow">// Legal</div>
      <h1 class="legal-title">Aviso de cookies</h1>
      <p class="legal-updated">Última actualización: 23 de julio de 2026</p>

      <p class="legal-intro">
        Este sitio utiliza cookies y tecnologías similares para que
        funcione correctamente, recordar tus preferencias y entender cómo
        se usa. A continuación te explicamos qué son, cuáles usamos y cómo
        puedes controlarlas.
      </p>

      <article *ngFor="let s of secciones" class="legal-section">
        <h2>{{ s.titulo }}</h2>
        <p *ngFor="let p of s.parrafos">{{ p }}</p>
      </article>

      <div class="legal-contacto">
        <h2>¿Dudas sobre las cookies?</h2>
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
export class CookiesComponent {
  secciones: SeccionLegal[] = [
    {
      titulo: '1. ¿Qué son las cookies?',
      parrafos: [
        'Las cookies son pequeños archivos de texto que un sitio web guarda en tu navegador cuando lo visitas. Permiten que el sitio recuerde tus acciones y preferencias (como el inicio de sesión o el idioma) durante un periodo de tiempo.',
      ],
    },
    {
      titulo: '2. Tipos de cookies que utilizamos',
      parrafos: [
        'Cookies estrictamente necesarias: permiten funciones esenciales como mantener tu sesión iniciada y procesar tus reservaciones. Sin ellas el sitio no puede funcionar correctamente.',
        'Cookies de preferencias: recuerdan configuraciones como filtros de búsqueda o salas favoritas para que no tengas que configurarlas cada vez.',
        'Cookies analíticas: nos ayudan a entender cómo se usa el sitio (páginas más visitadas, tiempo de navegación) para mejorar la experiencia. Se utilizan de forma agregada y anónima.',
      ],
    },
    {
      titulo: '3. Cookies de terceros',
      parrafos: [
        'Algunos proveedores externos que utilizamos, como pasarelas de pago o herramientas de analítica, pueden colocar sus propias cookies al interactuar con el sitio. Estas cookies están sujetas a las políticas de privacidad de dichos terceros.',
      ],
    },
    {
      titulo: '4. Cómo controlar las cookies',
      parrafos: [
        'Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies en cualquier momento desde su panel de configuración de privacidad. Ten en cuenta que bloquear las cookies necesarias puede afectar el funcionamiento del sitio, incluyendo el proceso de inicio de sesión y reservación.',
      ],
    },
    {
      titulo: '5. Cambios a este aviso',
      parrafos: [
        'Podemos actualizar este Aviso de Cookies periódicamente para reflejar cambios en las tecnologías que usamos. Cualquier modificación será publicada en esta misma página junto con su fecha de actualización.',
      ],
    },
  ];
}
