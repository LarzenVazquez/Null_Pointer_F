import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { mensajeDeError } from '@core/utils/http-error.util';
import { User, UserRole } from '@models/user.model';

const ROLES_DISPONIBLES: UserRole[] = ['Administrador', 'Editor', 'Usuario'];

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [NgIf, NgFor, SlicePipe, FormsModule],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Usuarios</h1>
        <p class="panel-subtitle">
          {{ usuarios().length }} cuenta(s) registrada(s).
        </p>
      </div>
    </div>

    <div *ngIf="error()" class="save-error">{{ error() }}</div>

    <div class="panel-card">
      <table class="panel-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Registro</th>
            <th>Estado</th>
            <!-- Nueva columna para el estado -->
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usuarios()">
            <td>{{ u.nombre }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.telefono || '—' }}</td>
            <td>{{ u.fechaRegistro | slice: 0 : 10 }}</td>

            <!-- Badge indicador de activo/inactivo -->
            <td>
              <span
                class="status-badge"
                [class.status-confirmada]="u.activo"
                [class.status-error]="!u.activo"
              >
                {{ u.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <td>
              <span
                class="status-badge"
                [class.status-confirmada]="u.rol === 'Administrador'"
                [class.status-pendiente]="u.rol === 'Editor'"
                [class.status-completada]="u.rol === 'Usuario'"
              >
                {{ u.rol }}
              </span>
            </td>
            <td>
              <select
                class="mini-btn"
                [ngModel]="u.rol"
                [disabled]="cambiandoId() === u.id || esCuentaPropia(u)"
                [title]="
                  esCuentaPropia(u) ? 'No puedes cambiar tu propio rol' : ''
                "
                (ngModelChange)="cambiarRol(u, $event)"
              >
                <option *ngFor="let r of rolesDisponibles" [value]="r">
                  {{ r }}
                </option>
              </select>

              <!-- Botón para alternar la baja lógica -->
              <button
                class="mini-btn"
                style="margin-left: 8px;"
                [disabled]="cambiandoId() === u.id || esCuentaPropia(u)"
                [title]="
                  esCuentaPropia(u) ? 'No puedes cambiar tu propio estado' : ''
                "
                (click)="toggleEstado(u)"
              >
                {{ u.activo ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .mini-btn {
        background: transparent;
        border: 1px solid #333;
        color: var(--np-gray);
        font-family: var(--font-mono);
        font-size: 11px;
        padding: 6px 12px;
        cursor: pointer;
        &:hover:not(:disabled) {
          border-color: var(--np-accent);
          color: var(--np-white);
        }
        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
      .save-error {
        color: #ff4d4d;
        font-size: 13px;
        margin: 4px 0 16px;
      }
      /* Clase para el estado inactivo */
      .status-error {
        background-color: #ff4d4d;
        color: white;
      }
    `,
  ],
})
export class AdminUsuariosComponent implements OnInit {
  private auth = inject(AuthService);

  usuarios = signal<User[]>([]);
  cambiandoId = signal<number | null>(null);
  error = signal<string | null>(null);
  rolesDisponibles = ROLES_DISPONIBLES;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private async cargarUsuarios(): Promise<void> {
    try {
      const lista = await this.auth.getAllUsers();
      this.usuarios.set(
        lista.sort((a, b) => (a.fechaRegistro < b.fechaRegistro ? 1 : -1)),
      );
    } catch (err) {
      this.error.set(
        mensajeDeError(err, 'No se pudo cargar la lista de usuarios.'),
      );
    }
  }

  esCuentaPropia(u: User): boolean {
    return this.auth.currentUser()?.id === u.id;
  }

  async cambiarRol(u: User, nuevoRol: UserRole): Promise<void> {
    if (nuevoRol === u.rol) return;
    this.error.set(null);
    this.cambiandoId.set(u.id);
    try {
      const actualizado = await this.auth.updateUserRole(u.id, nuevoRol);
      this.usuarios.update((lista) =>
        lista.map((x) => (x.id === u.id ? actualizado : x)),
      );
    } catch (err) {
      this.error.set(mensajeDeError(err, 'No se pudo cambiar el rol.'));
    } finally {
      this.cambiandoId.set(null);
    }
  }

  // Método para manejar la activación/desactivación del usuario
  async toggleEstado(u: User): Promise<void> {
    this.error.set(null);
    this.cambiandoId.set(u.id);

    const nuevoEstado = !u.activo;

    try {
      const actualizado = await this.auth.cambiarEstadoUsuario(
        u.id,
        nuevoEstado,
      );
      this.usuarios.update((lista) =>
        lista.map((x) => (x.id === u.id ? actualizado : x)),
      );
    } catch (err) {
      this.error.set(
        mensajeDeError(err, 'No se pudo cambiar el estado del usuario.'),
      );
    } finally {
      this.cambiandoId.set(null);
    }
  }
}
