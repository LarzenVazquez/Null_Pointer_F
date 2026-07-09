import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const FAVORITOS_DB_KEY = 'np_favoritos_db';

type FavoritosDb = Record<string, string[]>; // usuarioId -> salaIds

/**
 * Favoritos mock por usuario, persistidos en localStorage.
 * TODO(API): reemplazar por HttpClient contra el backend real.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Se re-emite cada vez que cambian los favoritos para que los componentes
  // que dependan de esta señal se refresquen automáticamente.
  private version = signal(0);

  getFavoritos(usuarioId: string): string[] {
    this.version();
    const db = this.getDb();
    return db[usuarioId] ?? [];
  }

  esFavorito(usuarioId: string, salaId: string): boolean {
    return this.getFavoritos(usuarioId).includes(salaId);
  }

  toggleFavorito(usuarioId: string, salaId: string): void {
    const db = this.getDb();
    const actuales = db[usuarioId] ?? [];
    db[usuarioId] = actuales.includes(salaId)
      ? actuales.filter((id) => id !== salaId)
      : [...actuales, salaId];
    this.saveDb(db);
    this.version.update((v) => v + 1);
  }

  private getDb(): FavoritosDb {
    if (!this.isBrowser) return {};
    try {
      const raw = localStorage.getItem(FAVORITOS_DB_KEY);
      return raw ? (JSON.parse(raw) as FavoritosDb) : {};
    } catch {
      return {};
    }
  }

  private saveDb(db: FavoritosDb): void {
    if (!this.isBrowser) return;
    localStorage.setItem(FAVORITOS_DB_KEY, JSON.stringify(db));
  }
}
