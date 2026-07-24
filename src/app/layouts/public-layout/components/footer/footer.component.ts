import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="np-footer" role="contentinfo">
      <div class="np-footer-brand">
        <a class="np-logo" routerLink="/">NULL<span>_</span>POINTER</a>
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
        <a href="#" target="_blank" rel="noopener">Instagram</a>
      </div>

      <nav class="np-footer-col" aria-label="Paginas hermanas">
        <div class="np-footer-col-title">// Paginas hermanas</div>
        <a routerLink="/terminos-condiciones">Términos y condiciones</a>
      </nav>
    </footer>

    <div class="np-footer-bottom">
      <span>© 2026 Null Pointer Studio — Queretaro, Qro.</span>
      <span>Desarrollado con Angular 18</span>
    </div>
  `,
})
export class FooterComponent {}
