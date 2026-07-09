import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Mi perfil</h1>
        <p class="panel-subtitle">Actualiza tus datos de contacto.</p>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Datos personales</div>

      <form (submit)="guardarDatos($event)">
        <div class="form-grid">
          <div class="np-field">
            <label for="p-nombre">Nombre completo</label>
            <input id="p-nombre" type="text" [(ngModel)]="nombre" name="nombre" />
          </div>
          <div class="np-field">
            <label for="p-email">Correo</label>
            <input id="p-email" type="email" [ngModel]="auth.currentUser()?.email" name="email" disabled />
          </div>
          <div class="np-field">
            <label for="p-tel">Teléfono</label>
            <input id="p-tel" type="tel" [(ngModel)]="telefono" name="telefono" />
          </div>
        </div>

        <div *ngIf="datosGuardados()" class="save-ok">✓ Datos actualizados</div>

        <button type="submit" class="submit-btn" [disabled]="!nombre()">Guardar cambios</button>
      </form>
    </div>

    <div class="panel-card">
      <div class="panel-card-title"><span>//</span> Cambiar contraseña</div>
      <p class="panel-subtitle" style="margin-bottom:16px;">
        Función disponible próximamente. Por ahora, usa "¿Olvidaste tu contraseña?" desde login.
      </p>
    </div>
  `,
  styles: [`
    .save-ok { color: var(--np-accent); font-size: 13px; margin: 4px 0 16px; }
    input:disabled { opacity: 0.5; cursor: not-allowed; }
  `],
})
export class PerfilComponent {
  auth = inject(AuthService);

  nombre = signal(this.auth.currentUser()?.nombre ?? '');
  telefono = signal(this.auth.currentUser()?.telefono ?? '');
  datosGuardados = signal(false);

  guardarDatos(event: Event): void {
    event.preventDefault();
    this.auth.updateProfile({ nombre: this.nombre(), telefono: this.telefono() });
    this.datosGuardados.set(true);
    setTimeout(() => this.datosGuardados.set(false), 2500);
  }
}
