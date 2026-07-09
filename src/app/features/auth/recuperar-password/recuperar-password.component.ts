import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <a routerLink="/auth/login">Iniciar sesión</a>
      <span>/</span>
      <span>Recuperar contraseña</span>
    </nav>

    <div class="auth-container">
      <div class="auth-card">
        <ng-container *ngIf="!enviado(); else confirmacion">
          <div class="eyebrow">// Recuperar acceso</div>
          <h1>¿Olvidaste tu <span>contraseña</span>?</h1>
          <p class="auth-sub">
            Escribe el correo con el que te registraste y te enviaremos instrucciones
            para restablecerla.
          </p>

          <form class="auth-form" (submit)="onSubmit($event)">
            <div class="np-field">
              <label for="rp-email">Correo</label>
              <input
                id="rp-email"
                type="email"
                placeholder="tu@email.com"
                autocomplete="email"
                [(ngModel)]="email"
                name="email"
                required
              />
            </div>

            <button
              type="submit"
              class="submit-btn auth-submit"
              [disabled]="!email() || loading()"
            >
              {{ loading() ? 'Enviando...' : '→ Enviar instrucciones' }}
            </button>
          </form>

          <div class="auth-links">
            <a routerLink="/auth/login">← Volver a iniciar sesión</a>
          </div>
        </ng-container>

        <ng-template #confirmacion>
          <div class="ok-icon">✓</div>
          <h1>Revisa tu <span>correo</span></h1>
          <p class="auth-sub">
            Si <strong>{{ email() }}</strong> está registrado, te enviamos instrucciones
            para restablecer tu contraseña.
          </p>
          <a routerLink="/auth/login" class="submit-btn auth-submit as-link">
            → Volver a iniciar sesión
          </a>
        </ng-template>
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
      max-width: 440px;
      text-align: left;
    }
    .eyebrow {
      font-size: 12px;
      letter-spacing: 2px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 26px;
      color: var(--np-white);
      margin-bottom: 8px;
      font-weight: 700;
      span { color: var(--np-accent); }
    }
    .auth-sub { color: var(--np-gray); font-size: 14px; margin-bottom: 24px; line-height: 1.6; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .auth-submit { width: 100%; margin-top: 4px; }
    .as-link { display: block; text-align: center; text-decoration: none; }
    .auth-links {
      margin-top: 22px;
      text-align: center;
      font-size: 13px;
      a { color: var(--np-accent); text-decoration: none; }
      a:hover { text-decoration: underline; }
    }
    .ok-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--np-accent);
      color: var(--np-black);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 22px;
      margin-bottom: 18px;
    }
  `],
})
export class RecuperarPasswordComponent {
  private auth = inject(AuthService);

  email = signal('');
  loading = signal(false);
  enviado = signal(false);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.loading.set(true);
    try {
      await this.auth.recoverPassword(this.email());
      this.enviado.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
