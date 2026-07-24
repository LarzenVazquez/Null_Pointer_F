import { Component, inject, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BusquedaService,
  ResultadoBusquedaGlobal,
} from '@core/services/busqueda.service';

const RESULTADOS_VACIOS: ResultadoBusquedaGlobal = {
  usuarios: [],
  configuracion: [],
};

// Evita disparar una petición por cada tecla.
const DEBOUNCE_MS = 300;

@Component({
  selector: 'app-admin-search',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  template: `
    <div class="admin-search" (focusout)="onFocusOut($event)">
      <input
        type="text"
        class="admin-search-input"
        placeholder="Buscar usuarios, roles, permisos..."
        [(ngModel)]="termino"
        (ngModelChange)="onCambio($event)"
        (focus)="abierto.set(true)"
      />

      <div *ngIf="abierto() && termino().trim()" class="admin-search-panel">
        <div *ngIf="cargando()" class="admin-search-estado">Buscando...</div>

        <ng-container *ngIf="!cargando()">
          <div *ngIf="totalResultados() === 0" class="admin-search-estado">
            Sin resultados para "{{ termino() }}"
          </div>

          <div *ngIf="resultados().usuarios.length" class="admin-search-grupo">
            <div class="admin-search-grupo-titulo">Usuarios</div>
            <button
              *ngFor="let u of resultados().usuarios"
              class="admin-search-item"
              (click)="irAUsuario()"
            >
              <span class="admin-search-item-titulo">{{ u.nombre }}</span>
              <span class="admin-search-item-sub">{{ u.email }}</span>
            </button>
          </div>

          <div
            *ngIf="resultados().configuracion.length"
            class="admin-search-grupo"
          >
            <div class="admin-search-grupo-titulo">Configuración</div>
            <div
              *ngFor="let c of resultados().configuracion"
              class="admin-search-item"
            >
              <span class="admin-search-item-titulo">{{ c.nombre }}</span>
              <span class="admin-search-item-sub">{{ c.tipo }}</span>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-search {
        position: relative;
        width: 320px;
        max-width: 100%;
      }
      .admin-search-input {
        width: 100%;
        background: #161616;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
        color: var(--np-white);
        padding: 10px 12px;
        font-size: 13px;
        outline: none;
      }
      .admin-search-input:focus {
        border-color: var(--np-accent);
      }
      .admin-search-panel {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        background: #111;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        max-height: 360px;
        overflow-y: auto;
        z-index: 50;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      }
      .admin-search-estado {
        padding: 14px;
        color: #888;
        font-size: 13px;
      }
      .admin-search-grupo-titulo {
        padding: 10px 14px 4px;
        color: var(--np-accent);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .admin-search-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: left;
        background: none;
        border: none;
        padding: 8px 14px;
        cursor: pointer;
        color: var(--np-white);
      }
      .admin-search-item:hover {
        background: #1c1c1c;
      }
      .admin-search-item-titulo {
        font-size: 13px;
        font-weight: 600;
      }
      .admin-search-item-sub {
        font-size: 11px;
        color: #888;
      }
    `,
  ],
})
export class AdminSearchComponent {
  private busquedaService = inject(BusquedaService);
  private router = inject(Router);

  termino = signal('');
  resultados = signal<ResultadoBusquedaGlobal>(RESULTADOS_VACIOS);
  cargando = signal(false);
  abierto = signal(false);

  private debounceHandle?: ReturnType<typeof setTimeout>;

  totalResultados(): number {
    return (
      this.resultados().usuarios.length + this.resultados().configuracion.length
    );
  }

  onCambio(valor: string): void {
    this.termino.set(valor);
    clearTimeout(this.debounceHandle);

    if (!valor.trim()) {
      this.resultados.set(RESULTADOS_VACIOS);
      return;
    }

    this.debounceHandle = setTimeout(
      () => this.ejecutarBusqueda(valor),
      DEBOUNCE_MS,
    );
  }

  private async ejecutarBusqueda(valor: string): Promise<void> {
    this.cargando.set(true);
    try {
      const resultados = await this.busquedaService.buscar(valor);
      this.resultados.set(resultados);
    } catch {
      this.resultados.set(RESULTADOS_VACIOS);
    } finally {
      this.cargando.set(false);
    }
  }

  irAUsuario(): void {
    this.abierto.set(false);
    this.router.navigate(['/admin/usuarios']);
  }

  onFocusOut(event: FocusEvent): void {
    // Da tiempo a que el click en un resultado se registre antes de cerrar.
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (relatedTarget?.closest('.admin-search')) return;
    setTimeout(() => this.abierto.set(false), 150);
  }
}
