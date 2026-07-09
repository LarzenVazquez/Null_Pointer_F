import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Placeholder temporal para /usuario y /admin mientras se construyen
 * los paneles completos en la siguiente fase. Confirma que el login,
 * los guards y las rutas protegidas ya funcionan de punta a punta.
 */
@Component({
  selector: 'app-en-construccion',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="ec-wrap">
      <div class="ec-card">
        <div class="ec-eyebrow">// Panel en construcción</div>
        <h1>Hola, {{ auth.currentUser()?.nombre }} 👋</h1>
        <p>
          Tu sesión funciona correctamente como
          <strong>{{ auth.currentUser()?.rol === 'admin' ? 'administrador' : 'usuario' }}</strong>.
          Este panel se construye en la siguiente fase del proyecto.
        </p>
        <button class="btn-back" (click)="logout()">Cerrar sesión</button>
      </div>
    </div>
  `,
  styles: [`
    .ec-wrap {
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .ec-card {
      background: var(--np-surface);
      border: 1px solid #222;
      padding: 40px;
      max-width: 480px;
      text-align: center;
    }
    .ec-eyebrow {
      font-size: 12px;
      letter-spacing: 2px;
      color: var(--np-accent);
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    h1 { font-size: 24px; color: var(--np-white); margin-bottom: 14px; }
    p { color: var(--np-gray); line-height: 1.6; margin-bottom: 24px; font-size: 14px; }
  `],
})
export class EnConstruccionComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
