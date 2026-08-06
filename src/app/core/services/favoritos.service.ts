import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

const API_URL = `${environment.apiUrl}/favoritos`;

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private favoritosSig = signal<string[]>([]);

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        const user = this.authService.currentUser();
        if (!user) {
          this.favoritosSig.set([]);
          return;
        }
        this.cargarFavoritos();
      });
    }
  }

  private async cargarFavoritos(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; favoritos: string[] }>(API_URL),
    );
    this.favoritosSig.set(res.favoritos);
  }

  getFavoritos(_usuarioId: string): string[] {
    return this.favoritosSig();
  }

  esFavorito(usuarioId: string, salaId: string): boolean {
    return this.getFavoritos(usuarioId).includes(salaId);
  }

  async toggleFavorito(_usuarioId: string, salaId: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; favoritos: string[] }>(`${API_URL}/${salaId}/toggle`, {}),
    );
    this.favoritosSig.set(res.favoritos);
  }
}
