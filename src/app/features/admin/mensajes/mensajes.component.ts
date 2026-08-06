import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, NgClass, SlicePipe } from '@angular/common';
import { MensajesService } from '@core/services/mensajes.service';
import { Mensaje, MensajeOrigen } from '@models/mensaje.model';

type Filtro = 'todos' | MensajeOrigen;

@Component({
  selector: 'app-admin-mensajes',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, SlicePipe],
  template: `
    <div class="panel-header">
      <div>
        <h1 class="panel-title"><span>//</span> Mensajes</h1>
        <p class="panel-subtitle">
          Mensajes de Contacto (público) y Soporte (usuarios). Se guardan solo
          en memoria del servidor: si el backend se reinicia, la bandeja se
          vacía.
        </p>
      </div>
    </div>

    <div class="filtros-row">
      <button
        *ngFor="let f of filtros"
        class="filtro-chip"
        [class.active]="filtro() === f.value"
        (click)="filtro.set(f.value)"
      >{{ f.label }}</button>
      <button class="mini-btn" style="margin-left:auto" (click)="cargar()">↻ Actualizar</button>
    </div>

    <p *ngIf="error()" class="form-error">{{ error() }}</p>

    <div class="panel-card panel-empty" *ngIf="cargando()">Cargando mensajes…</div>

    <div class="msg-list" *ngIf="!cargando() && mensajesFiltrados().length; else vacio">
      <div class="msg-card" *ngFor="let m of mensajesFiltrados()">
        <div class="msg-top">
          <div>
            <div class="msg-nombre">{{ m.nombre }} <span class="msg-origen">· {{ m.origen }}</span></div>
            <div class="msg-email">{{ m.email }}</div>
          </div>
          <span class="status-badge" [ngClass]="m.estado === 'nuevo' ? 'status-pendiente' : 'status-completada'">
            {{ m.estado }}
          </span>
        </div>
        <div class="msg-asunto">{{ m.asunto }}</div>
        <p class="msg-cuerpo">{{ m.mensaje }}</p>
        <div class="msg-footer">
          <span class="msg-fecha">{{ m.creadoEn | slice: 0:10 }}</span>
          <button
            *ngIf="m.estado === 'nuevo'"
            class="mini-btn"
            (click)="marcarRespondido(m.id)"
          >Marcar como respondido</button>
        </div>
      </div>
    </div>

    <ng-template #vacio>
      <div class="panel-card panel-empty">No hay mensajes {{ filtro() === 'todos' ? '' : ('de ' + filtro()) }}.</div>
    </ng-template>
  `,
  styles: [`
    .filtros-row { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .filtro-chip {
      background: #141414; border: 1px solid #2a2a2a; color: var(--np-gray);
      font-family: var(--font-mono); font-size: 12.5px; padding: 7px 14px; cursor: pointer;
      text-transform: capitalize;
      &:hover { border-color: var(--np-accent); color: var(--np-white); }
      &.active { background: var(--np-accent); color: var(--np-black); border-color: var(--np-accent); font-weight: 700; }
    }
    .msg-list { display: flex; flex-direction: column; gap: 14px; }
    .msg-card { background: var(--np-surface); border: 1px solid #222; padding: 20px 22px; }
    .msg-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 12px; }
    .msg-nombre { color: var(--np-white); font-weight: 700; font-size: 14.5px; }
    .msg-origen { color: var(--np-gray); font-weight: 400; text-transform: capitalize; font-size: 12px; }
    .msg-email { color: var(--np-gray); font-size: 12.5px; margin-top: 2px; }
    .msg-asunto { color: var(--np-accent); font-size: 13px; letter-spacing: 0.5px; margin-bottom: 8px; }
    .msg-cuerpo { color: var(--np-light); font-size: 13.5px; line-height: 1.6; margin-bottom: 14px; }
    .msg-footer { display: flex; justify-content: space-between; align-items: center; }
    .msg-fecha { color: var(--np-gray); font-size: 11.5px; }
    .mini-btn {
      background: transparent; border: 1px solid #333; color: var(--np-gray);
      font-family: var(--font-mono); font-size: 11px; padding: 6px 12px; cursor: pointer;
      &:hover { border-color: var(--np-accent); color: var(--np-white); }
    }
  `],
})
export class AdminMensajesComponent {
  private mensajesService = inject(MensajesService);

  filtro = signal<Filtro>('todos');
  cargando = signal(true);
  error = signal<string | null>(null);

  filtros: { value: Filtro; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'contacto', label: 'Contacto' },
    { value: 'soporte', label: 'Soporte' },
  ];

  private mensajes = signal<Mensaje[]>([]);

  mensajesFiltrados = computed(() =>
    this.filtro() === 'todos'
      ? this.mensajes()
      : this.mensajes().filter((m) => m.origen === this.filtro()),
  );

  constructor() {
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      this.mensajes.set(await this.mensajesService.getMensajes());
    } catch {
      this.error.set(
        'No se pudieron cargar los mensajes. Recuerda que se guardan solo en memoria: si el backend se reinició, la bandeja empieza vacía.',
      );
    } finally {
      this.cargando.set(false);
    }
  }

  async marcarRespondido(id: string): Promise<void> {
    const anterior = this.mensajes();

    this.mensajes.set(
      anterior.map((m) => (m.id === id ? { ...m, estado: 'respondido' } : m)),
    );
    try {
      await this.mensajesService.marcarComo(id, 'respondido');
    } catch {
      this.mensajes.set(anterior);
      this.error.set('No se pudo marcar el mensaje como respondido.');
    }
  }
}
