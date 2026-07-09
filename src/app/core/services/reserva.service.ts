import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NuevaReservaPayload, Reserva } from '@models/reserva.model';
import { SalasService } from './salas.service';

const RESERVAS_DB_KEY = 'np_reservas_db';

/**
 * Persistencia mock de reservas en localStorage, con toda la "base de datos"
 * compartida (no solo la del usuario actual) para que el futuro panel de
 * Admin pueda leer las mismas reservas.
 *
 * TODO(API): reemplazar por HttpClient contra el backend real.
 */
@Injectable({ providedIn: 'root' })
export class ReservaService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private salasService = inject(SalasService);

  getReservasDeUsuario(usuarioId: string): Reserva[] {
    return this.getDb()
      .filter((r) => r.usuarioId === usuarioId)
      .sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1));
  }

  /** Usado por el panel de Admin: todas las reservas de todos los usuarios. */
  getAllReservas(): Reserva[] {
    return this.getDb().sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1));
  }

  /** Usado por el panel de Admin: cambia el estado de cualquier reserva. */
  actualizarEstado(id: string, estado: Reserva['estado']): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = this.getDb().map((r) => (r.id === id ? { ...r, estado } : r));
        this.saveDb(db);
        resolve();
      }, 350);
    });
  }

  getReservaById(id: string): Reserva | undefined {
    return this.getDb().find((r) => r.id === id);
  }

  crearReserva(payload: NuevaReservaPayload): Promise<Reserva> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sala = this.salasService.getSalaById(payload.salaId);
        if (!sala) {
          reject(new Error('La sala seleccionada ya no está disponible.'));
          return;
        }

        const precioSala = sala.precio * payload.duracionHoras;
        const precioServicios = payload.servicios.reduce((sum, s) => sum + s.subtotal, 0);

        const reserva: Reserva = {
          id: this.generateId(),
          usuarioId: payload.usuarioId,
          salaId: sala.id,
          salaNombre: sala.name,
          fecha: payload.fecha,
          hora: payload.hora,
          duracionHoras: payload.duracionHoras,
          precioSala,
          servicios: payload.servicios,
          precioServicios,
          precioTotal: precioSala + precioServicios,
          estado: 'confirmada',
          notas: payload.notas,
          creadoEn: new Date().toISOString(),
        };

        this.saveDb([...this.getDb(), reserva]);
        resolve(reserva);
      }, 600);
    });
  }

  cancelarReserva(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = this.getDb().map((r) =>
          r.id === id ? { ...r, estado: 'cancelada' as const } : r,
        );
        this.saveDb(db);
        resolve();
      }, 400);
    });
  }

  private getDb(): Reserva[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(RESERVAS_DB_KEY);
      return raw ? (JSON.parse(raw) as Reserva[]) : [];
    } catch {
      return [];
    }
  }

  private saveDb(db: Reserva[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(RESERVAS_DB_KEY, JSON.stringify(db));
  }

  private generateId(): string {
    return `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
