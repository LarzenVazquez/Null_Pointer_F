import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { User, UserRole } from '@models/user.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [NgFor, NgIf, SlicePipe],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Usuarios</h1>
        <p class="panel-subtitle">{{ usuarios().length }} cuenta(s) registrada(s).</p>
      </div>
    </div>

    <div class="panel-card">
      <table class="panel-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Registro</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usuarios()">
            <td>{{ u.nombre }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.telefono || '—' }}</td>
            <td>{{ u.fechaRegistro | slice: 0:10 }}</td>
            <td>
              <span class="status-badge" [class.status-confirmada]="u.rol === 'admin'" [class.status-completada]="u.rol === 'usuario'">
                {{ u.rol }}
              </span>
            </td>
            <td>
              <button
                class="mini-btn"
                [disabled]="cambiandoId() === u.id || esCuentaPropia(u)"
                (click)="alternarRol(u)"
                [title]="esCuentaPropia(u) ? 'No puedes cambiar tu propio rol' : ''"
              >
                {{ u.rol === 'admin' ? 'Quitar admin' : 'Hacer admin' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .mini-btn {
      background: transparent;
      border: 1px solid #333;
      color: var(--np-gray);
      font-family: var(--font-mono);
      font-size: 11px;
      padding: 6px 12px;
      cursor: pointer;
      &:hover:not(:disabled) { border-color: var(--np-accent); color: var(--np-white); }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
  `],
})
export class AdminUsuariosComponent {
  private auth = inject(AuthService);

  private refresh = signal(0);
  cambiandoId = signal<string | null>(null);

  usuarios = () => {
    this.refresh();
    return this.auth.getAllUsers();
  };

  esCuentaPropia(u: User): boolean {
    return this.auth.currentUser()?.id === u.id;
  }

  alternarRol(u: User): void {
    const nuevoRol: UserRole = u.rol === 'admin' ? 'usuario' : 'admin';
    this.cambiandoId.set(u.id);
    this.auth.updateUserRole(u.id, nuevoRol);
    this.cambiandoId.set(null);
    this.refresh.update((v) => v + 1);
  }
}
