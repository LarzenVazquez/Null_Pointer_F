import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <!-- Breadcrumb -->
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Nosotros</span>
    </nav>

    <!-- HERO DE SECCIÓN -->
    <section class="about-hero">
      <div class="about-bg-text">NP</div>
      <div class="about-eyebrow">// Nuestra historia</div>
      <h1>Musicos construyendo<br>para <span>musicos</span>.</h1>
      <p>Null Pointer Studio nacio en Queretaro de una frustracion compartida: no existia un espacio de ensayo que combinara calidad de estudio con precios accesibles y acceso 24 horas.</p>
    </section>

    <!-- VALORES / FEATURES -->
    <section class="values-section">
      <div class="section-label">// Por que elegirnos</div>
      <div class="values-grid">
        <div *ngFor="let v of valores" class="value-card">
          <div class="value-icon">{{ v.icon }}</div>
          <div class="value-title">{{ v.title }}</div>
          <div class="value-desc">{{ v.desc }}</div>
        </div>
      </div>
    </section>

    <!-- EQUIPO / TEAM -->
    <section class="team-section">
      <div class="section-label">// Equipo fundador</div>
      <div class="team-grid">
        <div *ngFor="let p of equipo" class="team-card">
          <div class="team-avatar">{{ p.initials }}</div>
          <div class="team-name">{{ p.name }}</div>
          <div class="team-role">{{ p.role }}</div>
          <div class="team-desc">{{ p.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ESTADÍSTICAS -->
    <section class="stats-section">
      <div *ngFor="let s of stats" class="stat-item">
        <div class="stat-val">{{ s.val }}</div>
        <div class="stat-lbl">{{ s.lbl }}</div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="cta-section">
      <div class="cta-text">¿Listo para ensayar?</div>
      <a class="cta-btn" routerLink="/reservas">→ Reservar sala ahora</a>
    </section>
  `,
  styles: [`
    .np-breadcrumb {
      padding: 14px 42px;
      font-size: 13px;
      color: var(--np-gray);
      border-bottom: 1px solid #1a1a1a;
      display: flex;
      gap: 8px;
      a { color: var(--np-accent); text-decoration: none; }
    }

    /* Hero de sección */
    .about-hero {
      padding: 80px 42px 60px;
      border-bottom: 1px solid #1a1a1a;
      position: relative;
      overflow: hidden;
    }

    .about-bg-text {
      position: absolute;
      right: -10px;
      top: 10px;
      font-size: 200px;
      font-weight: 900;
      color: rgba(255,255,255,0.03);
      pointer-events: none;
      line-height: 1;
      user-select: none;
    }

    .about-eyebrow {
      font-size: 13px;
      letter-spacing: 4px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 52px;
      font-weight: 700;
      line-height: 1.1;
      color: var(--np-white);
      margin-bottom: 20px;
      span { color: var(--np-accent); }
    }

    p {
      font-size: 17px;
      color: var(--np-gray);
      max-width: 560px;
      line-height: 1.7;
    }

    /* Valores */
    .values-section {
      padding: 56px 42px;
      border-bottom: 1px solid #1a1a1a;
    }

    .section-label {
      font-size: 13px;
      letter-spacing: 3px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 32px;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .value-card {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 28px;
      transition: border-color 0.2s;
      &:hover { border-color: var(--np-accent); }
    }

    .value-icon { font-size: 28px; margin-bottom: 14px; }
    .value-title { font-size: 16px; font-weight: 700; color: var(--np-white); margin-bottom: 10px; letter-spacing: 0.5px; }
    .value-desc  { font-size: 14px; color: var(--np-gray); line-height: 1.6; }

    /* Team */
    .team-section {
      padding: 56px 42px;
      border-bottom: 1px solid #1a1a1a;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .team-card {
      background: #0d0d0d;
      border: 1px solid #1a1a1a;
      padding: 28px;
      text-align: center;
    }

    .team-avatar {
      width: 64px;
      height: 64px;
      background: var(--np-surface);
      border: 1px solid var(--np-accent);
      color: var(--np-accent);
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      letter-spacing: 2px;
    }

    .team-name { font-size: 16px; font-weight: 700; color: var(--np-white); margin-bottom: 4px; }
    .team-role { font-size: 12px; color: var(--np-accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
    .team-desc { font-size: 13px; color: var(--np-gray); line-height: 1.6; }

    /* Stats */
    .stats-section {
      padding: 48px 42px;
      border-bottom: 1px solid #1a1a1a;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
    }

    .stat-item {
      text-align: center;
      padding: 20px;
      border-right: 1px solid #1a1a1a;
      &:last-child { border-right: none; }
    }

    .stat-val { font-size: 42px; font-weight: 700; color: var(--np-accent); line-height: 1; margin-bottom: 8px; }
    .stat-lbl { font-size: 13px; color: var(--np-gray); letter-spacing: 1.5px; text-transform: uppercase; }

    /* CTA */
    .cta-section {
      padding: 60px 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1a1a1a;
    }

    .cta-text { font-size: 28px; color: var(--np-white); font-weight: 700; }

    .cta-btn {
      background: var(--np-accent);
      color: var(--np-black);
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 16px 32px;
      text-decoration: none;
      transition: opacity 0.2s;
      &:hover { opacity: 0.85; }
    }

    @media (max-width: 900px) {
      .values-grid, .team-grid { grid-template-columns: 1fr; }
      .stats-section { grid-template-columns: 1fr 1fr; }
      h1 { font-size: 36px; }
      .cta-section { flex-direction: column; gap: 24px; text-align: center; }
    }
  `],
})
export class NosotrosComponent {
  valores = [
    { icon: '🎸', title: 'Calidad de estudio', desc: 'Equipos de marcas profesionales (Pearl, Mapex, Marshall, Behringer) en cada sala, sin compromiso.' },
    { icon: '🕐', title: 'Acceso 24/7', desc: 'Ensaya cuando tu creatividad lo pida. Disponibles las 24 horas, los 7 dias de la semana.' },
    { icon: '💰', title: 'Precios justos', desc: 'Tarifas transparentes desde $80/h. Sin costos ocultos. Paquetes de jornada completa disponibles.' },
    { icon: '🔊', title: 'Acustica profesional', desc: 'Salas tratadas acusticamente para maxima absorcion y reflexion controlada. Cero filtraciones.' },
    { icon: '📍', title: 'Ubicacion central', desc: 'En el corazon de Queretaro, accesible desde cualquier colonia en menos de 30 minutos.' },
    { icon: '⚡', title: 'Reserva al instante', desc: 'Sistema de reservas en linea disponible 24/7. Confirmacion inmediata sin esperas ni llamadas.' },
  ];

  equipo = [
    { initials: 'GL', name: 'Guillermo Larzen', role: 'Fundador', desc: 'Baterista con 12 años de experiencia. Visionario detras del proyecto, combina la pasion por la musica con el desarrollo de software.' },
    { initials: 'MR', name: 'Miguel Ramirez',   role: 'Director Tecnico', desc: 'Ingeniero de audio con experiencia en produccion musical. Responsable de la acustica y el equipamiento de las salas.' },
    { initials: 'SA', name: 'Sofia Aguilar',     role: 'Operaciones', desc: 'Coordinadora de reservas y atencion al cliente. Garantiza que cada sesion sea una experiencia perfecta.' },
  ];

  stats = [
    { val: '3',    lbl: 'Salas disponibles' },
    { val: '200+', lbl: 'Bandas registradas' },
    { val: '24h',  lbl: 'Acceso continuo' },
    { val: '4.9',  lbl: 'Puntuacion media' },
  ];
}
