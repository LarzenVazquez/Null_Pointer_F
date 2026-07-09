import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { SalasService } from '@core/services/salas.service';
import { Sala } from '@models/sala.model';

@Component({
  selector: 'app-admin-salas',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Salas</h1>
        <p class="panel-subtitle">Ajusta precio y datos del catálogo de salas.</p>
      </div>
    </div>

    <div class="salas-admin-grid">
      <div class="panel-card sala-edit-card" *ngFor="let s of salas">
        <div class="sala-edit-header">
          <div class="sala-edit-name">{{ s.name }}</div>
          <span class="status-badge status-confirmada">{{ s.badgeLabel }}</span>
        </div>

        <div class="form-grid">
          <div class="np-field">
            <label [for]="'precio-' + s.id">Precio por hora (MXN)</label>
            <input
              [id]="'precio-' + s.id"
              type="number"
              min="0"
              [(ngModel)]="ediciones[s.id].precio"
              [name]="'precio-' + s.id"
            />
          </div>
          <div class="np-field">
            <label [for]="'badge-' + s.id">Etiqueta</label>
            <input
              [id]="'badge-' + s.id"
              type="text"
              [(ngModel)]="ediciones[s.id].badgeLabel"
              [name]="'badge-' + s.id"
            />
          </div>
          <div class="np-field full">
            <label [for]="'desc-' + s.id">Descripción</label>
            <textarea
              [id]="'desc-' + s.id"
              rows="3"
              [(ngModel)]="ediciones[s.id].descripcion"
              [name]="'desc-' + s.id"
            ></textarea>
          </div>
        </div>

        <div class="sala-edit-footer">
          <span class="guardado-msg" *ngIf="guardadoId() === s.id">✓ Guardado</span>
          <button class="submit-btn" (click)="guardar(s.id)">Guardar cambios</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .salas-admin-grid { display: grid; gap: 20px; }
    .sala-edit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .sala-edit-name { font-size: 19px; font-weight: 700; color: var(--np-white); }
    .sala-edit-footer { display: flex; align-items: center; gap: 14px; margin-top: 6px; }
    .guardado-msg { color: var(--np-accent); font-size: 13px; }
  `],
})
export class AdminSalasComponent {
  private salasService = inject(SalasService);

  salas: Sala[] = this.salasService.getSalas();
  guardadoId = signal<string | null>(null);

  ediciones: Record<string, { precio: number; badgeLabel: string; descripcion: string }> =
    Object.fromEntries(
      this.salas.map((s) => [s.id, { precio: s.precio, badgeLabel: s.badgeLabel, descripcion: s.descripcion }]),
    );

  guardar(salaId: string): void {
    const cambios = this.ediciones[salaId];
    this.salasService.updateSala(salaId, {
      precio: Number(cambios.precio),
      badgeLabel: cambios.badgeLabel,
      descripcion: cambios.descripcion,
    });
    this.salas = this.salasService.getSalas();
    this.guardadoId.set(salaId);
    setTimeout(() => this.guardadoId.set(null), 2000);
  }
}
