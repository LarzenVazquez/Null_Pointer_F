import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [NgFor, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Nosotros</span>
    </nav>

    <section class="about-hero">
      <div class="about-bg-text">NP</div>
      <div class="about-eyebrow">// Nuestra historia</div>
      <h1>Musicos construyendo<br />para <span>musicos</span>.</h1>
      <p>
        Null Pointer Studio nacio en Queretaro de una frustracion compartida: no
        existia un espacio de ensayo que combinara calidad de estudio con
        precios accesibles y acceso 24 horas.
      </p>
    </section>

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

    <section class="stats-section">
      <div *ngFor="let s of stats" class="stat-item">
        <div class="stat-val">{{ s.val }}</div>
        <div class="stat-lbl">{{ s.lbl }}</div>
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-text">¿Listo para ensayar?</div>
      <a class="cta-btn" routerLink="/reservas">→ Reservar sala ahora</a>
    </section>
  `,
})
export class NosotrosComponent {
  valores = [
    {
      icon: '🎸',
      title: 'Calidad de estudio',
      desc: 'Equipos de marcas profesionales (Pearl, Mapex, Marshall, Behringer) en cada sala, sin compromiso.',
    },
    {
      icon: '🕐',
      title: 'Acceso 24/7',
      desc: 'Ensaya cuando tu creatividad lo pida. Disponibles las 24 horas, los 7 dias de la semana.',
    },
    {
      icon: '💰',
      title: 'Precios justos',
      desc: 'Tarifas transparentes desde $80/h. Sin costos ocultos. Paquetes de jornada completa disponibles.',
    },
    {
      icon: '🔊',
      title: 'Acustica profesional',
      desc: 'Salas tratadas acusticamente para maxima absorcion y reflexion controlada. Cero filtraciones.',
    },
    {
      icon: '📍',
      title: 'Ubicacion central',
      desc: 'En el corazon de Queretaro, accesible desde cualquier colonia en menos de 30 minutos.',
    },
    {
      icon: '⚡',
      title: 'Reserva al instante',
      desc: 'Sistema de reservas en linea disponible 24/7. Confirmacion inmediata sin esperas ni llamadas.',
    },
  ];

  equipo = [
    {
      initials: 'GL',
      name: 'Guillermo Larzen',
      role: 'Fundador',
      desc: 'Baterista con 12 años de experiencia. Visionario detras del proyecto, combina la pasion por la musica con el desarrollo de software.',
    },
    {
      initials: 'MR',
      name: 'Miguel Ramirez',
      role: 'Director Tecnico',
      desc: 'Ingeniero de audio con experiencia en produccion musical. Responsable de la acustica y el equipamiento de las salas.',
    },
    {
      initials: 'SA',
      name: 'Sofia Aguilar',
      role: 'Operaciones',
      desc: 'Coordinadora de reservas y atencion al cliente. Garantiza que cada sesion sea una experiencia perfecta.',
    },
  ];

  stats = [
    { val: '3', lbl: 'Salas disponibles' },
    { val: '200+', lbl: 'Bandas registradas' },
    { val: '24h', lbl: 'Acceso continuo' },
    { val: '4.9', lbl: 'Puntuacion media' },
  ];
}
