import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Mensaje, NuevoMensajePayload } from '@models/mensaje.model';

const MENSAJES_DB_KEY = 'np_mensajes_db';

/**
 * Centraliza los mensajes enviados desde el formulario público de Contacto
 * y desde Soporte (panel de usuario), para que el panel de Admin los liste.
 *
 * TODO(API): reemplazar por HttpClient contra el backend real.
 */
@Injectable({ providedIn: 'root' })
export class MensajesService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  enviarMensaje(payload: NuevoMensajePayload): void {
    const mensaje: Mensaje = {
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      ...payload,
      estado: 'nuevo',
      creadoEn: new Date().toISOString(),
    };
    this.saveDb([mensaje, ...this.getDb()]);
  }

  getMensajes(): Mensaje[] {
    return this.getDb().sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1));
  }

  marcarComo(id: string, estado: Mensaje['estado']): void {
    const db = this.getDb().map((m) => (m.id === id ? { ...m, estado } : m));
    this.saveDb(db);
  }

  private getDb(): Mensaje[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(MENSAJES_DB_KEY);
      return raw ? (JSON.parse(raw) as Mensaje[]) : [];
    } catch {
      return [];
    }
  }

  private saveDb(db: Mensaje[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(MENSAJES_DB_KEY, JSON.stringify(db));
  }
}
