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
        <p>Sala de ensayos profesional en Queretaro. Acceso 24/7, equipo incluido.</p>
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
    </footer>

    <div class="np-footer-bottom">
      <span>© 2026 Null Pointer Studio — Queretaro, Qro.</span>
      <span>Desarrollado con Angular 18</span>
    </div>
  `,
  styles: [`
    .np-footer {
      background: #050505;
      padding: 48px 42px 32px;
      border-top: 1px solid #1a1a1a;
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 48px;
    }

    .np-footer-brand {
      .np-logo {
        display: inline-block;
        font-size: 20px;
        font-weight: 700;
        color: var(--np-white);
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-bottom: 12px;
        text-decoration: none;
        span { color: var(--np-accent); }
      }
      p { font-size: 13px; color: #555; line-height: 1.6; max-width: 260px; }
    }

    .np-footer-col-title {
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .np-footer-col {
      display: flex;
      flex-direction: column;
      gap: 0;

      a, span {
        display: block;
        font-size: 13px;
        color: #555;
        padding: 4px 0;
        cursor: pointer;
        text-decoration: none;
        transition: color 0.15s;
        letter-spacing: 0.5px;

        &:hover { color: var(--np-white); }
      }
    }

    .np-footer-bottom {
      background: #030303;
      border-top: 1px solid #111;
      padding: 14px 42px;
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 12px;
      color: #2a2a2a;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .np-footer { grid-template-columns: 1fr; gap: 28px; padding: 32px 20px; }
      .np-footer-bottom { flex-direction: column; gap: 6px; text-align: center; padding: 12px 20px; }
    }
  `],
})
export class FooterComponent {}
