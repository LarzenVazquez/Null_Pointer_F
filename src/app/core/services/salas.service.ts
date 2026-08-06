import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Sala, SalaFormData } from '@models/sala.model';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/salas`;

type SalaUpdatePayload = Partial<SalaFormData>;

function construirFormData(datos: Partial<SalaFormData>, archivoImagen?: File | null): FormData {
  const form = new FormData();

  if (datos.nombre !== undefined) form.append('nombre', datos.nombre);
  if (datos.precio !== undefined) form.append('precio', String(datos.precio));
  if (datos.capacidad !== undefined) form.append('capacidad', String(datos.capacidad));
  if (datos.m2 !== undefined) form.append('m2', String(datos.m2));
  if (datos.badge !== undefined) form.append('badge', datos.badge);
  if (datos.badgeLabel !== undefined) form.append('badgeLabel', datos.badgeLabel);
  if (datos.featured !== undefined) form.append('featured', String(datos.featured));
  if (datos.descripcion !== undefined) form.append('descripcion', datos.descripcion);
  if (datos.equipo !== undefined) form.append('equipo', JSON.stringify(datos.equipo));
  if (datos.imagenUrl !== undefined) form.append('imagenUrl', datos.imagenUrl);

  if (archivoImagen) {
    form.append('imagen', archivoImagen, archivoImagen.name);
  }

  return form;
}

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

  async crearSala(datos: SalaFormData, archivoImagen?: File | null): Promise<Sala> {
    const form = construirFormData(datos, archivoImagen);
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; sala: Sala }>(API_URL, form),
    );
    this.salasSig.update((salas) => [...salas, res.sala].sort((a, b) => a.id.localeCompare(b.id)));
    return res.sala;
  }

  async updateSala(
    id: string,
    cambios: SalaUpdatePayload,
    archivoImagen?: File | null,
  ): Promise<Sala> {
    const form = construirFormData(cambios, archivoImagen);
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; sala: Sala }>(`${API_URL}/${id}`, form),
    );
    this.salasSig.update((salas) => salas.map((s) => (s.id === id ? res.sala : s)));
    return res.sala;
  }

  async eliminarSala(id: string, forzar = false): Promise<void> {
    await firstValueFrom(
      this.http.delete<{ ok: boolean; mensaje: string }>(`${API_URL}/${id}`, {
        params: forzar ? { forzar: 'true' } : {},
      }),
    );
    this.salasSig.update((salas) => salas.filter((s) => s.id !== id));
  }
}
