import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="np-footer" role="contentinfo">
      <div class="np-footer-brand">
        <a class="np-logo" routerLink="/">
          <img src="/assets/logo_null.png" alt="Null Pointer Studio" class="np-logo-img" width="30" height="30" />
          <span>NULL<span>_</span>POINTER</span>
        </a>
        <p>
          Sala de ensayos profesional en Queretaro. Acceso 24/7, equipo
          incluido.
        </p>
      </div>

      <nav class="np-footer-col" aria-label="Navegacion rapida">
        <div class="np-footer-col-title">// Paginas</div>
        <a routerLink="/">Inicio</a>
        <a routerLink="/salas">Salas</a>
        <a routerLink="/reservas">Reservas</a>
        <a routerLink="/nosotros">Nosotros</a>
        <a routerLink="/contacto">Contacto</a>
      </nav>

      <div class="np-footer-col">
        <div class="np-footer-col-title">// Contacto</div>
        <span>Queretaro, Qro.</span>
        <a href="tel:+524420000000">+52 442 000 0000</a>
        <a href="mailto:contacto@nullpointer.mx">contacto&#64;nullpointer.mx</a>

        <div class="np-social" aria-label="Redes sociales">
          <a
            class="np-social-icon"
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            title="Facebook"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M13.5 21v-7.9h2.65l.4-3.08h-3.05V8.05c0-.89.25-1.5 1.52-1.5h1.63V3.8c-.28-.04-1.25-.12-2.38-.12-2.36 0-3.97 1.44-3.97 4.08v2.27H7.65v3.08h2.65V21h3.2Z" />
            </svg>
          </a>
          <a
            class="np-social-icon"
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            class="np-social-icon"
            href="https://tiktok.com"
            target="_blank"
            rel="noopener"
            aria-label="TikTok"
            title="TikTok"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M16.6 3c.36 2.16 1.85 3.87 4.14 4.1v2.75c-1.42.13-2.68-.3-4.14-1.1v6.4c0 3.3-2.42 5.85-5.83 5.85-3.4 0-5.87-2.55-5.87-5.85 0-3.28 2.5-5.83 5.87-5.83.34 0 .78.03 1.06.09v2.9a3.1 3.1 0 0 0-1.06-.2 3.05 3.05 0 0 0-3.06 3.04 3.05 3.05 0 0 0 3.06 3.05 3.13 3.13 0 0 0 3.15-3.13V3h2.68Z" />
            </svg>
          </a>
          <a
            class="np-social-icon"
            href="https://web.whatsapp.com"
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.96 0 1.76.46 3.4 1.26 4.83L2 22l5.36-1.29a9.9 9.9 0 0 0 4.68 1.18h.01c5.5 0 9.96-4.45 9.96-9.96C22 6.45 17.55 2 12.05 2h-.01Zm5.8 14.1c-.24.68-1.4 1.3-1.94 1.37-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.15-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2.01.9 2.15.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.15.28.68 1.13 1.47 1.83 1.01.9 1.86 1.19 2.14 1.32.28.13.44.11.6-.07.16-.18.7-.82.89-1.1.19-.28.37-.23.63-.13.25.09 1.62.76 1.9.9.28.14.46.2.53.32.07.13.07.72-.17 1.41Z" />
            </svg>
          </a>
        </div>
      </div>

      <nav class="np-footer-col" aria-label="Legal">
        <div class="np-footer-col-title">// Legal</div>
        <a routerLink="/terminos-condiciones">Términos y condiciones</a>
        <a routerLink="/privacidad">Política de privacidad</a>
        <a routerLink="/cookies">Aviso de cookies</a>
        <a routerLink="/faq">Preguntas frecuentes</a>
      </nav>
    </footer>

    <div class="np-footer-bottom">
      <span>© 2026 Null Pointer Studio — Queretaro, Qro.</span>
      <span>Desarrollado con Angular 18</span>
    </div>
  `,
})
export class FooterComponent {}
