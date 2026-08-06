import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { SalasService } from '@core/services/salas.service';
import { mensajeDeError } from '@core/utils/http-error.util';
import { Sala, SalaFormData } from '@models/sala.model';

interface SalaEdicion {
  nombre: string;
  precio: number;
  capacidad: number;
  m2: number;
  badge: 'popular' | 'pro' | 'std';
  badgeLabel: string;
  featured: boolean;
  descripcion: string;
  equipoTexto: string; // una línea por elemento de equipo, más cómodo para editar
  imagenUrl: string;
}

const SALA_VACIA: SalaEdicion = {
  nombre: '',
  precio: 0,
  capacidad: 1,
  m2: 1,
  badge: 'std',
  badgeLabel: '',
  featured: false,
  descripcion: '',
  equipoTexto: '',
  imagenUrl: '',
};

function salaAEdicion(s: Sala): SalaEdicion {
  return {
    nombre: s.name,
    precio: s.precio,
    capacidad: s.capacidad,
    m2: s.m2,
    badge: s.badge,
    badgeLabel: s.badgeLabel,
    featured: s.featured,
    descripcion: s.descripcion,
    equipoTexto: s.equipo.join('\n'),
    imagenUrl: s.imagenUrl ?? '',
  };
}

function edicionAFormData(e: SalaEdicion): SalaFormData {
  return {
    nombre: e.nombre.trim(),
    precio: Number(e.precio),
    capacidad: Number(e.capacidad),
    m2: Number(e.m2),
    badge: e.badge,
    badgeLabel: e.badgeLabel.trim(),
    featured: e.featured,
    descripcion: e.descripcion.trim(),
    equipo: e.equipoTexto
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean),
    imagenUrl: e.imagenUrl.trim(),
  };
}

@Component({
  selector: 'app-admin-salas',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgTemplateOutlet],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Salas</h1>
        <p class="panel-subtitle">
          Administra el catálogo completo de salas: crea, edita o elimina, incluyendo su imagen.
        </p>
      </div>
      <button class="submit-btn" (click)="toggleFormularioNuevo()">
        {{ mostrarFormularioNuevo() ? 'Cancelar' : '+ Nueva sala' }}
      </button>
    </div>

    <div *ngIf="errorGlobal()" class="save-error">{{ errorGlobal() }}</div>

    <!-- FORMULARIO DE CREACIÓN -->
    <div class="panel-card sala-edit-card" *ngIf="mostrarFormularioNuevo()">
      <div class="sala-edit-header">
        <div class="sala-edit-name">Nueva sala</div>
      </div>

      <ng-container
        [ngTemplateOutlet]="formularioSala"
        [ngTemplateOutletContext]="{
          edicion: nuevaSala,
          previewUrl: previewNuevaSala(),
          sufijo: 'nueva',
          onArchivo: onArchivoNuevaSala
        }"
      ></ng-container>

      <div class="sala-edit-footer">
        <span class="guardado-msg" *ngIf="guardadoId() === 'nueva'">✓ Sala creada</span>
        <button class="submit-btn" [disabled]="creando()" (click)="crear()">
          {{ creando() ? 'Creando...' : 'Crear sala' }}
        </button>
      </div>
    </div>

    <!-- LISTADO / EDICIÓN -->
    <div class="salas-admin-grid">
      <div class="panel-card sala-edit-card" *ngFor="let s of salas()">
        <div class="sala-edit-header">
          <div class="sala-edit-name">{{ s.name }}</div>
          <span class="status-badge status-confirmada">{{ s.badgeLabel }}</span>
        </div>

        <ng-container
          *ngIf="ediciones[s.id] as edicion"
          [ngTemplateOutlet]="formularioSala"
          [ngTemplateOutletContext]="{
            edicion: edicion,
            previewUrl: previewEdicion(s.id),
            sufijo: s.id,
            onArchivo: crearHandlerArchivo(s.id)
          }"
        ></ng-container>

        <div class="sala-edit-footer">
          <span class="guardado-msg" *ngIf="guardadoId() === s.id">✓ Guardado</span>
          <button class="submit-btn" [disabled]="guardandoId() === s.id" (click)="guardar(s.id)">
            {{ guardandoId() === s.id ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button
            class="mini-btn btn-eliminar"
            [disabled]="eliminandoId() === s.id"
            (click)="eliminar(s.id, s.name)"
          >
            {{ eliminandoId() === s.id ? 'Eliminando...' : 'Eliminar sala' }}
          </button>
        </div>
      </div>

      <div class="panel-empty" *ngIf="salas().length === 0">
        No hay salas registradas todavía. Usa «+ Nueva sala» para crear la primera.
      </div>
    </div>

    <!-- Plantilla reutilizada por creación y edición -->
    <ng-template #formularioSala let-edicion="edicion" let-previewUrl="previewUrl" let-sufijo="sufijo" let-onArchivo="onArchivo">
      <div class="sala-imagen-row">
        <div class="sala-imagen-preview">
          <img *ngIf="previewUrl" [src]="previewUrl" alt="Vista previa de la sala" />
          <span *ngIf="!previewUrl" class="sin-imagen">Sin imagen</span>
        </div>
        <div class="sala-imagen-controls">
          <label class="np-field full">
            <span class="file-label">Subir imagen (JPG, PNG, WEBP o GIF)</span>
            <input type="file" accept="image/*" (change)="onArchivo($event)" />
          </label>
          <div class="np-field full">
            <label [for]="'img-url-' + sufijo">o pega un link de imagen</label>
            <input
              [id]="'img-url-' + sufijo"
              type="text"
              [(ngModel)]="edicion.imagenUrl"
              [name]="'imagenUrl-' + sufijo"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div class="form-grid">
        <div class="np-field">
          <label [for]="'nombre-' + sufijo">Nombre</label>
          <input [id]="'nombre-' + sufijo" type="text" [(ngModel)]="edicion.nombre" [name]="'nombre-' + sufijo" />
        </div>
        <div class="np-field">
          <label [for]="'precio-' + sufijo">Precio por hora (MXN)</label>
          <input [id]="'precio-' + sufijo" type="number" min="0" [(ngModel)]="edicion.precio" [name]="'precio-' + sufijo" />
        </div>
        <div class="np-field">
          <label [for]="'capacidad-' + sufijo">Capacidad (músicos)</label>
          <input [id]="'capacidad-' + sufijo" type="number" min="1" [(ngModel)]="edicion.capacidad" [name]="'capacidad-' + sufijo" />
        </div>
        <div class="np-field">
          <label [for]="'m2-' + sufijo">Tamaño (m²)</label>
          <input [id]="'m2-' + sufijo" type="number" min="1" [(ngModel)]="edicion.m2" [name]="'m2-' + sufijo" />
        </div>
        <div class="np-field">
          <label [for]="'badge-' + sufijo">Badge</label>
          <select [id]="'badge-' + sufijo" [(ngModel)]="edicion.badge" [name]="'badge-' + sufijo">
            <option value="popular">popular</option>
            <option value="pro">pro</option>
            <option value="std">std</option>
          </select>
        </div>
        <div class="np-field">
          <label [for]="'badgeLabel-' + sufijo">Etiqueta visible</label>
          <input [id]="'badgeLabel-' + sufijo" type="text" [(ngModel)]="edicion.badgeLabel" [name]="'badgeLabel-' + sufijo" />
        </div>
        <div class="np-field checkbox-field">
          <label>
            <input type="checkbox" [(ngModel)]="edicion.featured" [name]="'featured-' + sufijo" />
            Destacada
          </label>
        </div>
        <div class="np-field full">
          <label [for]="'descripcion-' + sufijo">Descripción</label>
          <textarea [id]="'descripcion-' + sufijo" rows="3" [(ngModel)]="edicion.descripcion" [name]="'descripcion-' + sufijo"></textarea>
        </div>
        <div class="np-field full">
          <label [for]="'equipo-' + sufijo">Equipo incluido (un elemento por línea)</label>
          <textarea [id]="'equipo-' + sufijo" rows="4" [(ngModel)]="edicion.equipoTexto" [name]="'equipo-' + sufijo"></textarea>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .salas-admin-grid { display: grid; gap: 20px; }
    .sala-edit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .sala-edit-name { font-size: 19px; font-weight: 700; color: var(--np-white); }
    .sala-edit-footer { display: flex; align-items: center; gap: 14px; margin-top: 6px; flex-wrap: wrap; }
    .guardado-msg { color: var(--np-accent); font-size: 13px; }
    .save-error {
      color: #ff4d4d;
      font-size: 13px;
      margin: 4px 0 16px;
    }
    .checkbox-field {
      display: flex;
      align-items: flex-end;
      label { display: flex; align-items: center; gap: 8px; text-transform: none; letter-spacing: 0; color: var(--np-light); font-size: 14px; cursor: pointer; }
      input[type="checkbox"] { width: auto; }
    }
    .sala-imagen-row {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 18px;
      margin-bottom: 20px;
    }
    .sala-imagen-preview {
      width: 160px;
      height: 110px;
      background: #0f0f0f;
      border: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; }
      .sin-imagen { color: var(--np-gray); font-size: 11px; letter-spacing: 0.5px; text-align: center; padding: 0 8px; }
    }
    .sala-imagen-controls { display: flex; flex-direction: column; gap: 10px; justify-content: center; }
    .file-label {
      display: block;
      font-size: 12px;
      color: var(--np-gray);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .sala-imagen-controls input[type="file"] {
      width: 100%;
      background: #0f0f0f;
      border: 1px solid #2a2a2a;
      color: var(--np-white);
      font-family: var(--font-mono);
      font-size: 12.5px;
      padding: 8px;
    }
    .btn-eliminar {
      margin-left: auto;
      border-color: var(--np-accent2);
      color: var(--np-accent2);
      &:hover:not(:disabled) { background: rgba(255,77,0,0.1); }
    }
    .mini-btn {
      background: transparent;
      border: 1px solid #333;
      color: var(--np-gray);
      font-family: var(--font-mono);
      font-size: 11px;
      padding: 8px 14px;
      cursor: pointer;
      &:hover:not(:disabled) { border-color: var(--np-accent); color: var(--np-white); }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
  `],
})
export class AdminSalasComponent {
  private salasService = inject(SalasService);

  salas = this.salasService.salas;

  guardandoId = signal<string | null>(null);
  eliminandoId = signal<string | null>(null);
  guardadoId = signal<string | null>(null);
  errorGlobal = signal<string | null>(null);
  creando = signal(false);
  mostrarFormularioNuevo = signal(false);

  ediciones: Record<string, SalaEdicion> = {};
  private archivosImagen: Record<string, File | null> = {};
  private previewsPorId = signal<Record<string, string>>({});
  private handlersArchivo: Record<string, (evento: Event) => void> = {};

  nuevaSala: SalaEdicion = { ...SALA_VACIA };
  private archivoNuevaSala: File | null = null;
  private previewNueva = signal<string>('');

  constructor() {
    // Cada vez que llegan/actualizan salas del backend, aseguramos que exista
    // un formulario de edición local para cada una sin pisar cambios en curso.
    effect(() => {
      for (const s of this.salas()) {
        if (!this.ediciones[s.id]) {
          this.ediciones[s.id] = salaAEdicion(s);
        }
      }
    });

    this.salasService.cargarSalas().catch((err) => {
      this.errorGlobal.set(mensajeDeError(err, 'No se pudieron cargar las salas.'));
    });
  }

  previewEdicion(id: string): string {
    return this.previewsPorId()[id] || this.ediciones[id]?.imagenUrl || '';
  }

  previewNuevaSala(): string {
    return this.previewNueva() || this.nuevaSala.imagenUrl;
  }

  crearHandlerArchivo(salaId: string): (evento: Event) => void {
    if (!this.handlersArchivo[salaId]) {
      this.handlersArchivo[salaId] = (evento: Event) => {
        const input = evento.target as HTMLInputElement;
        const archivo = input.files?.[0] ?? null;
        this.archivosImagen[salaId] = archivo;
        if (archivo) {
          this.previewsPorId.update((p) => ({ ...p, [salaId]: URL.createObjectURL(archivo) }));
        }
      };
    }
    return this.handlersArchivo[salaId];
  }

  onArchivoNuevaSala = (evento: Event): void => {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    this.archivoNuevaSala = archivo;
    if (archivo) {
      this.previewNueva.set(URL.createObjectURL(archivo));
    }
  };

  toggleFormularioNuevo(): void {
    this.mostrarFormularioNuevo.update((v) => !v);
    if (this.mostrarFormularioNuevo()) {
      this.nuevaSala = { ...SALA_VACIA };
      this.archivoNuevaSala = null;
      this.previewNueva.set('');
    }
  }

  async guardar(salaId: string): Promise<void> {
    this.errorGlobal.set(null);
    this.guardandoId.set(salaId);
    try {
      await this.salasService.updateSala(
        salaId,
        edicionAFormData(this.ediciones[salaId]),
        this.archivosImagen[salaId] ?? undefined,
      );
      this.guardadoId.set(salaId);
      this.archivosImagen[salaId] = null;
      setTimeout(() => this.guardadoId.set(null), 2000);
    } catch (err) {
      this.errorGlobal.set(mensajeDeError(err, 'No se pudieron guardar los cambios de la sala.'));
    } finally {
      this.guardandoId.set(null);
    }
  }

  async crear(): Promise<void> {
    this.errorGlobal.set(null);

    if (!this.nuevaSala.nombre.trim()) {
      this.errorGlobal.set('El nombre de la sala es obligatorio.');
      return;
    }

    this.creando.set(true);
    try {
      await this.salasService.crearSala(
        edicionAFormData(this.nuevaSala),
        this.archivoNuevaSala ?? undefined,
      );
      this.guardadoId.set('nueva');
      this.nuevaSala = { ...SALA_VACIA };
      this.archivoNuevaSala = null;
      this.previewNueva.set('');
      setTimeout(() => {
        this.guardadoId.set(null);
        this.mostrarFormularioNuevo.set(false);
      }, 1200);
    } catch (err) {
      this.errorGlobal.set(mensajeDeError(err, 'No se pudo crear la sala.'));
    } finally {
      this.creando.set(false);
    }
  }

  async eliminar(salaId: string, nombre: string): Promise<void> {
    const confirmado =
      typeof window !== 'undefined' &&
      window.confirm(`¿Eliminar la sala "${nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    this.errorGlobal.set(null);
    this.eliminandoId.set(salaId);
    try {
      await this.salasService.eliminarSala(salaId);
      delete this.ediciones[salaId];
      delete this.archivosImagen[salaId];
    } catch (err) {
      const mensaje = mensajeDeError(err, 'No se pudo eliminar la sala.');
      const forzar =
        mensaje.toLowerCase().includes('reserva') &&
        typeof window !== 'undefined' &&
        window.confirm(`${mensaje}\n\n¿Eliminar de todas formas junto con sus reservas asociadas?`);

      if (forzar) {
        try {
          await this.salasService.eliminarSala(salaId, true);
          delete this.ediciones[salaId];
          delete this.archivosImagen[salaId];
        } catch (err2) {
          this.errorGlobal.set(mensajeDeError(err2, 'No se pudo eliminar la sala.'));
        }
      } else {
        this.errorGlobal.set(mensaje);
      }
    } finally {
      this.eliminandoId.set(null);
    }
  }
}
