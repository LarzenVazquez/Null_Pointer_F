import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Sala } from '@models/sala.model';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/salas`;

type SalaUpdatePayload = Partial<Pick<Sala, 'precio' | 'badgeLabel' | 'descripcion'>>;

@Injectable({ providedIn: 'root' })
export class SalasService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private salasSig = signal<Sala[]>([]);
  readonly salas = this.salasSig.asReadonly();

  constructor() {
    if (this.isBrowser) {
      this.cargarSalas();
    }
  }

  async cargarSalas(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; salas: Sala[] }>(API_URL),
    );
    this.salasSig.set(res.salas);
  }

  getSalas(): Sala[] {
    return this.salasSig();
  }

  getSalaById(id: string): Sala | undefined {
    return this.salasSig().find((s) => s.id === id);
  }

  async updateSala(id: string, cambios: SalaUpdatePayload): Promise<Sala> {
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; sala: Sala }>(`${API_URL}/${id}`, cambios),
    );
    this.salasSig.update((salas) => salas.map((s) => (s.id === id ? res.sala : s)));
    return res.sala;
  }
}
