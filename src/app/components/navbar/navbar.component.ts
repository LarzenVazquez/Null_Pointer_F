import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="np-nav">
      <div class="np-logo">NULL<span>_</span>POINTER</div>
      <div class="np-nav-links">
        <a href="#salas">Salas</a>
        <a href="#equipo">Equipo</a>
        <a href="#tarifas">Tarifas</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#contacto">Contacto</a>
      </div>
      <button class="np-cta-btn">Reservar ahora</button>
    </nav>
  `,
  styles: [`
    .np-nav {
      background: var(--np-black);
      border-bottom: 1px solid #222;
      padding: 21px 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .np-logo {
      font-size: 25px;
      font-weight: 700;
      color: var(--np-white);
      letter-spacing: 3.5px;
      text-transform: uppercase;
      span { color: var(--np-accent); }
    }

    .np-nav-links {
      display: flex;
      gap: 35px;

      a {
        font-size: 18px;
        letter-spacing: 1.75px;
        color: var(--np-gray);
        text-decoration: none;
        text-transform: uppercase;
        transition: color 0.2s;
        cursor: pointer;

        &:hover { color: var(--np-accent); }
      }
    }

    .np-cta-btn {
      background: var(--np-accent);
      color: var(--np-black);
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 2.6px;
      text-transform: uppercase;
      padding: 10px 25px;
      border: none;
      cursor: pointer;
    }
  `],
})
export class NavbarComponent {}
