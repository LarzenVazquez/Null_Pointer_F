import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { rutaInicioSegunRol } from '@core/guards/auth.guard';
import { mensajeDeError } from '@core/utils/http-error.util';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Crear cuenta</span>
    </nav>

    <div class="auth-container">
      <div class="auth-card">
        <div class="eyebrow">// Únete a Null Pointer</div>
        <h1>Crea tu <span>cuenta</span></h1>
        <p class="auth-sub">Regístrate para reservar salas y gestionar tus sesiones.</p>

        <form class="auth-form" (submit)="onSubmit($event)">
          <div class="np-field">
            <label for="r-nombre">Nombre completo</label>
            <input
              id="r-nombre"
              type="text"
              placeholder="Tu nombre completo"
              autocomplete="name"
              [(ngModel)]="nombre"
              name="nombre"
              required
            />
          </div>

          <div class="np-field">
            <label for="r-email">Correo</label>
            <input
              id="r-email"
              type="email"
              placeholder="tu@email.com"
              autocomplete="email"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="np-field">
            <label for="r-tel">Teléfono (opcional)</label>
            <input
              id="r-tel"
              type="tel"
              placeholder="442 123 4567"
              autocomplete="tel"
              [(ngModel)]="telefono"
              name="telefono"
            />
          </div>

          <div class="np-field">
            <label for="r-pass">Contraseña</label>
            <input
              id="r-pass"
              type="password"
              placeholder="Mínimo 8 caracteres, con mayúscula, minúscula y número"
              autocomplete="new-password"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>

          <div class="np-field">
            <label for="r-pass2">Confirmar contraseña</label>
            <input
              id="r-pass2"
              type="password"
              placeholder="Repite tu contraseña"
              autocomplete="new-password"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>

          <label class="terms-check">
            <input type="checkbox" [(ngModel)]="aceptaTerminos" name="terminos" />
            Acepto los términos de uso y el aviso de privacidad.
          </label>

          <div *ngIf="validationError()" class="auth-error">{{ validationError() }}</div>
          <div *ngIf="error()" class="auth-error">{{ error() }}</div>

          <button
            type="submit"
            class="submit-btn auth-submit"
            [disabled]="!formListo() || loading()"
          >
            {{ loading() ? 'Creando cuenta...' : '→ Crear cuenta' }}
          </button>
        </form>

        <div class="auth-links">
          <span>¿Ya tienes cuenta?</span>
          <a routerLink="/auth/login">Inicia sesión</a>
        </div>
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
    }
    .auth-container {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .auth-card {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 40px;
      width: 100%;
      max-width: 460px;
    }
    .eyebrow {
      font-size: 12px;
      letter-spacing: 2px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 28px;
      color: var(--np-white);
      margin-bottom: 8px;
      font-weight: 700;
      span { color: var(--np-accent); }
    }
    .auth-sub { color: var(--np-gray); font-size: 14px; margin-bottom: 24px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .terms-check {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 13px;
      color: var(--np-gray);
      cursor: pointer;
      line-height: 1.5;
      input { margin-top: 2px; accent-color: var(--np-accent); }
    }
    .auth-error {
      background: rgba(255, 77, 0, 0.1);
      border: 1px solid var(--np-accent2);
      color: var(--np-accent2);
      font-size: 13px;
      padding: 10px 14px;
    }
    .auth-submit { width: 100%; margin-top: 4px; }
    .auth-links {
      margin-top: 22px;
      text-align: center;
      font-size: 13px;
      color: var(--np-gray);
      a { color: var(--np-accent); text-decoration: none; margin-left: 6px; }
      a:hover { text-decoration: underline; }
    }
  `],
})
export class RegistroComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombre = signal('');
  email = signal('');
  telefono = signal('');
  password = signal('');
  confirmPassword = signal('');
  aceptaTerminos = signal(false);

  loading = signal(false);
  error = signal<string | null>(null);

  formListo = computed(() =>
    !!this.nombre() && !!this.email() && !!this.password() &&
    !!this.confirmPassword() && this.aceptaTerminos(),
  );

  validationError = computed(() => {
    const pass = this.password();
    if (pass) {
      if (pass.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
      }
      if (!/[a-z]/.test(pass) || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
        return 'La contraseña debe incluir mayúsculas, minúsculas y números.';
      }
    }
    if (this.confirmPassword() && this.password() !== this.confirmPassword()) {
      return 'Las contraseñas no coinciden.';
    }
    return null;
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);

    if (this.validationError() || !this.formListo()) return;

    this.loading.set(true);
    try {
      await this.auth.register({
        nombre: this.nombre(),
        email: this.email(),
        telefono: this.telefono() || undefined,
        password: this.password(),
      });

      this.router.navigateByUrl(rutaInicioSegunRol(this.auth));
    } catch (err) {
      this.error.set(mensajeDeError(err, 'No se pudo crear la cuenta.'));
    } finally {
      this.loading.set(false);
    }
  }
}
