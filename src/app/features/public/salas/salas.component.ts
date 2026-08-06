import { Component, inject, signal } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SalasService } from '@core/services/salas.service';
import { AuthService } from '@core/services/auth.service';
import { FavoritosService } from '@core/services/favoritos.service';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, RouterLink],
  template: `
    <!-- BREADCRUMB — elemento de navegación secundaria -->
    <nav class="np-breadcrumb" aria-label="Ruta de navegacion">
      <a routerLink="/">Inicio</a>
      <span class="sep">/</span>
      <span>Salas</span>
    </nav>

    <div class="salas-layout">
      <!-- BARRA LATERAL (Sidebar) — filtros -->
      <aside class="salas-sidebar" aria-label="Filtros de busqueda">
        <div class="sidebar-title">// Filtrar</div>

        <div class="filter-group">
          <div class="filter-label">Presupuesto máx.</div>
          <div class="filter-options">
            <button *ngFor="let b of budgets"
              class="filter-btn"
              [class.active]="filtroPresupuesto() === b"
              (click)="filtroPresupuesto.set(b)">
              {{ b === 9999 ? 'Todos' : '$' + b + '/h' }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-label">Capacidad</div>
          <div class="filter-options">
            <button *ngFor="let c of capacidades"
              class="filter-btn"
              [class.active]="filtroCapacidad() === c"
              (click)="filtroCapacidad.set(c)">
              {{ c === 0 ? 'Todos' : c + '+ músicos' }}
            </button>
          </div>
        </div>

        <button class="reset-btn" (click)="resetFiltros()">Limpiar filtros</button>
      </aside>

      <!-- CONTENIDO PRINCIPAL — catálogo de salas -->
      <main class="salas-main">
        <div class="salas-header">
          <h1 class="salas-title"><span>//</span> Nuestras Salas</h1>
          <div class="salas-count">{{ salasFiltradas().length }} disponible(s)</div>
        </div>

        <!-- GRID DE TARJETAS (Cards) -->
        <div class="salas-grid">
          <article
            *ngFor="let sala of salasFiltradas()"
            class="sala-card"
            [class.featured]="sala.featured"
            [id]="'sala-' + sala.id.toLowerCase()"
            role="article"
          >
            <!-- Imagen/Placeholder visual de sala -->
            <div class="sala-img" [class]="'sala-img-' + sala.id.toLowerCase()">
              <span class="sala-img-label">{{ sala.name }}</span>
              <button
                class="fav-btn"
                [class.active]="esFavorito(sala.id)"
                (click)="toggleFavorito(sala.id)"
                [title]="esFavorito(sala.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'"
              >★</button>
            </div>

            <div class="sala-body">
              <div class="sala-badge-row">
                <span class="sala-badge" [ngClass]="'badge-' + sala.badge">
                  {{ sala.badgeLabel }}
                </span>
                <span class="sala-cap">{{ sala.capacidad }} músicos · {{ sala.m2 }}m²</span>
              </div>

              <h2 class="sala-name">{{ sala.name }}</h2>
              <p class="sala-desc">{{ sala.descripcion }}</p>

              <div class="sala-precio">
                {{ '$' + sala.precio }}<span> / hora</span>
              </div>

              <ul class="sala-equipo">
                <li *ngFor="let eq of sala.equipo">→ {{ eq }}</li>
              </ul>

              <a class="sala-cta" routerLink="/reservas"
                [queryParams]="{sala: sala.name}">
                Reservar {{ sala.name }} →
              </a>
            </div>
          </article>
        </div>

        <!-- ESTADO VACÍO -->
        <div *ngIf="salasFiltradas().length === 0" class="no-results">
          <span>// Sin resultados para los filtros seleccionados</span>
          <button (click)="resetFiltros()">Ver todas las salas</button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Breadcrumb */
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

    /* Layout: sidebar + main */
    .salas-layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      min-height: calc(100vh - 120px);
    }

    /* Sidebar */
    .salas-sidebar {
      border-right: 1px solid #1a1a1a;
      padding: 28px 20px;
      background: #0d0d0d;
      position: sticky;
      top: 61px;
      height: fit-content;
    }

    .sidebar-title {
      font-size: 13px;
      letter-spacing: 3px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .filter-group { margin-bottom: 24px; }

    .filter-label {
      font-size: 12px;
      color: var(--np-gray);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .filter-options { display: flex; flex-direction: column; gap: 6px; }

    .filter-btn {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: var(--np-gray);
      font-family: var(--font-mono);
      font-size: 13px;
      padding: 7px 12px;
      text-align: left;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.5px;

      &:hover { border-color: var(--np-accent); color: var(--np-white); }
      &.active { background: var(--np-accent); color: var(--np-black); border-color: var(--np-accent); font-weight: 700; }
    }

    .reset-btn {
      width: 100%;
      background: transparent;
      border: 1px solid #333;
      color: var(--np-gray);
      font-family: var(--font-mono);
      font-size: 12px;
      padding: 7px;
      cursor: pointer;
      letter-spacing: 1px;
      margin-top: 8px;
      transition: all 0.15s;
      &:hover { border-color: #666; color: var(--np-white); }
    }

    /* Main content */
    .salas-main { padding: 32px 42px; }

    .salas-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 28px;
    }

    .salas-title {
      font-size: 22px;
      color: var(--np-gray);
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 400;
      span { color: var(--np-accent); margin-right: 10px; }
    }

    .salas-count {
      font-size: 13px;
      color: var(--np-gray);
      letter-spacing: 1px;
    }

    /* Cards grid */
    .salas-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .sala-card {
      background: var(--np-surface);
      border: 1px solid #222;
      transition: border-color 0.2s;
      overflow: hidden;

      &:hover { border-color: #444; }
      &.featured { border-color: var(--np-accent); }

      display: grid;
      grid-template-columns: 280px 1fr;
    }

    /* Foto de la sala con overlay para legibilidad */
    .sala-img {
      min-height: 200px;
      display: flex;
      align-items: flex-end;
      padding: 16px;
      position: relative;
      overflow: hidden;
      background-size: cover;
      background-position: center;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.75) 100%);
      }

      &.sala-img-a {
        background-image: url('https://images.pexels.com/photos/5711950/pexels-photo-5711950.jpeg');
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(200,255,0,0.12) 0%, transparent 70%);
        }
      }
      &.sala-img-b {
        background-image: url('https://images.pexels.com/photos/33188274/pexels-photo-33188274.jpeg');
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,77,0,0.12) 0%, transparent 70%);
        }
      }
      &.sala-img-c {
        background-image: url('https://images.pexels.com/photos/8197270/pexels-photo-8197270.jpeg');
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(100,100,255,0.12) 0%, transparent 70%);
        }
      }
    }

    .sala-img-label {
      position: relative;
      z-index: 1;
      font-size: 20px;
      font-weight: 700;
      color: var(--np-white);
      letter-spacing: 1px;
      line-height: 1;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
    }

    .fav-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 2;
      width: 34px;
      height: 34px;
      background: rgba(10,10,10,0.7);
      border: 1px solid #333;
      color: #555;
      font-size: 15px;
      cursor: pointer;
      &:hover { color: var(--np-accent); border-color: var(--np-accent); }
      &.active { color: var(--np-accent); border-color: var(--np-accent); }
    }

    .sala-body { padding: 24px 28px; }

    .sala-badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .sala-badge {
      font-size: 12px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 3px 10px;

      &.badge-popular { background: var(--np-accent); color: var(--np-black); }
      &.badge-pro     { background: var(--np-accent2); color: #fff; }
      &.badge-std     { background: #222; color: var(--np-gray); border: 1px solid #333; }
    }

    .sala-cap { font-size: 12px; color: var(--np-gray); letter-spacing: 0.5px; }

    .sala-name {
      font-size: 24px;
      color: var(--np-white);
      font-weight: 700;
      margin-bottom: 8px;
    }

    .sala-desc {
      font-size: 14px;
      color: var(--np-gray);
      line-height: 1.6;
      margin-bottom: 16px;
      max-width: 480px;
    }

    .sala-precio {
      font-size: 28px;
      font-weight: 700;
      color: var(--np-white);
      margin-bottom: 14px;
      span { font-size: 15px; color: var(--np-gray); font-weight: 400; }
    }

    .sala-equipo {
      list-style: none;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      li {
        font-size: 13px;
        color: var(--np-gray);
        &::before { content: "→ "; color: var(--np-accent); }
      }
    }

    .sala-cta {
      display: inline-block;
      background: var(--np-accent);
      color: var(--np-black);
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 12px 24px;
      text-decoration: none;
      transition: opacity 0.2s;
      &:hover { opacity: 0.85; }
    }

    .no-results {
      text-align: center;
      padding: 60px;
      color: var(--np-gray);
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      font-size: 15px;
      letter-spacing: 1px;

      button {
        background: transparent;
        border: 1px solid var(--np-accent);
        color: var(--np-accent);
        font-family: var(--font-mono);
        font-size: 13px;
        padding: 10px 24px;
        cursor: pointer;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }
    }

    @media (max-width: 900px) {
      .salas-layout { grid-template-columns: 1fr; }
      .salas-sidebar { position: static; border-right: none; border-bottom: 1px solid #1a1a1a; }
      .sala-card { grid-template-columns: 1fr; }
    }
  `],
})
export class SalasComponent {
  private salasService = inject(SalasService);
  private auth = inject(AuthService);
  private favoritosService = inject(FavoritosService);
  private router = inject(Router);

  budgets = [9999, 150, 110, 80];
  capacidades = [0, 6, 4, 3];

  filtroPresupuesto = signal<number>(9999);
  filtroCapacidad   = signal<number>(0);

  get salas() {
    return this.salasService.salas();
  }

  esFavorito(salaId: string): boolean {
    const usuarioId = this.auth.currentUser()?.id;
    return usuarioId ? this.favoritosService.esFavorito(String(usuarioId), salaId) : false;
  }

  toggleFavorito(salaId: string): void {
    const usuarioId = this.auth.currentUser()?.id;
    if (!usuarioId) {
      this.router.navigate(['/auth/login'], { queryParams: { redirect: '/salas' } });
      return;
    }
    this.favoritosService.toggleFavorito(String(usuarioId), salaId);
  }

  salasFiltradas = () => this.salas.filter(s => {
    const okBudget = this.filtroPresupuesto() >= s.precio;
    const okCap    = this.filtroCapacidad() === 0 || s.capacidad >= this.filtroCapacidad();
    return okBudget && okCap;
  });

  resetFiltros(): void {
    this.filtroPresupuesto.set(9999);
    this.filtroCapacidad.set(0);
  }
}
