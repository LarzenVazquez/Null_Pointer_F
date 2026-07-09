import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiciosService } from '@core/services/servicios.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <nav class="np-breadcrumb" aria-label="Ruta de navegacion">
      <a routerLink="/">Inicio</a>
      <span class="sep">/</span>
      <span>Servicios</span>
    </nav>

    <div class="servicios-container">
      <div class="servicios-header">
        <div class="section-eyebrow">// Producción musical</div>
        <h1>Más allá del ensayo: <span>producción completa</span></h1>
        <p>
          Graba, masteriza y llévate tus pistas listas para distribuir. Agrega cualquiera
          de estos servicios a tu próxima reserva desde tu panel de usuario.
        </p>
      </div>

      <div class="servicios-grid">
        <article class="servicio-card" *ngFor="let s of servicios">
          <div class="servicio-icon">{{ s.icono }}</div>
          <h2>{{ s.nombre }}</h2>
          <p class="servicio-desc">{{ s.descripcion }}</p>

          <ul class="servicio-detalles">
            <li *ngFor="let d of s.detalles">→ {{ d }}</li>
          </ul>

          <div class="servicio-precio">
            &#36;{{ s.precio }}<span> {{ s.unidad }}</span>
          </div>

          <a routerLink="/auth/login" class="np-cta-btn">Agregar a mi reserva →</a>
        </article>
      </div>

      <div class="servicios-cta">
        <p>¿Ya tienes cuenta? Agrega estos servicios directamente al reservar tu sala.</p>
        <a routerLink="/usuario/nueva-reserva" class="btn-main">Ir a Nueva reserva</a>
      </div>
    </div>
  `,
  styles: [`
    .np-breadcrumb {
      padding: 14px 42px;
      font-size: 13px;
      color: var(--np-gray);
      border-bottom: 1px solid #1a1a1a;
      display: flex;
      gap: 8px;
      align-items: center;
      a { color: var(--np-accent); text-decoration: none; }
      .sep { color: #444; }
    }
    .servicios-container { padding: 48px 42px; max-width: 1100px; margin: 0 auto; }
    .servicios-header { max-width: 640px; margin-bottom: 44px; }
    .servicios-header h1 {
      font-size: 32px;
      color: var(--np-white);
      font-weight: 700;
      line-height: 1.3;
      margin: 12px 0;
      span { color: var(--np-accent); }
    }
    .servicios-header p { color: var(--np-gray); font-size: 15px; line-height: 1.6; }

    .servicios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }
    .servicio-card {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 28px;
      display: flex;
      flex-direction: column;
      &:hover { border-color: #444; }
    }
    .servicio-icon {
      width: 48px; height: 48px;
      display: flex; align-items: center; justify-content: center;
      background: #141414; border: 1px solid #2a2a2a;
      color: var(--np-accent); font-size: 12px; font-weight: 700;
      margin-bottom: 18px;
    }
    .servicio-card h2 { font-size: 20px; color: var(--np-white); margin-bottom: 10px; }
    .servicio-desc { color: var(--np-gray); font-size: 13.5px; line-height: 1.6; margin-bottom: 16px; }
    .servicio-detalles { list-style: none; margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .servicio-detalles li { font-size: 12.5px; color: var(--np-gray); }
    .servicio-precio {
      font-size: 24px; font-weight: 700; color: var(--np-white); margin-bottom: 18px;
      span { font-size: 13px; color: var(--np-gray); font-weight: 400; text-transform: lowercase; }
    }

    .servicios-cta {
      text-align: center;
      border-top: 1px solid #1a1a1a;
      padding-top: 36px;
      p { color: var(--np-gray); font-size: 14px; margin-bottom: 16px; }
    }

    @media (max-width: 700px) {
      .servicios-container { padding: 32px 20px; }
    }
  `],
})
export class ServiciosComponent {
  private serviciosService = inject(ServiciosService);
  servicios = this.serviciosService.getServicios();
}
