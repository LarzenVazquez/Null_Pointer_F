import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { rutaInicioSegunRol } from '@core/guards/auth.guard';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <nav class="np-breadcrumb">
      <a routerLink="/">Inicio</a>
      <span>/</span>
      <span>Iniciar sesión</span>
    </nav>

    <div class="auth-container">
      <div class="auth-card">
        <div class="eyebrow">// Bienvenido de vuelta</div>
        <h1>Inicia <span>sesión</span></h1>
        <p class="auth-sub">Accede a tu cuenta para gestionar tus reservas.</p>

        <div class="demo-hint">
          <strong>Modo demo:</strong> admin&#64;nullpointer.mx / admin123
          &nbsp;·&nbsp; cliente&#64;nullpointer.mx / cliente123
        </div>

        <form class="auth-form" (submit)="onSubmit($event)">
          <div class="np-field">
            <label for="l-email">Correo</label>
            <input
              id="l-email"
              type="email"
              placeholder="tu@email.com"
              autocomplete="email"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="np-field">
            <label for="l-pass">Contraseña</label>
            <input
              id="l-pass"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>

          <div *ngIf="error()" class="auth-error">{{ error() }}</div>

          <button
            type="submit"
            class="submit-btn auth-submit"
            [disabled]="!email() || !password() || loading()"
          >
            {{ loading() ? 'Entrando...' : '→ Iniciar sesión' }}
          </button>
        </form>

        <div class="auth-links">
          <a routerLink="/auth/recuperar-password">¿Olvidaste tu contraseña?</a>
          <span class="dot">·</span>
          <a routerLink="/auth/registro">Crear cuenta nueva</a>
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
      max-width: 440px;
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
    .auth-sub { color: var(--np-gray); font-size: 14px; margin-bottom: 20px; }
    .demo-hint {
      background: #0f0f0f;
      border: 1px dashed #333;
      color: var(--np-gray);
      font-size: 12px;
      padding: 10px 14px;
      margin-bottom: 24px;
      line-height: 1.6;
      strong { color: var(--np-accent); }
    }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
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
      a { color: var(--np-accent); text-decoration: none; }
      a:hover { text-decoration: underline; }
      .dot { margin: 0 8px; color: #444; }
    }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);
    this.loading.set(true);

    try {
      await this.auth.login({
        email: this.email(),
        password: this.password(),
      });

      const redirect = this.route.snapshot.queryParamMap.get('redirect');
      const destino = redirect || rutaInicioSegunRol(this.auth);
      this.router.navigateByUrl(destino);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      this.loading.set(false);
    }
  }
}
