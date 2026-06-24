import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="np-footer">
      <div class="np-footer-brand">
        <div class="np-logo">NULL<span>_</span>POINTER</div>
        <p>Sala de ensayos profesional en Queretaro.</p>
      </div>

      <div class="np-footer-col">
        <div class="np-footer-col-title">// Contacto</div>
        <a>Queretaro, Qro.</a>
        <a href="tel:+524420000000">+52 442 000 0000</a>
        <a href="mailto:contacto@nullpointer.mx">contacto&#64;nullpointer.mx</a>
        <a href="#" target="_blank" rel="noopener">Instagram</a>
      </div>
    </footer>

    <div class="np-footer-bottom">
      <span>© 2026 Null Pointer Studio</span>
      <span>Desarrollado con Angular 17</span>
    </div>
  `,
  styles: [`
    .np-footer {
      background: #050505;
      padding: 35px 42px;
      border-top: 1px solid #1a1a1a;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 28px;
    }

    .np-footer-brand {
      .np-logo {
        font-size: 21px;
        font-weight: 700;
        color: var(--np-white);
        letter-spacing: 3.5px;
        text-transform: uppercase;
        margin-bottom: 10.5px;
        span { color: var(--np-accent); }
      }

      p {
        font-size: 14px;
        color: #555;
        line-height: 1.5;
        max-width: 245px;
      }
    }

    .np-footer-col-title {
      font-size: 14px;
      letter-spacing: 3.5px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .np-footer-col {
      a {
        display: block;
        font-size: 14px;
        color: #555;
        margin-bottom: 7px;
        cursor: pointer;
        text-decoration: none;

        &:hover { color: var(--np-white); }
      }
    }

    .np-footer-bottom {
      background: #050505;
      border-top: 1px solid #111;
      padding: 14px 42px;
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 14px;
      color: #333;
    }
  `],
})
export class FooterComponent {}
